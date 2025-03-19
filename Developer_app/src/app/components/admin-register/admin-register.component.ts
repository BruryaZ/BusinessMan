import { Component } from '@angular/core';
import { BusinessOwnerService } from '../../services/business-owner.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css'
})
export class AdminRegisterComponent {
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
