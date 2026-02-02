import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-plausidator-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './plausidator-demo.component.html',
  styleUrl: './plausidator-demo.css',
})
export class PlausidatorDemoComponent {
  fhirContent: string = '';
  validationResult: any = null;
  isLoading = false;
  error: string | null = null;
  requestStatus: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fhirContent = e.target?.result as string;
        this.validationResult = null;
        this.error = null;
      };
      reader.readAsText(file);
    }
  }

  validate(): void {
    if (!this.fhirContent || !this.fhirContent.trim()) {
      this.error = 'Please enter or upload FHIR content.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.validationResult = null;
    this.requestStatus = 'Validating...';

    const isXml = this.fhirContent.trim().startsWith('<');
    const contentType = isXml ? 'application/fhir+xml' : 'application/fhir+json';

    const headers = new HttpHeaders({
      'Content-Type': contentType,
    });

    const baseUrl = environment.validationBaseUrl?.replace(/\/$/, '') ?? '';
    const url = `${baseUrl}/api/validation/e-rezept`;

    this.http.post(url, this.fhirContent, { headers }).subscribe({
      next: (res: any) => {
        this.validationResult = res;
        this.isLoading = false;
        this.requestStatus =
          res.status === 'PASS' ? 'Validation Successful' : 'Validation Completed with Errors';
      },
      error: (err) => {
        console.error(err);
        this.error = `Validation failed: ${err.message || err.statusText}`;
        if (err.error) {
          this.validationResult = err.error;
        }
        this.isLoading = false;
        this.requestStatus = 'Validation Failed';
      },
    });
  }
}
