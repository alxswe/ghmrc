from accounts.utils import UserCache
from cloner.api.serializers import MessageModelSerializer, RepositoryModelSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class CacheAPIView(APIView):
    def get(self, request, *args, **kwargs):
        user_cache = UserCache(user=request.user)

        repos = self.request.user.repositories.all()
        messages = self.request.user.messages.all()

        data = {
            "repositories": RepositoryModelSerializer(
                repos, context={"request": request}, many=True
            ).data,
            "messages": MessageModelSerializer(
                messages, context={"request": request}, many=True
            ).data,
        }

        payload = user_cache.handle(data=data)

        return Response(payload)
