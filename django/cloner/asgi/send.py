import socket

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def send_user_socket_message(name, type, pk, table, action, data):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    data = {
        "table": table,
        "action": action,
        "data": data,
    }

    try:
        async_to_sync(channel_layer.group_send)(
            name % pk,
            {"type": type, "message": data},
        )
    except (socket.gaierror, AttributeError) as e:
        print(e)
