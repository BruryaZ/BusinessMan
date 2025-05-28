import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/User.model';
import { Login } from '../../models/Login.model';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ FormsModule],
  standalone: true
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  onSubmit(): void {
    this.login();
  }

  login(): void {
    const payload: Login = {
      email: this.email,
      password: this.password,
    };
    console.log('Login payload:', payload);

    this.http.post<any>(`${this.apiUrl}/Auth/admin-login`, payload, { withCredentials: true }).subscribe(response => {
    }, error => {
      console.error('Login failed');
    });
  }
}
