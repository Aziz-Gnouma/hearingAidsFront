import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email!: string;
  userPassword!: string;
  errorMessage!: string;

  constructor(
    private appServiceService: AppServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.appServiceService.login(loginForm.value).subscribe(
        (response: any) => {
          this.authService.setRoles(response.user.role);
          this.authService.setToken(response.jwtToken);
  
          const role = response.user.role[0].roleName;
        

          const User = response.user;
          const Name = response.user.userFirstName +' '+ response.user.userLastName ;
          localStorage.setItem('UserData', User);
          localStorage.setItem('UserName', Name);

          
          if (role === 'Admin') {
            console.log('Welcome Admin');
            console.log(response);
            this.router.navigate(['/Admin']);
          } else  {
            console.log('Welcome user');
            this.router.navigate(['/ALLUsers']);
          }
          localStorage.setItem('UserData', JSON.stringify(User));

          console.log( 'User data ',User);
        },
        (error) => {
          console.log(error);
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
