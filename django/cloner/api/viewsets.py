# flake8: noqa
import os

from cloner.api import serializers
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from django.conf import settings
from django.db import transaction
from django.http import FileResponse
from django.utils.translation import gettext_lazy as _


class RepositoryViewSet(ModelViewSet):
    serializer_class = serializers.RepositoryModelSerializer
    model = serializer_class.Meta.model
    queryset = model.objects.none()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.repositories.all()

    @action(
        methods=["post"], detail=False, url_name="bulk-create", url_path="bulk"
    )
    def bulk_create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, headers=headers, status=status.HTTP_201_CREATED
        )

    @action(methods=["post"], detail=True, url_name="clone", url_path="clone")
    def clone_repository(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.clone(user=request.user)

        return Response(
            {"detail": _("You will be notified when the cloning is done.")},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["post"], detail=False, url_name="clone-all", url_path="clone"
    )
    def clone_repositories(self, request, *args, **kwargs):
        request.user.repositories.clone_all(user=request.user)

        return Response(
            {"detail": _("You will be notified when the cloning is done.")},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["delete"],
        detail=False,
        url_name="remove-all",
        url_path="remove",
    )
    def remove_repositories(self, request, *args, **kwargs):
        with transaction.atomic():
            repos = request.user.repositories.all()
            for repo in repos:
                repo.remove_user(user=request.user)

        return Response(
            {"detail": _("Repositories have been cleared.")},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["post"], detail=True, url_name="remove", url_path="remove"
    )
    def remove_repository(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.remove_user(user=request.user)

        return Response(
            {"detail": _("Repository have been removed.")},
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["get"], detail=True, url_name="download", url_path="download"
    )
    def download_repository(self, request, *args, **kwargs):
        # Something is off with my docker.nginx.configuration
        # Had to resort to this method
        obj = self.get_object()

        response = FileResponse(
            open(settings.MEDIA_ROOT / obj.file.name, "rb"), as_attachment=True
        )
        response[
            "Content-Disposition"
        ] = f'attachment; filename="{obj.clone_name}.zip"'

        return response

    @action(
        methods=["get"],
        detail=False,
        url_name="download-all",
        url_path="download",
    )
    def download_repositories(self, request, *args, **kwargs):
        self.model.archive_for_user(request.user)

        USER_ROOT = settings.MEDIA_ROOT / request.user.username
        ARCHIVE_NAME = f"{request.user.username}.zip"

        # Return the zip file as a response
        response = FileResponse(
            open(USER_ROOT / ARCHIVE_NAME, "rb"), as_attachment=True
        )
        response[
            "Content-Disposition"
        ] = f'attachment; filename="{os.path.basename(ARCHIVE_NAME)}"'

        return response

    def perform_create(self, serializer):
        instance = serializer.save()
        return instance


class HistoryViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.HistoryModelSerializer
    model = serializer_class.Meta.model
    queryset = model.objects.none()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.history.all()


class MessageViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.MessageModelSerializer
    model = serializer_class.Meta.model
    queryset = model.objects.none()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.messages.all()
