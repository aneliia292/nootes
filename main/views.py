from django.shortcuts import render


def index(request):
    return render(request, 'main/index.html')


def signin(request):
    return render(request, 'main/signin.html')


def signup(request):
    return render(request, 'main/signup.html')


def notes(request):
    return render(request, 'main/notes.html')


def notifications(request):
    return render(request, 'main/notifications.html')


def profile(request):
    return render(request, 'main/profile.html')


def settings(request):
    return render(request, 'main/settings.html')
