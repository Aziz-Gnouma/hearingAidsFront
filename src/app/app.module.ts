import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './Auth/auth.guard';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { AppServiceService } from './app-service.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ListProductsComponent } from './Products/list-products/list-products.component';
import { DashHeaderComponent } from './dash-header/dash-header.component';
import { AddProductComponent } from './Products/add-product/add-product.component';
import { ProductDetailsComponent } from './Products/product-details/product-details.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ListDisableProductComponent } from './Products/list-disable-product/list-disable-product.component';
import { UsersComponent } from './users/users.component';
import { ArchivedUserComponent } from './archived-user/archived-user.component';
import { ProfileComponent } from './profile/profile.component';
import { ListProductClientComponent } from './ClientSpace/list-product-client/list-product-client.component';
import { BuyingProductComponent } from './ClientSpace/buying-product/buying-product.component';
import { AppHedearComponent } from './app-hedear/app-hedear.component';
import { ProductsfilterPipe, UserFilterPipe, ordersfilterPipe } from './user-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    LoginComponent,
    DashComponent,
    SignUpComponent,
    ListProductsComponent,
    DashHeaderComponent,
    AddProductComponent,
    ProductDetailsComponent,
    AllOrdersComponent,
    AllUsersComponent,
    ListDisableProductComponent,
    UsersComponent,
    ArchivedUserComponent,
    ProfileComponent,
    ListProductClientComponent,
    BuyingProductComponent,
    AppHedearComponent,
    UserFilterPipe,
    ordersfilterPipe,
    ProductsfilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AppServiceService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
