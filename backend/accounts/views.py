from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer
)
from nutrition.models import HealthProfile

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        extra = request.data.get("additional_data")
        if isinstance(extra, dict):
            profile, _ = HealthProfile.objects.get_or_create(user=user)
            age = extra.get("age")
            if age is not None and str(age).strip():
                try:
                    profile.age = int(age)
                except (ValueError, TypeError):
                    pass
            profile.gender = (extra.get("gender") or "")[:32]
            profile.tribe = (extra.get("tribe") or "")[:120]
            profile.health_info = extra.get("health_info") or ""
            profile.allergies = extra.get("allergies") or ""
            profile.save()
        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user, context=self.get_serializer_context()).data
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
