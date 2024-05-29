import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { InfoManagerService } from './manager/info-manager.service';
import { InfoEmployeeService } from './employee/info-employee.service';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerGuard implements CanActivate {
  constructor(private tokenService: TokenStorageService, private infoMangerService: InfoManagerService,
    private router: Router, private infoEmployeeService: InfoEmployeeService) { }
  token_auth: any;
  role: any;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.token_auth = localStorage.getItem('auth-token');
    this.role = sessionStorage.getItem("role");
    if (!localStorage.getItem('auth-token') && !localStorage.getItem('email')) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'You have to log in again',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 3500
      });
      sessionStorage.clear();
      this.router.navigate(['']);
      return false;
    }

    if(!localStorage.getItem("email")) {
      this.tokenService.signOut();
      sessionStorage.clear();
      this.router.navigate([""])
      return false;
    } else {
      const email = localStorage.getItem("email");
      const manager = localStorage.getItem("manager");
      const employee = localStorage.getItem("employee");
      const emailJson = { "email": email };
      if (manager == "true" && !employee) {
        this.infoMangerService.getInfoAdmin(emailJson).subscribe((response: any) => {
          if (response.status) {
            console.log("true");
            sessionStorage.setItem("IsLoggedIn", "true");
            return true;
          } else {
            Swal.fire({
              title: 'Unauthorized',
              text: 'You are no longer active',
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            this.tokenService.signOut();
            sessionStorage.clear();
            this.router.navigate([""])
            return false;
          }
        })
      }else if(employee == "true" && !manager){
        this.infoEmployeeService.getInfoAdmin(emailJson).subscribe((response:any)=>{
          if(response.status){
            console.log("true");
            sessionStorage.setItem( "IsLoggedIn", "true" );
            return true;
          }else{
            Swal.fire({
              title: 'Unauthorized',
              text: 'You are no longer active',
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            this.tokenService.signOut();
            sessionStorage.clear();
            this.router.navigate([""])
            return false; 
          }
        })
      }else{
        Swal.fire({
          title: 'Unauthorized',
          text: 'You are no longer active',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3500
        });
        this.tokenService.signOut();
        sessionStorage.clear();
        this.router.navigate([""])
        return false;
      }
    }

    if (localStorage.getItem('auth-token')) {
      if (this.token_auth) {
        if (this.role == "Manager" || localStorage.getItem("manager") == "true") {
          this.tokenService.validateTokenManager(this.token_auth).subscribe(
            (isValid) => {
              if (!isValid) {
                //token is invalid
                console.log('Token validation:', isValid);
                sessionStorage.setItem("IsLoggedIn", "false");
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Your session has expired. Please log in again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
                this.tokenService.signOut();
                sessionStorage.clear();
                this.router.navigate([""])
                return false;
              }
              else {
                //token is valid
                console.log('Token validation:', isValid);
                sessionStorage.setItem("IsLoggedIn", "true");
                return true;
              }
            },
            (error: HttpErrorResponse) => {
              sessionStorage.setItem("IsLoggedIn", "false");
              if (error.error.isTrusted == true) {
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Server is down. Try later',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
              } else {
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Your session has expired. Please log in again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
              }
              this.tokenService.signOut();
              sessionStorage.clear();
              this.router.navigate([""])
            }
          );
        } else if (this.role == "Employee" || localStorage.getItem("employee") == "true") {
          this.tokenService.validateTokenEmployee(this.token_auth).subscribe(
            (isValid) => {
              if (!isValid) {
                //token is invalid
                console.log('Token validation:', isValid);
                sessionStorage.setItem("IsLoggedIn", "false");
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Your session has expired. Please log in again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
                this.tokenService.signOut();
                sessionStorage.clear();
                this.router.navigate([""])
                return false;
              }
              else {
                //token is valid
                console.log('Token validation:', isValid);
                sessionStorage.setItem("IsLoggedIn", "true");
                return true;
              }
            },
            (error: HttpErrorResponse) => {
              sessionStorage.setItem("IsLoggedIn", "false");
              if (error.error.isTrusted == true) {
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Server is down. Try later',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
              } else {
                Swal.fire({
                  title: 'Unauthorized',
                  text: 'Your session has expired. Please log in again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 3500
                });
              }
              this.tokenService.signOut();
              sessionStorage.clear();
              this.router.navigate([""])
            }
          );
        } else {
          console.log("erreur");
          //this.tokenService.signOut();
          //sessionStorage.clear();
          //this.router.navigate([""])
          return true;
        }
      }
    }
    return true;
  }
}
