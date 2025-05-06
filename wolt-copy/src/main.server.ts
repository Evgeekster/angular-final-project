import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { CartComponent } from './app/cart/cart.component';
import { AuthComponent } from './app/component/auth/auth.component';
import { HomeComponent } from './app/component/home/home.component';
import { RegisterComponent } from './app/component/register/register.component';
import { OrdersComponent } from './app/profile/orders/orders.component';
import { ProfileComponent } from './app/profile/profile.component';
import { RestaurantInfoComponent } from './app/restaurant/restaurant-info/restaurant-info.component';
import { RestaurantListComponent } from './app/restaurant/restaurant-list/restaurant-list.component';

const bootstrap = () => bootstrapApplication(AppComponent, config);
const serverConfig = {
    routes: [
      { path: '', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'auth', component: AuthComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/orders', component: OrdersComponent },
      { path: 'restaurants', component: RestaurantListComponent },
      { path: 'restaurants/:id', component: RestaurantInfoComponent },
      { path: 'restaurants/:id/reviews', component: RestaurantInfoComponent },
      { path: 'cart', component: CartComponent }
    ],
    prerender: false  // Устанавливаем false для отключения prerendering
  };
export default bootstrap;
