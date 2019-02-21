from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  re_path(r'^pages/(?P<page_name>[a-zA-Z0-9\-_:]+)/$', views.Page.as_view(), name='page'),
]
