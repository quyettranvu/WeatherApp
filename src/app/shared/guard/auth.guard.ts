import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isLoggedIn().pipe(
      take(1), //observable completes after emitting first value -> prevent leak memory
      //transform value(boolean) from isLoggedIn() to either true for logging in or UrlTree for navigating
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          return this.router.createUrlTree(['sign-in']);
        } else {
          return true;
        }
      }),
    );
  }
}
