from django.db import models

# Create your models here.
class Data(models.Model):
    name = models.CharField(max_Length=200)
    description = models.CharField(max_Length=500)