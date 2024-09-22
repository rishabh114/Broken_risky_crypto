import { Component } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Vulnerable Temporary File App (CWE-377, CWE-22, CWE-73)</h1>
      <input [(ngModel)]="inputText" placeholder="Enter text to save" />
      <button (click)="createTempFile()">Create Temp File</button>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
})
export class AppComponent {
  inputText: string = '';
  message: string = '';

  createTempFile() {
    // Using user input to construct the file path (CWE-22: Path Traversal)
    const tempDir = path.join(__dirname, 'temp');
    const unsafeFileName = `${this.inputText}.txt`; // User-controlled file name
    const tempFilePath = path.join(tempDir, unsafeFileName);

    // Create temp directory if it doesn't exist, without validating input (CWE-73: External Control of File Path)
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Vulnerable: Writing user input to a temporary file with world-writable permissions (CWE-377: Insecure Temp File)
    // No validation on user input, allowing dangerous characters (e.g., ../ for directory traversal)
    fs.writeFileSync(tempFilePath, this.inputText, { mode: 0o777 }); // World-writable, readable, and executable

    this.message = `Temp file created at: ${tempFilePath}`;
    console.log(`Temp file created at: ${tempFilePath}`); // For debugging
  }
}
