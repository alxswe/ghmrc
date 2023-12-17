from cloner.models import Repository

from django import forms


class RepositoryForm(forms.ModelForm):
    class Meta:
        model = Repository
        fields = "__all__"

    file = forms.FileField(required=True)
