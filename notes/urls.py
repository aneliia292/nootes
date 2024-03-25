"""
URL configuration for notes project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from main.api import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('signin/', include('main.urls')),
    path('signup/', include('main.urls')),
    # -----------------------------------
    path('api/users/', UsersAPIView.as_view()),
    path('api/user/', UserAPIView.as_view()),
    path('api/token/', TokenAPIView.as_view()),
    path('api/logout/', TokenLogoutAPIView.as_view()),
    path('api/notes/', NotesAPIView.as_view()),
    path('api/note/id/<int:pk>/', NoteAPIView.as_view()),
    path('api/notifications/', NotificationsAPIView.as_view()),
    path('api/notification/id/<int:pk>/', NotificationAPIView.as_view()),
]
