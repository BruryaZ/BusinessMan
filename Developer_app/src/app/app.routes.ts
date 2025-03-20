import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'user-management', component: UserManagementComponent },
];
