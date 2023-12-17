from cloner.models import History, Message, Repository
from rest_framework import serializers


class RepositoryModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()
    is_cloned = serializers.ReadOnlyField()
    url = serializers.ReadOnlyField()

    class Meta:
        model = Repository
        exclude = ["users"]


class MessageModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()

    class Meta:
        model = Message
        fields = "__all__"


class HistoryModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()

    class Meta:
        model = History
        fields = "__all__"
