import json
from rest_framework.views import APIView
from rest_framework.response import Response
from .redis_store import RedisStore

r = RedisStore()


class Page(APIView):

    def get(self, request, page_name):
        return Response({'text': r.get_page(request.user.pk, page_name)})

    def post(self, request, page_name):
        data = json.loads(request.body)
        r.set_page(request.user.pk, page_name, data['text'])
        return Response({'status': 'ok'})
