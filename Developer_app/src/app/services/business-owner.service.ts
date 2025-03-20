import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessOwnerService {
  private apiUrl = 'https://businessman-api.onrender.com/Auth/api';

  constructor(private http: HttpClient) { }

  registerBusinessOwner(email: string): Observable<any> {
    const payload = { EmailAddress: email, Id: 0 };
    return this.http.post<any>(`${this.apiUrl}/add-email`, payload);
  }

  removeBusinessOwner(email: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove-email?emailAddress=${encodeURIComponent(email)}`);
  }
}