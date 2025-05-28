import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/User.model';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/Login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
