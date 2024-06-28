import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  API = 'http://localhost:8080';



  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  constructor( private httpclient: HttpClient , private route :Router,
    private AuthService : AuthService )
  {}

  public login(loginData: any) {
    return this.httpclient.post(this.API + '/auth/authenticate', loginData, {
      headers: this.requestHeader,
    });
  }



  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: any[] = this.AuthService.getRoles();

    if (userRoles && userRoles.length > 0) {
      // Loop through each role assigned to the user
      for (const userRole of userRoles) {
        // Check if the user role matches any of the allowed roles
        if (allowedRoles.includes(userRole.roleName)) {
          return true; // Return true if a match is found
        }
      }
    }

    return false; // Return false if no match is found or userRoles is empty
  }
  getAllUsers(): Observable<any[]> {
    return this.httpclient.get<any[]>(`${this.API}/auth/AllUsers`);
  }
  getCareerInformation(matricule: string): Observable<any> {
    return this.httpclient.get<any>(`${this.API}/GetCarriere/${matricule}`);
  }
  getAllproducts(): Observable<any> {
    return this.httpclient.get<any>(`${this.API}/auth/Allproducts`);
  }

  getAllorders(): Observable<any> {
    return this.httpclient.get<any>(`${this.API}/auth/AllOrders`);
  }
  conuntProduct(): Observable<any> {
    return this.httpclient.get<any>(`${this.API}/auth/countProducts`);
  }
  conuntActiveUser(): Observable<any> {
    return this.httpclient.get<any>(`${this.API}/auth/distinctUserCount`);
  }

  ActiveUser(id: number): Observable<any> {
    return this.httpclient.put<any>(`${this.API}/auth/archiveUser/${id}`, {});
  } 
  
  DesarchiveUser(id: number): Observable<any> {
    return this.httpclient.post<any>(`${this.API}/auth/desarchiveUser/${id}`, {});
  }

  UpdateProfile(id: number, updatedUserData: any): Observable<any> {
    return this.httpclient.put<any>(`${this.API}/auth/updateUser/${id}`, updatedUserData);
  } 

  UpdateProduct(id: number, updatedProduct: FormData): Observable<any> {
    return this.httpclient.put<any>(`${this.API}/auth/Updateproduct/${id}`, updatedProduct);
  } 
 

  DeleteUser(id: number): Observable<any> {
    return this.httpclient.delete(`${this.API}/auth/deleteUser/${id}`);
  }

  SaveProduct(ProductData: any): Observable<any> {
    return this.httpclient.post(`${this.API}/auth/ajouterProduit`, ProductData);

  }
  ActiveProduct(id: number): Observable<any> {
    return this.httpclient.post<any>(`${this.API}/auth/activeProduct/${id}`, {});
  }
  DesactiveProduct(id: number): Observable<any> {
    return this.httpclient.post<any>(`${this.API}/auth/desactiveProduct/${id}`, {});
  }
  getproductById(id: number): Observable<any> {
    return this.httpclient.get(`${this.API}/auth/products/${id}`);
  }
  getOrdersById(id: number): Observable<any> {
    return this.httpclient.get(`${this.API}/auth/allorders/${id}`);
  }

  countByProductId(id: number): Observable<any> {
    return this.httpclient.get(`${this.API}/auth/countByProductId/${id}`);
  }

  supprimerProduct(id: number): Observable<any> {
    return this.httpclient.delete(`${this.API}/auth/products/${id}`);
  }


  SaveUser(userData: any): Observable<any> {
    return this.httpclient.post<any>(`${this.API}/auth/AddNewUser`, userData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.message) {
          return throwError(error.error.message);
        } else {
          // Handle other errors
          return throwError('Verify your data , email already exists.');
        }
      })
    );
  }
}
