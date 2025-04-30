from django.shortcuts import render
from .models import OrderItem, User, UserProfile, Restoraunt, Product, Order, Review, Menu
from .serializers import RestaurauntSerializer, ProfileSerializer, OrderSerializer, ProductSerializer, ReviewSerializer
from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from django.core.cache import cache
from django.views.decorators.cache import cache_page, never_cache
from django.utils.decorators import method_decorator

from datetime import datetime

import logging

# Create your views here.


def get_token(rep):
    print('rep', rep)

    if type(rep) == str:
        token = rep.split()

    elif type(rep) == list:
        token = rep
    else:
        logging.error('Invalid token format')
        print(type(rep))
        return None

    if len(token) == 2 and token[0] == 'Token':
        return token[1]
    return token[0]


#@method_decorator(cache_page(60 * 3, key_prefix='menu'), name='dispatch') # cache for 3 minutes
@method_decorator(never_cache, name='dispatch')
class RestaurauntViewSet(viewsets.ModelViewSet):
    queryset = Restoraunt.objects.all()
    serializer_class = RestaurauntSerializer

    def get_menu(self, request, pk=None):
        try:
            restaurant = Restoraunt.objects.get(pk=pk)
        except Restoraunt.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=404)

        menu = Menu.objects.filter(restoraunt=restaurant)
        if not menu.exists():
            return Response({'error': 'Menu not found'}, status=404)
        
        products = Product.objects.filter(menus__restoraunt=restaurant)

        serializer = ProductSerializer(products, many=True)
        
        return Response(serializer.data)


@method_decorator(cache_page(60 * 3, key_prefix='reviews'), name='dispatch')
class GetReviewView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk=None):
        reviews = Review.objects.filter(restaurant_id=pk)
        if not reviews.exists():
            return Response({'error': 'Reviews not found'}, status=404)
        
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


@method_decorator(never_cache, name='dispatch')
class PostReviewView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        restaurant = order.restaurant  
        user = request.user
        rating = request.data.get('rating')
        comment = request.data.get('review')

        if not rating or not comment:
            return Response({'error': 'Rating and comment are required'}, status=400)

        review = Review.objects.create(
            restaurant=restaurant,
            added_by=user,
            rating=rating,
            comment=comment
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=201)
    

    def delete(self, request, pk=None):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=404)

        if request.user != review.added_by:
            return Response({'error': 'You do not have permission to delete this review'}, status=403)
        
        review.delete()
        return Response({'message': 'Review deleted successfully'}, status=204)


@method_decorator(cache_page(60 * 15, key_prefix='restaurant_detail'), name='dispatch')
class RestaurantDetailViewSet(viewsets.ModelViewSet): 
    queryset = Restoraunt.objects.all()
    serializer_class = RestaurauntSerializer


@method_decorator(never_cache, name='dispatch')
class Register(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        user = User(username=username, password=make_password(password), email=email)
        user.save()

        user_profile = UserProfile(user=user)
        user_profile.save()

        return Response({'status': 'User created'}, status=201)


@method_decorator(never_cache, name='dispatch')
class Login(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        print(token.key)
        print(user.pk)
        print(user.username)
        return Response({'token': token.key,
                          'user_id': user.pk,
                          'username': user.username,
                          }
                        )

#@method_decorator(cache_page(60 * 15, key_prefix='profile'), name='dispatch')
@method_decorator(never_cache, name='dispatch')
class Profile(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileSerializer
    permissions = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        token = get_token(request.META.get('HTTP_AUTHORIZATION')) 
        print(token)
        try:
            user = Token.objects.get(key=token).user
        except Token.DoesNotExist:
            print(token)
            return Response({'error': 'Invalid token'}, status=401)
        
        profile = UserProfile.objects.get(user=user)
        serializer = self.serializer_class(profile)
        return Response(serializer.data)
    
     
    def get_orders(self, request, *args, **kwargs):
        token = get_token(request.META.get('HTTP_AUTHORIZATION').split())
        try:
            user = Token.objects.get(key=token).user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=401)
        
        orders = Order.objects.filter(user=user)
        serializer = OrderSerializer(orders, many=True)
        print(serializer.data)
        return Response(serializer.data)


@method_decorator(never_cache, name='dispatch')
class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        token = get_token(request.META.get('HTTP_AUTHORIZATION').split())
        try:
            user = Token.objects.get(key=token).user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=401)
        
        print(request.data)


        items = request.data.get('items') 
        if not items:
            return Response({'error': 'No items provided'}, status=400)

        
        restaurant_id = request.data.get('restaurant_id', 0)
        print(restaurant_id)
       
        try:
            restaurant = Restoraunt.objects.get(pk=restaurant_id)
        except Restoraunt.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=404)
        order = Order.objects.create(user=user, restaurant_id=restaurant_id)
        total_price = 0
        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            try:
                product = Product.objects.get(pk=product_id)
            except Product.DoesNotExist:
                return Response({'error': f'Product with id {product_id} not found'}, status=404)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

            total_price += float(product.price) * quantity

        return Response({'message': 'Order created successfully', 'order_id': order.id}, status=201)
    
    
    def patch(self, request, *args, **kwargs):
        order_id = kwargs.get('pk')
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

        order.status = request.data.get('status', order.status)
        if order.status == 'completed':
            order.delivered_at = datetime.now()
        order.save()

        return Response({'message': 'Order updated successfully'}, status=200)
    

### put
@method_decorator(never_cache, name='dispatch')
class SetUserProfile(APIView):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileSerializer
    permissions = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        token = get_token(request.META.get('HTTP_AUTHORIZATION').split())
        try:
            user = Token.objects.get(key=token).user
        except Token.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=401)
        
        profile = UserProfile.objects.get(user=user)
        serializer = self.serializer_class(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

