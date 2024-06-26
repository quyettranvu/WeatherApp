import { Inject, Injectable, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from 'firebase/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import moment from 'moment';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public angularFireStore: AngularFirestore, // Firestore service
    public angularFireAuth: AngularFireAuth, // Firebase auth service
    private httpClient: HttpClient,
    public router: Router,
    public ngZone: NgZone, //remove outside scope warning
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    // const localStorage = document.defaultView?.localStorage;
    // if (isPlatformBrowser(this.platformId)) {
    //   /* Saving user data in localstorage when logged in and setting up null when logged out */
    //   this.angularFireAuth.authState.subscribe((user) => {
    //     if (user) {
    //       this.userData = user;
    //       localStorage.setItem('user', JSON.stringify(this.userData));
    //       JSON.parse(localStorage.getItem('user')!);
    //     } else {
    //       localStorage.setItem('user', 'null');
    //       JSON.parse(localStorage.getItem('user')!);
    //     }
    //   });
    // }

    if (isPlatformBrowser(this.platformId)) {
      /* Using RxJS with JWT Tokens for checking sessions */
      const accessToken = localStorage.getItem('access_token');
      const expiresAt = JSON.parse(localStorage.getItem('expires_at')!);
      if (accessToken && moment().isBefore(expiresAt)) {
        const user = localStorage.getItem('user');
        this.userData = JSON.parse(user!);
      } else {
        this.router.navigate(['/sign-in']);
      }
    }
  }

  async signIn(email: string, password: string) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      this.setUserData(result.user);
      // Angular Fire Athentication State as Observable of Authentication state
      this.angularFireAuth.authState.subscribe((user) => {
        if (user) {
          this.router.navigate(['dashboard']);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  signInRxJs(email: string, password: string): Observable<User> {
    return this.httpClient
      .post<User>(environment.apiUrl + '/api/login', { email, password })
      .pipe(
        shareReplay(), //prevent receiver from triggering multiple POST requests
        tap((authResult) => this.setSession(authResult)),
      );
  }

  //Sign in with Google
  GoogleAuth() {
    this.AuthLogin(new auth.GoogleAuthProvider());
  }

  async AuthLogin(provider: any) {
    try {
      this.angularFireAuth.signInWithPopup(provider).then((result) => {
        console.log('Login Successful. Redirecting to dashboard...');
        this.router.navigate(['dashboard']);
        this.setUserData(result.user);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(
        email,
        password,
      );
      if (result) {
        this.sendVerificationEmail();
        this.setUserData(result.user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  signUpRxJs(email: string, password: string): Observable<User> {
    return this.httpClient
      .post<User>(environment.apiUrl + '/api/signup', { email, password })
      .pipe(
        shareReplay(), //prevent receiver from triggering multiple POST request
        tap((authResult) => {
          this.setSession(authResult);
        }),
      );
  }

  sendVerificationEmail() {
    try {
      this.angularFireAuth.currentUser
        .then((u: any) => u.sendEmailVerification)
        .then(() => {
          this.router.navigate(['verify-email-address']);
        });
    } catch (error) {
      console.log(error);
    }
  }

  forgotPassword(passwordResetEmail: string) {
    try {
      this.angularFireAuth
        .sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        });
    } catch (error) {
      window.alert(error);
    }
  }

  get IsLogIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user')!);
      return user != null && user.emailVerified !== false ? true : false;
    }
    return false;
  }

  isLoggedIn(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        return user !== null; // Returns true if user is authenticated, false otherwise
      }),
    );
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.angularFireStore.doc(
      `users/${user.uid}`,
    );

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    //Merge into FireStore Document for saving
    return userRef.set(userData, { merge: true });
  }

  signOut() {
    try {
      this.angularFireAuth.signOut().then(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('user');
          this.router.navigate(['sign-in']);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // signOutRxJs(email: string, password: string): Observable<User> {
  //   return this.httpClient.post<User>('/api/signUp', { email, password }).pipe(
  //     shareReplay(), //prevent receiver from triggering multiple POST request
  //     tap((authResult) => this.setSession(authResult)),
  //   );
  // }

  /**
   * Using Rxjs approaches
   */
  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, 'hours');
    if (isPlatformBrowser(this.platformId)) {
      if (authResult.user) {
        this.userData = authResult.user;
        localStorage.setItem('user', JSON.stringify(authResult.user));
      }
      localStorage.setItem('access_token', authResult.idToken);
      localStorage.setItem('refresh_token', authResult.idRefreshToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }
  }

  public signOutRxJs() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token'); // only remove accesstoken, user can call method to generate access token with refresh token or apply remove refreshtoken on logout to prevent this
      localStorage.removeItem('expires_at');
    }
    this.router.navigate(['/sign-in']);
  }

  public isLoggedInRxJs() {
    return moment().isBefore(this.getExpirationRxJs());
  }

  isLoggedOut() {
    return !this.isLoggedInRxJs();
  }

  getExpirationRxJs() {
    if (isPlatformBrowser(this.platformId)) {
      const expiration = localStorage.getItem('expires_at');
      const expiresAt = JSON.parse(expiration!);
      return moment(expiresAt);
    }
    return;
  }
}
