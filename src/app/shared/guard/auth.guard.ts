import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}
  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (this.authService.IsLogIn !== true) {
      this.router.navigate(['sign-in']);
    }
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  //options in canActivate can be inject token check, guard on specific routes (e.g. route with param id)
  return inject(PermissionsService).canActivate();
};
