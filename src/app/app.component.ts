import { Component } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Vulnerable Encryption App</h1>
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

    // DES Encryption (using createCipheriv)
    const desKey = Buffer.from('12345678'); // 8-byte key for DES
    const desIv = Buffer.alloc(8); // DES uses 8-byte IV
    const desCipher = crypto.createCipheriv('des-cbc', desKey, desIv); // Use createCipheriv for DES
    let desEncrypted = desCipher.update(secretText, 'utf8', 'hex');
    desEncrypted += desCipher.final('hex');

    // AES Encryption (using createCipheriv)
    const aesKey = Buffer.from('1234567890123456'); // 16-byte key for AES-128
    const aesIv = crypto.randomBytes(16); // Random 16-byte IV for AES
    const aesCipher = crypto.createCipheriv('aes-128-cbc', aesKey, aesIv); // Use createCipheriv for AES
    let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
    aesEncrypted += aesCipher.final('hex');

    // Expose sensitive data directly (vulnerable practice)
    this.encryptedData = {
      des: desEncrypted,
      aes: aesEncrypted,
      aesIv: aesIv.toString('hex'), // Exposing the IV for AES (for demonstration)
    };

    console.log('DES Encrypted:', desEncrypted);
    console.log('AES Encrypted:', aesEncrypted);
  }
}
