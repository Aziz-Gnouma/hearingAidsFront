import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-dash-header',
  templateUrl: './dash-header.component.html',
  styleUrl: './dash-header.component.css'
})
export class DashHeaderComponent implements OnInit {
  constructor(
    public AppServiceService: AppServiceService ,
    private AuthService: AuthService,
    private router: Router ) {}

    ngOnInit(): void {}

    public isLoggedIn() {
      return this.AuthService.isLoggedIn();
    }
  
    public logout() {
      this.AuthService.clear();
      this.router.navigate(['']);
    }
  }
  