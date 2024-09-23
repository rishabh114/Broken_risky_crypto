/* 
Sample Code for Vulnerability Type: Use of a Broken or Risky Cryptographic Algorithm
CWE: CWE-327: Use of a Broken or Risky Cryptographic Algorithm

Description: It exposes the initialization vector (IV), allowing potential pattern recognition in encrypted data. Additionally, if the encryption key is not securely managed, it could lead to unauthorized decryption of sensitive information. Proper practices should include using a random IV for each encryption and securely managing keys.
*/
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
    const key = Buffer.from('your-secret-key-16'); // Replace with a 16-byte key for AES-128
    const aesIv = crypto.randomBytes(16); // Random IV for AES-128-CBC

    // AES-128-CBC Encryption (Preferred for strong encryption)
    const aesCipher = crypto.createCipheriv('aes-128-cbc', key, aesIv); // AES-128-CBC encryption
    let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
    aesEncrypted += aesCipher.final('hex');

    // Store encrypted data
    this.encryptedData = {
      aes: aesEncrypted,
      aesIv: aesIv.toString('hex'), // Exposing IV for educational purposes
    };

    console.log('AES Encrypted:', aesEncrypted);
  }
}
