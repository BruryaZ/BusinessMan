import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'API_URL_HERE/api/User';

  constructor(private http: HttpClient) {}

  getUsersByBusiness(businessId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users-by-business/${businessId}`, { withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
