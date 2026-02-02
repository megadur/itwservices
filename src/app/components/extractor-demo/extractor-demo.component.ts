import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-extractor-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extractor-demo.component.html',
  styleUrl: './extractor-demo.component.css'
})
export class ExtractorDemoComponent {
  selectedFile: File | null = null;
  extractionResult: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.error = null;
    this.extractionResult = null;
  }

  extract(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.error = null;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('/api/extract', formData).subscribe({
      next: (res) => {
        this.extractionResult = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Extraction failed. See console for details.';
        this.isLoading = false;
      }
    });
  }
}
