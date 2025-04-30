import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')  # замените на свой settings
django.setup()

from app.models import Restoraunt, Product, Menu

belgrade_lat = 44.7866
belgrade_lon = 20.4489

products = []
for i in range(50):
    product = Product.objects.create(
        name=f"Product {i+1}",
        description=f"Description for product {i+1}",
        price=round(random.uniform(1, 20), 2)
    )
    products.append(product)

categories = ['fast_food', 'fine_dining', 'cafe', 'casual_dining', 'food_truck', 'buffet', 'pub', 'bakery', 'dessert']

for i in range(20):
    rest = Restoraunt.objects.create(
        name=f"Restoraunt {i+1}",
        location="Belgrade, Serbia",
        lan=round(belgrade_lat + random.uniform(-0.02, 0.02), 6),
        lon=round(belgrade_lon + random.uniform(-0.02, 0.02), 6),
        rating=round(random.uniform(3, 5), 2),
        category=random.choice(categories)
    )
    selected_products = random.sample(products, 10)
    menu = Menu.objects.create(restoraunt=rest)
    menu.product.set(selected_products)

print("Seed complete.")
