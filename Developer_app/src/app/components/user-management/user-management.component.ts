import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../models/User.model';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  selectedUser: User | null = null;
  modalVisible = false;

  // לדוגמה, יש להכניס את מזהה העסק דרך context או service
  businessId = 1;

  constructor(
    private userService: UserService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsersByBusiness(this.businessId).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.message.error('שגיאה בטעינת רשימת המשתמשים');
        this.loading = false;
      }
    });
  }

  handleDelete(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.message.success('המשתמש נמחק בהצלחה');
      },
      error: () => {
        this.message.error('שגיאה במחיקת המשתמש');
      }
    });
  }

  handleEdit(id: number): void {
    this.router.navigate([`/edit-user/${id}`]);
  }

  handleViewDetails(user: User): void {
    this.selectedUser = user;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}
