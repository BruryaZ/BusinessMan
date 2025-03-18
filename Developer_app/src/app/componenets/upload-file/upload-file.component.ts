import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})

export class UploadFileComponent {
  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile) {
      // כאן תוכל לבצע פעולות עם הקובץ, כמו לשלוח אותו לשרת
      console.log('Uploaded file:', this.selectedFile);
    } else {
      console.log('No file selected');
    }
  }
}