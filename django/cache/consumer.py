import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class CacheConsumer(AsyncJsonWebsocketConsumer):
    """Use this consumer to subscribe to current user's cache"""

    async def connect(self):
        self.user = self.scope["user"]
        self.group_name = "subscribe_to_user_%s_cache" % self.user.pk

        # Join room group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    commands = {}

    # Receive message from room group
    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.commands[data["command"]](self, data)

    async def send_group(self, message):
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "send_user_cache", "message": message},
        )

    async def send_user_cache(self, event):
        await self.send(text_data=json.dumps(event["message"]))
