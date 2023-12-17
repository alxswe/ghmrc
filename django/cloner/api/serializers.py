from cloner.models import History, Message, Repository
from rest_framework import serializers


class RepositoryModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()
    path = serializers.HyperlinkedIdentityField(view_name="repository-detail")
    is_cloned = serializers.ReadOnlyField()
    url = serializers.ReadOnlyField()

    def get_unique_together_validators(self):
        """Overriding method to disable unique together checks"""
        return []

    def create(self, validated_data):
        request = self.context.get("request")
        instance = self.Meta.model._default_manager.create(
            user=request.user,
            **validated_data,
        )
        return instance

    class Meta:
        model = Repository
        exclude = ["users"]


class MessageModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()
    path = serializers.HyperlinkedIdentityField(view_name="message-detail")

    class Meta:
        model = Message
        fields = "__all__"


class HistoryModelSerializer(serializers.ModelSerializer):
    pk = serializers.ReadOnlyField()
    path = serializers.HyperlinkedIdentityField(view_name="history-detail")

    class Meta:
        model = History
        fields = "__all__"
