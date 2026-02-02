import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-validation-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './validation-status.component.html',
  styles: [`
    .status-pass { color: #198754; font-weight: bold; }
    .status-fail { color: #dc3545; font-weight: bold; }
    .status-partial { color: #fd7e14; font-weight: bold; }
  `]
})
export class ValidationStatusComponent {}
