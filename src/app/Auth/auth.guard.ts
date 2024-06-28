import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppServiceService } from '../app-service.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private appServiceService: AppServiceService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getToken()) {
      const roles = route.data['roles'] as string[];

      if (roles && roles.length > 0) {
        const match = this.appServiceService.roleMatch(roles);

        if (match) {
          return true;
        } else {
          console.log('you dont have acces ;');
          this.router.navigate(['/forbidden']);
          
          return false;
        }
      }

      return true; // Allow navigation if no roles are specified
    }

    this.router.navigate(['/login']);
    return false;
  }
}
