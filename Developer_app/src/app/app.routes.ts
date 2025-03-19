import { Routes } from '@angular/router';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';

export const routes: Routes = [
    { path: '', component: AdminRegisterComponent },
    { path: 'admin-register-component', component: AdminRegisterComponent },
];
