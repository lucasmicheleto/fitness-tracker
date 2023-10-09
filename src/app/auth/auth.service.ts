import { Injectable, inject } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(private router: Router) { 
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      // The user has been created successfully.
      //console.log('User created: ', userCredential.user);
      this.authSuccessfully();
    })
    .catch((error) => {
      // There was an error creating the user.
      console.error('Error creating user: ', error);
    });
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // }
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      // The user has been created successfully.
      //console.log('Login user: ', userCredential.user);
      this.authSuccessfully();
    })
    .catch((error) => {
      // There was an error creating the user.
      console.error('Error login user: ', error);
    });
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // }
    this.authSuccessfully();
  }

  logout() {
    signOut(this.auth)
    this.isAuthenticated = false;
    this.authChange.next(this.isAuthenticated);
    this.router.navigate(['/login'])
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(this.isAuthenticated);
    this.router.navigate(['/training']);
  }
}
