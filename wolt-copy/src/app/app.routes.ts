import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthComponent } from './component/auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { RestaurantListComponent } from './restaurant/restaurant-list/restaurant-list.component';
import { RestaurantInfoComponent } from './restaurant/restaurant-info/restaurant-info.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    {path: '', component: HomeComponent}, 
    {path: 'register', component: RegisterComponent},
    {path: 'auth', component: AuthComponent}, 
    {path: 'profile', component: ProfileComponent}, 
    {path: 'profile/orders', component: OrdersComponent},
    {path: 'restaurants', component: RestaurantListComponent},
    {path: 'restaurants/:id', component: RestaurantInfoComponent},
    {path: 'restaurants/:id/reviews', component: RestaurantInfoComponent},
    {path: 'cart', component: CartComponent}
];
