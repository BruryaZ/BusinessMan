import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http: HttpClient) {

  }
  private apiUrl = environment.apiUrl

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        // הנפקת טוקן ושמירה ב-localStorage
        localStorage.setItem('authToken', response.token);
      })
    );
  }
}
