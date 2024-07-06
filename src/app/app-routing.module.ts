import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ListProductsComponent } from './Products/list-products/list-products.component';
import { AddProductComponent } from './Products/add-product/add-product.component';
import { ProductDetailsComponent } from './Products/product-details/product-details.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ListDisableProductComponent } from './Products/list-disable-product/list-disable-product.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { UsersComponent } from './users/users.component';
import { ArchivedUserComponent } from './archived-user/archived-user.component';
import { ProfileComponent } from './profile/profile.component';
import { ListProductClientComponent } from './ClientSpace/list-product-client/list-product-client.component';
import { BuyingProductComponent } from './ClientSpace/buying-product/buying-product.component';
import { CartComponent } from './ClientSpace/cart/cart.component';
import { CheckoutComponent } from './ClientSpace/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Register', component: SignUpComponent },
  { path: 'Profile', component: ProfileComponent },

  { path: 'Admin', component: DashComponent },
  { path: 'ALLProducts', component: ListProductsComponent },
  { path: 'AvailableProducts', component: ListProductClientComponent },
  { path: 'Product/:id', component: BuyingProductComponent },

  { path: 'ALLDisableProducts', component: ListDisableProductComponent },
  { path: 'ALLUsers', component: UsersComponent },
  { path: 'ArchivedUsers', component: ArchivedUserComponent },
  { path: 'AddProduct', component: AddProductComponent },
  { path: 'DetailsEmplyee/:id', component: ProductDetailsComponent },
  { path: 'AllOrdrs', component: AllOrdersComponent },

  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
