"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from app.views import RestaurauntViewSet, Register, Login, Profile, SetUserProfile, RestaurantDetailViewSet, GetReviewView, PostReviewView, OrderView

from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

 
urlpatterns = [
    path('swagger.<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    #path('api/', include(router.urls)),  # Include the router URLs
    path('api/restaurants/', RestaurauntViewSet.as_view({'get': 'list'}), name='restaurant-list'),
    path('api/restaurants/<int:pk>/', RestaurantDetailViewSet.as_view({'get': 'retrieve'}), name='restaurant-info'),
    path('api/restaurants/<int:pk>/menu/', RestaurauntViewSet.as_view({'get': 'get_menu'}), name='restaurant-menu'),
    path('api/restaurants/<int:pk>/reviews/', GetReviewView.as_view(), name='restaurant-reviews'),  # , name='restaurant-reviews'
    path('api/register/', Register.as_view({'post': 'create'}), name='register'),
    path('api/login/', Login.as_view(), name='login'),
    path('api/profile/', Profile.as_view({'get': 'get'}), name='profile'),
    path('api/profile/update/', SetUserProfile.as_view(), name='update-profile'), # Update user profile
    path('api/profile/orders/', Profile.as_view({'get': 'get_orders'}), name='user-orders'), # Get user orders
    path('api/create_order/', OrderView.as_view(), name='create-order'), # Create orde
    path('api/orders/<int:pk>/', OrderView.as_view(), name='order-detail'), 
    path('api/orders/<int:pk>/review/', PostReviewView.as_view(), name='review-post'),
    path('api/reviews/<int:pk>/delete/', PostReviewView.as_view(), name='review-delete'), 

]
