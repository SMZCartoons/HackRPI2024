from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Lots, Buildings
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import pickle
import json
from datetime import datetime
from sklearn.neighbors import KNeighborsRegressor
import numpy as np

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

class Prediction(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request) -> Response:
        with open('park_smart_analytics\\total_spots_model.pkl', 'rb') as f:
            total_spots = pickle.load(f)

        with open('park_smart_analytics\\handi_spots_model.pkl', 'rb') as f:
            handi_spots = pickle.load(f)

        with open('park_smart_analytics\\electric_spots_model.pkl', 'rb') as f:
            electric_spots = pickle.load(f)
        data = request.data  
        req_time = str()
        req_name = str()
        if data:
            req_time = data.get('time', None)
            req_name = data.get('name', None)

        # if not req_time or not req_name: 
        req_min = int(req_time.strip()[2:])
        req_time = int(req_time.strip()[0])
        if req_min>=30: req_time = (req_time+1) % 24
        
        print(req_time)

        lots = Lots.objects.filter(name__exact=req_name.strip())
        amnt_total = 0
        amnt_handy = 0
        amnt_elect = 0
        lot_id = 0
        dt = datetime.now()
        wkday = (dt.isoweekday()+1)%7

        for l in lots:
            amnt_total = l.total
            amnt_elect = l.electrified
            amnt_handy = l.handicap
            lot_id = l.id
        
        spots = total_spots.predict(np.array([[lot_id, wkday, req_time, amnt_total]]))
        handy = handi_spots.predict(np.array([[lot_id, wkday, req_time, amnt_handy]]))
        electric = electric_spots.predict(np.array([[lot_id, wkday, req_time, amnt_elect]]))
        s_p = int(spots[0])
        h_p = int(handy[0])
        e_p = int(electric[0])
        return Response({"Total Spots": s_p, "Handicap Spots": h_p, "Electric Spots": e_p})

        # print(lots.val)#, lots.get('electrified'), lots.get('handicap'))

        # is_electric = False
        # is_disability = False
        # if data:
        #     is_disability = data.get("disability", False)
        #     is_electric = data.get("electric", False)
        
        

        # get request data, with the time, 
        

        # users = User.objects.all().order_by("-points")[:20]
        # user = request.user

        # serializer = LeaderBoardSerializer(
        #     users, many=True, context={"queryset": users}
        # )

        # serialized_data = list(serializer.data)

        # if user not in users:
        #     user_rank = users.filter(points__gt=user.points).count() + 1
        #     current_user_data = LeaderBoardSerializer(
        #         user, context={"rank": user_rank}
        #     ).data
        #     serialized_data.append(current_user_data)

        return Response(None)
