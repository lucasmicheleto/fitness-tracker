import { Injectable, inject } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(private router: Router
    ,private snackbar: MatSnackBar
    ,private uiService: UIService
    ) { 
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
    this.uiService.loadingState$.next(true);
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      this.uiService.loadingState$.next(false);
    })
    .catch((error) => {
      this.uiService.loadingState$.next(false);
      this.snackbar.open(error.message, 'Register Failed', { duration: 3000})
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingState$.next(true);
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
    .then((userCredential) => {
      this.uiService.loadingState$.next(false);
    })
    .catch((error) => {
      this.uiService.loadingState$.next(false);
      this.snackbar.open(error.message, 'Login Failed', { duration: 3000})
    });

  }

  logout() {
    signOut(this.auth)
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
