import re
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from requests import get

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "password",
            "make",
            "model",
            "year",
        )

    def create(self, validated_data):
        car_query = f"https://www.carqueryapi.com/api/0.3/?cmd=getTrims&year={validated_data["year"]}&make={validated_data["make"]}&model={validated_data["model"]}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
        }
        response = get(car_query, headers=headers)
        validated_data["car_length"] = 0.0
        validated_data["electrified"] = False
        print(response.status_code)
        if response.status_code != 200:
            validated_data["make"] = ""
            validated_data["model"] = ""
            validated_data["year"] = 0
        else:
            response_json = response.json()
            print(response_json)
            if response_json:
                car = response_json["Trims"][0]
                if car["model_length_mm"]:
                    validated_data["car_length"] = (
                        float(car["model_length_mm"]) * 0.03937008
                    )
                if (
                    "electricity" == car["model_engine_type"].lower()
                    or "hybrid" in car["model_trim"].lower()
                    or "electric" == car["model_engine_type"].lower()
                ):
                    validated_data["electrified"] = True
            print(validated_data)

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
            make=validated_data["make"],
            model=validated_data["model"],
            year=validated_data["year"],
            car_length=validated_data["car_length"],
            electrified=validated_data["electrified"],
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Authenticate the user
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        # Generate refresh and access tokens
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),  # Accessing the access token correctly
        }
