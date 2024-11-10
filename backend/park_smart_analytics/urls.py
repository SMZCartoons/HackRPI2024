"""
URL configuration for park_smart_analytics project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("register", views.RegisterView.as_view(), name="register"),
    path("login", views.LoginView.as_view(), name="login"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("lot/<str:lot_id>", views.LotView.as_view(), name="lot_information"),
    path(
        "lot/closest/current/<str:lot_id>",
        views.ClosestCurrentLotLot.as_view(),
        name="nearest_lot_to_lot_with_availability",
    ),
    path("lots", views.LotsView.as_view(), name="lots_information"),
    path("buildings", views.BuildingsView.as_view(), name="buildings_information"),
    path(
        "building/closest/current/<str:building_id>",
        views.ClosestCurrentLotBuilding.as_view(),
        name="nearest_lot_to_building_with_availability",
    ),
    path("checkin/<str:lot_id>", views.CheckIn.as_view(), name="checkin"),
    path("checkout/<str:lot_id>", views.CheckOut.as_view(), name="checkout"),
    path("leaderboard", views.LeaderBoard.as_view(), name="leaderboard"),
    path("prediction", views.Prediction.as_view(), name="prediction"),
]
