import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  onSubmit(form: NgForm) {
    if (form.valid) {
      const data =  {
        email: form.value.email,
        password: form.value.password
      }
      this.authService.registerUser(data) 
    }
  }

  constructor(private authService: AuthService) {}
}
