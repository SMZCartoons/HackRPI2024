from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Lots, Buildings
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    LeaderBoardSerializer,
    LotSerializer,
    LotsSerializer,
    LotsSerializerAvaibility,
    BuildingSerializer,
    UserLoginSerializer,
    UserRegisterSerializer,
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
    def get(self, request, lot_id) -> Response:
        lot = get_object_or_404(Lots, lot_id=lot_id)
        serializer = LotSerializer(lot)
        return Response(serializer.data)


class LotsView(APIView):
    def get(self, request) -> Response:
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
        return Response(serializer.data)


class ClosestCurrentLotBuilding(APIView):
    def get(self, _, building_id) -> Response:
        lots = get_closest_available_lots_building(building_id, 1)
        serializer = LotsSerializerAvaibility(lots, many=True)
        return Response(serializer.data)


class CheckIn(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, lot_id) -> Response:
        data = request.data  # This is already a parsed dictionary
        is_electric = False
        is_disability = False
        if data:
            is_disability = data.get("disability", False)
            is_electric = data.get("electric", False)

        lot = get_object_or_404(Lots, lot_id=lot_id)
        user = request.user

        with transaction.atomic():
            lot.available -= 1
            user.checked_in = True

            if is_electric:
                lot.electrified_available -= 1
                user.checked_in_electric = True
            if is_disability:
                lot.handicap_available -= 1
                user.checked_in_disability = True

            user.points += 1

            lot.save()
            user.save()

        return Response({"status": "ok"})


class CheckOut(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, lot_id) -> Response:

        lot = get_object_or_404(Lots, lot_id=lot_id)
        user = request.user

        with transaction.atomic():
            lot.available += 1
            user.checked_in = False

            if user.checked_in_electric:
                lot.electrified_available += 1
                user.checked_in_electric = False
            if user.checked_in_disability:
                lot.handicap_available += 1
                user.checked_in_disability = False

            user.points += 2

            lot.save()
            user.save()

        return Response({"status": "ok"})


class LeaderBoard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request) -> Response:
        users = User.objects.all().order_by("-points")[:20]
        user = request.user

        serializer = LeaderBoardSerializer(
            users, many=True, context={"queryset": users}
        )

        serialized_data = list(serializer.data)

        if user not in users:
            user_rank = users.filter(points__gt=user.points).count() + 1
            current_user_data = LeaderBoardSerializer(
                user, context={"rank": user_rank}
            ).data
            serialized_data.append(current_user_data)

        return Response(serialized_data)
