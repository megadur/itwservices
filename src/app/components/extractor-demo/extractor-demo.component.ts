import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-extractor-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './extractor-demo.component.html',
  styleUrl: './extractor-demo.component.css',
})
export class ExtractorDemoComponent {
  selectedFile: File | null = null;
  fileContent: string = '';
  extractionResult: any = null;
  isLoading = false;
  isReadingFile = false;
  error: string | null = null;
  // Trigger rebuild to ensure FormsModule is picked up

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isReadingFile = true;
      this.cdr.detectChanges();
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileContent = e.target?.result as string;
        this.extractionResult = null;
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

  extract(): void {
    if (!this.fileContent) return;

    this.isLoading = true;
    this.error = null;

    // Create a blob from the text area content to verify edits are respected
    const blob = new Blob([this.fileContent], { type: 'text/xml' });
    const formData = new FormData();
    // Use the original filename or a default one
    const filename = this.selectedFile?.name || 'input.xml';
    formData.append('file', blob, filename);

    const baseUrl = environment.apiBaseUrl?.replace(/\/$/, '') ?? '';
    const url = `${baseUrl}/api/extract`;

    this.http.post(url, formData).subscribe({
      next: (res) => {
        this.extractionResult = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Extraction failed. See console for details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
