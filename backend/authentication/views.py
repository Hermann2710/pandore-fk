from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from users.models import User
from users.serializers import UserSerializer
from .serializers import RegisterSerializer


def _set_auth_cookies(response, refresh, user=None):
    access = str(refresh.access_token)
    opts = dict(
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(settings.AUTH_COOKIE_ACCESS, access, max_age=60 * 30, **opts)
    response.set_cookie(settings.AUTH_COOKIE_REFRESH, str(refresh), max_age=60 * 60 * 24 * 7, **opts)

    # Non-HTTP-only role cookie — readable by Next.js middleware for route protection.
    # Contains only the role string (not a token), so it carries no security risk.
    if user is not None:
        response.set_cookie(
            "pandore_role",
            user.role,
            max_age=60 * 60 * 24 * 7,
            httponly=False,   # Must be readable by the middleware
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            path="/",
        )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        _set_auth_cookies(response, refresh, user)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials."}, status=400)
        if not user.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=400)
        refresh = RefreshToken.for_user(user)
        response = Response(UserSerializer(user).data)
        _set_auth_cookies(response, refresh, user)
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out."})
        response.delete_cookie(settings.AUTH_COOKIE_ACCESS)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH)
        response.delete_cookie("pandore_role")
        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if not raw:
            return Response({"detail": "No refresh token."}, status=401)
        try:
            refresh = RefreshToken(raw)
        except TokenError:
            return Response({"detail": "Invalid refresh token."}, status=401)
        response = Response({"detail": "Token refreshed."})
        _set_auth_cookies(response, refresh)
        return response


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)
