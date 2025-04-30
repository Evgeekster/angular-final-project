from rest_framework import serializers
from .models import UserProfile, User, Restoraunt, Product, Order, Review, OrderItem
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.hashers import make_password



class RestaurauntSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restoraunt
        fields = '__all__'  # Include all fields from the model


class ReviewSerializer(serializers.ModelSerializer):
    added_by = serializers.CharField(source='added_by.username', read_only=True)
    added_by_id = serializers.IntegerField(source='added_by.id', read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'restaurant', 'rating', 'comment', 'added_by' , 'added_by_id', 'created_at']


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = UserProfile
        fields =  ['username', 'phone_number', 'address', 'email' ]
    
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    delivery_address = serializers.CharField(source='user.userprofile.address', read_only=True)
    restaurant = serializers.CharField(source='restaurant.name', read_only=True)
    order_date = serializers.DateTimeField(source='made_at', read_only=True, format='%d.%m.%Y %H:%M')
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'restaurant', 'order_date', 'total_price', 'delivered_at', 'items', 'delivery_address', 'status']

    def get_total_price(self, obj):
        return sum(item.price * item.quantity for item in obj.items.all())