import { Component } from '@angular/core';
import { BusinessOwnerService } from '../../services/business-owner.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  email_to_add: string = '';
  email_to_remove: string = '';

  constructor(private businessOwner: BusinessOwnerService) { }

  register() {
    this.businessOwner.registerBusinessOwner(this.email_to_add).subscribe({
      next: (res) => {
        console.log('User registered with ID:', res.id);
      },
      error: (error) => {
        console.log('Error registering user:', error);
        this.email_to_add = ''
      },
      complete: () => {
        console.log('Registration process completed.');
        this.email_to_add = ''
      }
    });

    {/*next: פונקציה שמתקבלת כאשר יש נתונים חדשים מה-Observable.
    error: פונקציה שמתקבלת כאשר יש שגיאה.
    complete: פונקציה שמתקבלת כאשר הזרם מסתיים. */}
  }

  remove() {
    this.businessOwner.removeBusinessOwner(this.email_to_remove).subscribe({
      next: (res) => {
        console.log('User removed successfully:', res);
      },
      error: (error) => {
        console.log('Error removing user:', error.error);
        this.email_to_remove = ''
      },
      complete: () => {
        console.log('Removal process completed.');
        this.email_to_remove = ''
      }
    });
  }
}
