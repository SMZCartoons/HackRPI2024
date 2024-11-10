from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Lots, Buildings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    LotSerializer,
    LotsSerializer,
    LotsSerializerAvaibility,
    BuildingSerializer,
)
from .query import get_closest_available_lots_building, get_closest_available_lots_lot
from django.contrib.auth import get_user_model

User = get_user_model()


def index(request) -> HttpResponse:
    return HttpResponse(
        "Hello, world. Let us help you with parking on your college campus."
    )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


class LoginView(APIView):
    def post(self, request) -> Response:
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LotView(APIView):
    def get(self, _, lot_id) -> Response:
        lot = get_object_or_404(Lots, lot_id=lot_id)
        serializer = LotSerializer(lot)
        return Response(serializer.data)


class LotsView(APIView):
    def get(self, _) -> Response:
        lots = Lots.objects.all()
        serializer = LotsSerializer(lots, many=True)
        return Response(serializer.data)


class ClosestCurrentLotLot(APIView):
    def get(self, _, lot_id) -> Response:
        lots = get_closest_available_lots_lot(lot_id, 1)
        serializer = LotsSerializerAvaibility(lots, many=True)
        return Response(serializer.data)


class BuildingsView(APIView):
    def get(self, _) -> Response:
        buildings = Buildings.objects.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(buildings)


class ClosestCurrentLotBuilding(APIView):
    def get(self, _, building_id) -> Response:
        lots = get_closest_available_lots_building(building_id, 1)
        serializer = LotsSerializerAvaibility(lots, many=True)
        return Response(serializer.data)
