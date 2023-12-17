from cloner.asgi.send import send_user_socket_message
from cloner.asgi.serializers import MessageModelSerializer
from cloner.models import Message, Repository

from django.db.models import signals
from django.dispatch import receiver


@receiver(signals.pre_delete, sender=Repository)
def delete_repository_file(sender, instance, **kwargs):
    instance.file.delete()
    instance.send_message(action="delete")


@receiver(signals.post_save, sender=Message)
def send_user_message(sender, instance, created, **kwagrs):
    if created:
        serializer = MessageModelSerializer(instance, read_only=True)

        send_user_socket_message(
            name="subscribe_to_user_%s_messages",
            type="send_user_message",
            pk=instance.user.pk,
            table="messages",
            action="create",
            data=serializer.data,
        )
