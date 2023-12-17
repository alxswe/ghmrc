from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from support.api import serializers


class CreateSupportView(CreateAPIView):
    serializer_class = serializers.SupportModelSerializer
    permission_classes = [IsAuthenticated]
