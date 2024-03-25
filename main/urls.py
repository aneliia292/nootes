from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('signin/', views.signin),
    path('signup/', views.signup),
    path('notes/', views.notes),
    path('notifications/', views.notifications),
    path('profile/', views.profile),
    path('settings/', views.settings),
]