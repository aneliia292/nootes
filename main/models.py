from django.db import models

# Модель пользователей
class User(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=45)
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

# Модель токенов — ключей входа
class Token(models.Model):
    key = models.CharField(max_length=40, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


# Модель заметок
class Notes(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    text = models.TextField()
    create_datetime = models.DateTimeField(auto_now_add=True)
    change_datetime = models.DateTimeField()

# Модель уведомлений
class Notifications(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.ForeignKey(Notes, on_delete=models.CASCADE)
    header = models.CharField(max_length=100)
    text = models.TextField()
    datetime = models.DateTimeField()
    type = models.IntegerField()
    is_read = models.BooleanField(default=False)
