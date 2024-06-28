import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }


  public getRoles(): string[] {
    const rolesString = localStorage.getItem('roles');
    return rolesString ? JSON.parse(rolesString) : [];
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

 

  public getToken(): string {
    return localStorage.getItem('jwtToken') || '';
  }
  public clear() {
    localStorage.clear();
  }
  public setUserData(userData: any) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }
  

  public isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.includes('admin'); // Check if 'admin' role exists in roles array
  }
}
