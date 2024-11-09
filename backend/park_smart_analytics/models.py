from djongo import models


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    car_length = models.FloatField()
    electric = models.BooleanField()

    def __str__(self) -> str:
        return str(self.__dict__)
