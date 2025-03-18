import { Routes } from '@angular/router';
import { UploadFileComponent } from './componenets/upload-file/upload-file.component';
import { LoginComponent } from './componenets/login/login.component';

export const routes: Routes = [
    { path: 'upload-file', component: UploadFileComponent },
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
];
