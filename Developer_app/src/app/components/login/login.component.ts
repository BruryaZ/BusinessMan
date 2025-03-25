import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/User.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  firstName: string = "";
  password: string = "";

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  onSubmit(): void {
    this.login();
  }

  login(): void {
    console.log(this.apiUrl," " , this.firstName, " " , this.password)
    const payload: User = {
      firstName: this.firstName,
      lastName: "", // או ערך אחר
      email: "", // או ערך אחר
      password: this.password,
      phone: "", // או ערך אחר
      role: 2, // או ערך אחר
      idNumber: "" // או ערך אחר
    };

    this.http.post<any>(`${this.apiUrl}/Auth/login`, payload).subscribe(response => {
      const token = response.token;
      localStorage.setItem('authToken', token);
      console.log("Login succuessed")
    }, error => {
      console.error('Login failed');
    });
  }
}
