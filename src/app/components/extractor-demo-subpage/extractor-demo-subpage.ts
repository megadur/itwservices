import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-extractor-demo-subpage',
  imports: [CommonModule, RouterLink],
  templateUrl: './extractor-demo-subpage.html',
  styleUrl: './extractor-demo-subpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtractorDemoSubpage {}
