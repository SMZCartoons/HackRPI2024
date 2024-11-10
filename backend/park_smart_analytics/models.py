from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db.models.signals import pre_save
from django.dispatch import receiver


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    make = models.CharField(max_length=30)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    car_length = models.FloatField()
    electrified = models.BooleanField()

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self) -> str:
        return str(self.__dict__)


class Lots(models.Model):
    id = models.AutoField(primary_key=True)
    lot_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=100)
    total = models.IntegerField()
    available = models.IntegerField()
    electrified = models.IntegerField()
    electrified_available = models.IntegerField()
    handicap = models.IntegerField()
    handicap_available = models.IntegerField()

    def __str__(self) -> str:
        return str(self.__dict__)


@receiver(pre_save, sender=Lots)
def set_lot_id(sender, instance, **kwargs):
    if not instance.lot_id:
        # Get the last Lot entry's lot_id, extract the number and increment it.
        last_lot = Lots.objects.all().order_by("-id").first()
        if last_lot:
            new_number = last_lot.id + 1
        else:
            new_number = 1  # If no Lots exist yet, start from 1
        instance.lot_id = f"Lot{new_number}"


class Buildings(models.Model):
    id = models.AutoField(primary_key=True)
    building_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return str(self.__dict__)


@receiver(pre_save, sender=Lots)
def set_building_id(sender, instance, **kwargs):
    if not instance.building_id:
        # Get the last Lot entry's lot_id, extract the number and increment it.
        last_lot = Lots.objects.all().order_by("-id").first()
        if last_lot:
            new_number = last_lot.id + 1
        else:
            new_number = 1  # If no Lots exist yet, start from 1
        instance.building_id = f"Lot{new_number}"


class BuildingLotDistance(models.Model):
    building = models.ForeignKey(
        Buildings, on_delete=models.CASCADE, related_name="lot_distances"
    )
    lot = models.ForeignKey(
        Lots, on_delete=models.CASCADE, related_name="building_distances"
    )
    distance = models.FloatField()

    class Meta:
        unique_together = ("building", "lot")  # Ensures unique building-lot pairs

    def __str__(self) -> str:
        return str(self.__dict__)


class LotLotDistance(models.Model):
    lot1 = models.ForeignKey(
        Lots, on_delete=models.CASCADE, related_name="lot1_distances"
    )
    lot2 = models.ForeignKey(
        Lots, on_delete=models.CASCADE, related_name="lot2_distances"
    )
    distance = models.FloatField()

    class Meta:
        unique_together = ("lot1", "lot2")  # Ensures unique lot-lot pairs

    def __str__(self) -> str:
        return str(self.__dict__)
