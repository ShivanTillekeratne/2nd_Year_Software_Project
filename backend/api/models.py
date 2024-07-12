from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'AD', 'Admin'
        INVESTIGATOR = 'IN', 'Investigator'

    role = models.CharField(
        max_length=2,
        choices=Role.choices,
        default=Role.INVESTIGATOR,
    )
