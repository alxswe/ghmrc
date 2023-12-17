from rest_framework import serializers
from support.models import Support


class SupportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = "__all__"
