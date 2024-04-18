from django.contrib import admin
from django.urls import path
from creatio import views
urlpatterns = [
    path('hello/', views.hello_world, name='hello-world'),
]
