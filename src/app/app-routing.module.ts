import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'food',
    loadChildren: () => import('./food/food.module').then( m => m.FoodPageModule)
  },
  {
    path: 'vendor/:id',
    loadChildren: () => import('./food/food-vendor/food-vendor.module').then(m => m.FoodVendorPageModule)
  },
  {
    path: 'cart-details',
    loadChildren: () => import('./view-cart/cart-details/cart-details.module').then( m => m.CartDetailsPageModule)
  },
  {
    path: 'misc-order/:name',
    loadChildren: () => import('./misc-orders/misc-order/misc-order.module').then( m => m.MiscOrderPageModule)
  },
  {
    path: 'more-servicer/:id/:name',
    loadChildren: () => import('./more-services/more-servicer/more-servicer.module').then( m => m.MoreServicerPageModule)
  },
  {
    path: 'orders/:id',
    loadChildren: () => import('./orders/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'order-details/:id/:past',
    loadChildren: () => import('./orders/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'vegetables',
    loadChildren: () => import('./vegetables/vegetables/vegetables.module').then( m => m.VegetablesPageModule)
  },
  {
    path: 'vendor-details/:id',
    loadChildren: () => import('./vegetables/vendor/vendor.module').then( m => m.VendorPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
