import { Component, ChangeDetectorRef } from '@angular/core';
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
  isReadingFile = false;
  error: string | null = null;
  requestStatus: string | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isReadingFile = true;
      this.cdr.detectChanges();
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fhirContent = e.target?.result as string;
        this.validationResult = null;
        this.error = null;
      };
      reader.onerror = () => {
        this.error = 'Datei konnte nicht gelesen werden.';
      };
      reader.onabort = () => {
        this.error = 'Datei-Lesevorgang abgebrochen.';
      };
      reader.onloadend = () => {
        this.isReadingFile = false;
        this.cdr.detectChanges();
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

    console.log('Sending request to:', url);
    this.http.post(url, this.fhirContent, { headers }).subscribe({
      next: (res: any) => {
        console.log('Response received:', res);
        this.validationResult = res;
        this.isLoading = false;
        this.requestStatus =
          res.status === 'PASS' ? 'Validation Successful' : 'Validation Completed with Errors';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error in subscription:', err);
        this.error = `Validation failed: ${err.message || err.statusText}`;
        if (err.error) {
          this.validationResult = err.error;
        }
        this.isLoading = false;
        this.requestStatus = 'Validation Failed';
        this.cdr.detectChanges();
      },
    });
  }
}
