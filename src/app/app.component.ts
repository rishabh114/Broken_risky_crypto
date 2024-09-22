import { Component } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Vulnerable Temporary File App (CWE-377)</h1>
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
    const tempDir = path.join(__dirname, 'temp'); // Insecure temporary directory
    const tempFilePath = path.join(tempDir, 'tempfile.txt');

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Vulnerable: Writing user input to a temporary file without proper permissions
    fs.writeFileSync(tempFilePath, this.inputText, { mode: 0o666 }); // Readable and writable by all users

    this.message = `Temp file created at: ${tempFilePath}`;
    console.log(`Temp file created at: ${tempFilePath}`); // For debugging
  }
}
