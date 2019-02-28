import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from .redis_store import RedisStore
from django.http.response import HttpResponseBadRequest
from django import forms
from django.core.files.storage import DefaultStorage
from django.utils.crypto import get_random_string

r = RedisStore()


class Page(APIView):

    def get(self, request, page_name):
        return Response({'text': r.get_page(request.user.pk, page_name)})

    def post(self, request, page_name):
        data = json.loads(request.body)
        r.set_page(request.user.pk, page_name, data['text'])
        return Response({'status': 'ok'})


class UploadFileForm(forms.Form):
    file = forms.FileField()


class Upload(APIView):
    def post(self, request):
        print(request.FILES)
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            storage = DefaultStorage()
            _, file_extension = os.path.splitext(request.FILES['file'].name)
            filename = get_random_string(length=32) + file_extension
            filename = storage.save(name=filename, content=request.FILES['file'])
            url = storage.url(filename)
            return Response({
                'url': url,
            })
        else:
            return HttpResponseBadRequest()
