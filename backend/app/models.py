from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.utils import timezone



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username



class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # image = models.ImageField(upload_to='products/')

    def __str__(self):
        return self.name




class Restoraunt(models.Model):

    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)


    lan = models.DecimalField(max_digits=9, decimal_places=6, null=True) #latitude
    lon = models.DecimalField(max_digits=9, decimal_places=6, null=True) #longitude

    rating = models.DecimalField(max_digits=3, decimal_places=2)
    MODEL_CHOICES = [
        ('fast_food', 'Fast Food'),
        ('fine_dining', 'Fine Dining'),
        ('cafe', 'Cafe'),
        ('casual_dining', 'Casual Dining'),
        ('food_truck', 'Food Truck'),
        ('buffet', 'Buffet'),
        ('pub', 'Pub'),
        ('bakery', 'Bakery'),
        ('dessert', 'Dessert'),
    ]
    category = models.CharField(choices=MODEL_CHOICES, max_length=50, default='fast_food')
    #open_time = models.TimeField()

    class Meta:
        ordering = ['-rating']


    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restoraunt, on_delete=models.CASCADE)
    status = models.CharField(
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('cancelled', 'Cancelled')],
        max_length=50,
        default='pending'
    )
    made_at = models.DateTimeField(default=timezone.now)
    delivered_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.pk} by {self.user.username}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Menu(models.Model):
    restoraunt = models.ForeignKey(Restoraunt, on_delete=models.CASCADE)
    #product = models.ForeignKey(Product, on_delete=models.CASCADE) # one to many
    product = models.ManyToManyField(Product, related_name='menus') 
    
    def __str__(self):
        return f"Menu at {self.restoraunt.name}"


class Review(models.Model):
    restaurant = models.ForeignKey(Restoraunt, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return f"Review of {self.product.name} on {self.review_date}"

