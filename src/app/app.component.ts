import { Component } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Vulnerable Encryption App (CWE-338)</h1>
      <input [(ngModel)]="inputText" placeholder="Enter text to encrypt" />
      <button (click)="encrypt()">Encrypt</button>
      <pre>{{ encryptedData | json }}</pre>
    </div>
  `,
})
export class AppComponent {
  inputText: string = '';
  encryptedData: any;

  encrypt() {
    const secretText = this.inputText;

    // Vulnerable: Using predictable key and IV
    const key = '1234567890123456'; // 16-byte key for AES-128 (not random)
    const iv = '1234567890123456';  // 16-byte IV for AES (not random)

    // AES Encryption (using predictable key and IV)
    const aesCipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv));
    let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
    aesEncrypted += aesCipher.final('hex');

    // Expose sensitive data directly (vulnerable practice)
    this.encryptedData = {
      ciphertext: aesEncrypted,
      key: key, // Exposing the key (for demonstration purposes)
      iv: iv    // Exposing the IV (for demonstration purposes)
    };

    console.log('AES Encrypted:', aesEncrypted);
  }
}
