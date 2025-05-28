import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User.model';
import { UserService } from '../../services/users.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzAvatarModule,
    NzTagModule,
    NzModalModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzCardModule,
    NzIconModule
  ]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  selectedUser: User | null = null;
  modalVisible = false;
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
      error: () => {
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

  getRoleCount(role: number) {
    return this.users.filter(user => user.role === role).length;
  }

  navigateToRegisterUser(): void {
    this.router.navigate(['/register-user']);
  }
}
