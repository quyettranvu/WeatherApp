import { Inject, Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from './user';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public angularFireStore: AngularFirestore, // Firestore service
    public angularFireAuth: AngularFireAuth, // Firebase auth service
    public router: Router,
    public ngZone: NgZone, //remove outside scope warning
    @Inject(DOCUMENT) document: Document,
  ) {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      /* Saving user data in localstorage when logged in and setting up null when logged out */
      this.angularFireAuth.authState.subscribe((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      });
    }
  }

  //SignIn
  async signIn(email: string, password: string) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      this.setUserData(result.user);
      //navigate to current page by checking whether authorized
    } catch (error) {
      console.log(error);
    }
  }

  //SignUp
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

  //Send verification email
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

  get IsLogIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user != null ? true : false;
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
        localStorage.removeItem('user');
        //navigate back to login page
      });
    } catch (error) {
      console.log(error);
    }
  }
}
