import binascii
import datetime
import hashlib
import os
from rest_framework.views import APIView
from rest_framework.response import Response

from main.models import Notes, Notifications, Token, User
from main.reminder import create_telegram_reminder

tz = datetime.timezone(datetime.timedelta(hours=3, minutes=0))


# Проверяем токен в запросе request и сверяем с базой данных
def check_token_in_request(request, return_user_id=False):
    token = request.headers.get('Token')
    token_model = Token.objects.filter(key=token).first()
    if return_user_id and (token_model is not None):
        return token_model.user_id
    elif return_user_id:
        return 0
    # -----------------------------------------
    if token_model is None:
        return False
    return True

# Получить текущую дату и время
def get_datetime_now():
    delta = datetime.timedelta(hours=3, minutes=0)
    return datetime.datetime.now(datetime.timezone.utc) + delta

def get_datetime_by_paramets(year, month, day, hours, minutes, seconds):
    return datetime.datetime(year, month, day, hours, minutes, seconds, tzinfo=tz)


def get_date_and_time_from_datetime(object_datetime):
    date_str = object_datetime.strftime("%d.%m.%Y")
    time_str = object_datetime.strftime("%H:%M")
    return [date_str, time_str]

def check_datetime_in_request(request):
    if "date" not in request.data.keys() or "time" not in request.data.keys():
        return {"Error": "There must be 'date' and 'time' fields"}
    date_str = request.data['date']
    time_str = request.data['time']
    if len(date_str.split('.')) != 3:
        return {"Error": "There should be a day, month and year in this form: '%d.%m.%y'"}
    if len(time_str.split(':')) != 2:
        return {"Error": "There should be a hours and minutes in this form: '%H:%M'"}
    day, month, year = list(map(int, date_str.split('.')))
    hours, minutes = list(map(int, time_str.split(':')))
    try:
        answer = datetime.datetime(year, month, day, hours, minutes, tzinfo=tz)
        return answer
    except Exception as ex:
        return {"Error": str(ex)}

# Генерирует токен (случайный набор букв и цифр)
def generate_key():
    return binascii.hexlify(os.urandom(20)).decode()


# "/api/users/"
# GET - получить список всех пользователей
# POST - создать нового пользователя (регистрация пользователя)
class UsersAPIView(APIView):
    def get(self, request):
        answer = dict()
        for user_model in User.objects.all():
            answer2 = dict()
            answer2['id'] = user_model.id
            answer2['name'] = user_model.name
            answer2['email'] = user_model.email
            answer[user_model.id] = answer2
        return Response(answer)
    
    def post(self, request):
        # Проверка входных данных
        if "name" not in request.data.keys():
            if "email" not in request.data.keys():
                if "password" not in request.data.keys():
                    if "passwordagain" not in request.data.keys():
                        return Response({'Error': "Not found 'passwordagain'"})
                    return Response({'Error': "Not found 'password'"})
                return Response({'Error': "Not found 'email'"})
            return Response({'Error': "Not found 'name'"})
        # ------------------------------------------------
        name = request.data['name']
        email = request.data['email']
        password = request.data['password']
        # Проверка пароля
        if password != request.data['passwordagain']:
            return Response({'Error': 'Passwords do not match'})
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        # -------------------------------------------------------------
        # Создание пользователя
        try:
            User.objects.create(
                name=name,
                email=email,
                password=hashed_password
            )
            return Response({'Ok': 'The user has been created'})
        except Exception as ex:
            return Response({"Error": str(ex)})


# "/api/user/"
# GET - Получить информацию о себе
class UserAPIView(APIView):
    def get(self, request):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user_model = User.objects.filter(id=user_id).first()
            answer = dict()
            answer['id'] = user_model.id
            answer['name'] = user_model.name
            answer['email'] = user_model.email
            return Response(answer)
        return Response({"Error": "Token not found"})


# "/api/token/"
# POST - вход для пользователей (проверяет почту и пароль, а затем возвращает токен)
class TokenAPIView(APIView):
    def post(self, request):
        # Проверка почты и пароля в request
        if "email" not in request.data.keys():
            if "password" not in request.data.keys():
                return Response({'Error': "Not found 'password'"})
            return Response({'Error': "Not found 'email'"})
        # --------------------------------------------------
        # Проверка существования пользователя с таой почтой
        user = User.objects.filter(email=request.data['email']).first()
        if user is None:
            return Response({"Error": "User not found"})
        # Проверка корректности пароля
        if user.password != hashlib.sha256(request.data['password'].encode()).hexdigest():
            return Response({'Error': "Passwords don't match"})
        # -----------------------------------------------------
        # Проверка, если есть токен - отправляем пользователю
        check_token = Token.objects.filter(user=user).first()
        if check_token is not None:
            return Response({"key": check_token.key, "user_id": check_token.user.id, "created": check_token.created})
        # Если нет, создаём и также отправляем пользователю
        key = generate_key()
        token = Token.objects.create(
            key=key,
            user=user,
            created=get_datetime_now()
        )
        return Response({"key": token.key, "user_id": token.user.id, "created": token.created})


# "/api/logout/"
# GET - выход из аккаунта (удаляем пароль)
class TokenLogoutAPIView(APIView):
    def get(self, request):
        if check_token_in_request(request):
            token = Token.objects.filter(key=request.headers.get('Token')).first()
            token.delete()
            return Response({"Ok": "The token has been deleted"})
        return Response({"Error": "Token not found"})


# "/api/notes/"
# GET - получаем список всех заметок пользователя
# POST - создаём новую заметку
class NotesAPIView(APIView):
    def get(self, request):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            notes = Notes.objects.filter(user=user_id).all()
            answer = dict()
            for note_model in notes:
                answer2 = dict()
                answer2['id'] = note_model.id
                answer2['name'] = note_model.name
                answer2['text'] = note_model.text
                answer2['user_id'] = note_model.user.id
                answer2['create_date'] = get_date_and_time_from_datetime(note_model.create_datetime)[0]
                answer2['create_time'] = get_date_and_time_from_datetime(note_model.create_datetime)[1]
                answer2['change_date'] = get_date_and_time_from_datetime(note_model.change_datetime)[0]
                answer2['change_time'] = get_date_and_time_from_datetime(note_model.change_datetime)[1]
                answer[note_model.id] = answer2
            return Response(answer)
        return Response({"Error": "Token not found"})
    
    def post(self, request):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            # Проверка входных данных
            if "text" not in request.data.keys():
                if "name" not in request.data.keys():
                    return Response({'Error': "Not found 'name'"})
                return Response({'Error': "Not found 'text'"})
            # ------------------------------------------------
            # Создание новой заметки
            name = request.data['name']
            text = request.data['text']
            Notes.objects.create(
                name=name,
                text=text,
                change_datetime=get_datetime_now(),
                user=user
            )
            return Response({"Ok": "A new note has been created"}) 
        return Response({"Error": "Token not found"})


# "/api/note/id/<int:pk>/"
# GET - получаем заметку по id, если она принадлежит пользователю
# POST - изменяем заметку по id, если она принадлежит пользователю
# DELETE - удаляем замтку по id, если она принадлежит пользователю
class NoteAPIView(APIView):
    def get(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            note = Notes.objects.filter(id=pk, user=user).first()
            if note is None:
                return Response({"Error": "Note not found"})
            return Response({
                "id": note.id,
                "name": note.name,
                "text": note.text,
                "create_date": get_date_and_time_from_datetime(note.create_datetime)[0],
                "create_time": get_date_and_time_from_datetime(note.create_datetime)[1],
                "change_date": get_date_and_time_from_datetime(note.change_datetime)[0],
                "change_time": get_date_and_time_from_datetime(note.change_datetime)[1],
                "user_id": note.user.id
            })
        return Response({"Error": "Token not found"})
    
    def post(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            note = Notes.objects.filter(id=pk, user=user).first()
            if note is None:
                return Response({"Error": "Note not found"})
            # ----------------------------------------------
            # Проверка входных данных и изменение замтки
            if "name" in request.data.keys():
                note.name = request.data["name"]
            if "text" in request.data.keys():
                note.text = request.data["text"]
            note.change_datetime = get_datetime_now()
            note.save()
            return Response({"Ok": "Note is saved"})
        return Response({"Error": "Token not found"})
    
    def delete(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            note = Notes.objects.filter(id=pk, user=user).first()
            if note is None:
                return Response({"Error": "Note not found"})
            note.delete()
            return Response({"Ok": "The note has been deleted"})
        return Response({"Error": "Token not found"})


# "/api/notifications/"
# GET - получение информации о всех уведомлениях пользователя
# POST - создание нового уведомления
class NotificationsAPIView(APIView):
    def get(self, request):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            notifications = Notifications.objects.filter(user=user).all()
            answer = dict()
            for notification in notifications:
                answer2 = dict()
                answer2['id'] = notification.id
                answer2['user_id'] = notification.user.id
                answer2['note_id'] = notification.note.id
                answer2['header'] = notification.header
                answer2['text'] = notification.text
                answer2['date'] = get_date_and_time_from_datetime(notification.datetime)[0]
                answer2['time'] = get_date_and_time_from_datetime(notification.datetime)[1]
                answer2['type'] = notification.type
                answer2['is_read'] = notification.is_read
                answer[notification.id] = answer2
            return Response(answer)
        return Response({"Error": "Token not found"})
    
    def post(self, request):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            # -------------------------------------------
            # Проверка входных данных
            if "note_id" not in request.data.keys():
                return Response({"Error": "note_id not found"})
            if "header" not in request.data.keys():
                return Response({"Error": "header not found"})
            if "text" not in request.data.keys():
                return Response({"Error": "text not found"})
            if type(check_datetime_in_request(request)) == dict:
                return Response(check_datetime_in_request(request))
            if "type" not in request.data.keys():
                return Response({"Error": "type not found"})
            # -------------------------------------------
            # Проверка существоания заметки
            note = Notes.objects.filter(id=request.data["note_id"]).first()
            if note is None:
                return Response({"Error": "Note not found in database"})
            # Создание нового уведомления
            notification = Notifications.objects.create(
                user=user,
                note=note,
                header=request.data["header"],
                text=request.data["text"],
                datetime=check_datetime_in_request(request),
                type=request.data["type"],
                is_read=False
            )
            # -----------------------------
            if request.data['type'] == "3":
                create_telegram_reminder(
                    object_datetime=notification.datetime,
                    text=f"""Напоминание: {notification.header}\nТекст напоминания: {notification.text}\nОт заметки: {notification.note.name}"""
                )
            # -------------------------------------------
            return Response({"Ok": "A new notification has been created"})
        return Response({"Error": "Token not found"})



# "/api/notification/id/<int:pk>/"
# GET - получение информации о уведомлении по id
# POST - изменение уведомления по id
# DELETE - удаление уведомления по id
class NotificationAPIView(APIView):
    def get(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            notification = Notifications.objects.filter(id=pk, user=user).first()
            if notification is None:
                return Response({"Error": "Notification not found"})
            return Response({
                "id": notification.id,
                "user_id": notification.user.id,
                "note_id": notification.note.id,
                "header": notification.header,
                "text": notification.text,
                "date": get_date_and_time_from_datetime(notification.datetime)[0],
                "time": get_date_and_time_from_datetime(notification.datetime)[1],
                "type": notification.type,
                "is_read": notification.is_read
            })
        return Response({"Error": "Token not found"})
    
    def post(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            notification = Notifications.objects.filter(id=pk, user=user).first()
            if notification is None:
                return Response({"Error": "Notification not found"})
            # ------------------------------------------------------
            # Проверка данных и изменение уведомления
            if "header" in request.data.keys():
                notification.header = request.data["header"]
            if "text" in request.data.keys():
                notification.text = request.data["text"]
            if "date" in request.data.keys():
                if type(check_datetime_in_request(request)) == dict:
                    return Response(check_datetime_in_request(request))
                else:
                    notification.datetime = check_datetime_in_request(request)
            if "type" in request.data.keys():
                notification.type = request.data["type"]
            if "is_read" in request.data.keys():
                notification.is_read = request.data["is_read"]
            # ------------------------------------------------------
            notification.save()
            return Response({"Ok": "Notification is saved"})
        return Response({"Error": "Token not found"})
    
    def delete(self, request, pk):
        if check_token_in_request(request):
            user_id = check_token_in_request(request, return_user_id=True)
            user = User.objects.filter(id=user_id).first()
            notification = Notifications.objects.filter(id=pk, user=user).first()
            if notification is None:
                return Response({"Error": "Notification not found"})
            notification.delete()
            return Response({"Ok": "The notification has been deleted"})
        return Response({"Error": "Token not found"})
