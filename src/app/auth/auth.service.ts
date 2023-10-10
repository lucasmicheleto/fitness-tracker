import { Injectable, inject } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(private router: Router) { 
    this.initAuthListener();
  }

  initAuthListener() {
    authState(this.auth).subscribe({
      next: user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(this.isAuthenticated);
          this.router.navigate(['/training']);
        }
        else {
          this.isAuthenticated = false;
          this.authChange.next(this.isAuthenticated);
          this.router.navigate(['/login'])
        }
      }
    })
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      // The user has been created successfully.
      //console.log('User created: ', userCredential.user);
    })
    .catch((error) => {
      // There was an error creating the user.
      console.error('Error creating user: ', error);
    });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      // The user has been created successfully.
      //console.log('Login user: ', userCredential.user);
    })
    .catch((error) => {
      // There was an error creating the user.
      console.error('Error login user: ', error);
    });

  }

  logout() {
    signOut(this.auth)
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
