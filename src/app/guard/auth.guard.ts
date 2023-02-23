import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if (localStorage.getItem('access_token')) {
        let cu:any = this.authService.currentUser;
        if (cu.data.isFirstConnection == 1)
          return true;
        return false;
      }
      else {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/auth');
        return false;
      }
  }
  
}
