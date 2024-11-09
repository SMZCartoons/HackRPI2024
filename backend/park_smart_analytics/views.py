from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Lots
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    LotSerializer,
    LotsSerializer,
)
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
