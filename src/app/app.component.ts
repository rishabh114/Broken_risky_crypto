/* 
Sample Code for Vulnerability Type: Use of a Broken or Risky Cryptographic Algorithm
CWE: CWE-327: Use of a Broken or Risky Cryptographic Algorithm



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
    const desKey = Buffer.from('12345678'); // DES requires an 8-byte key
    const iv = Buffer.alloc(8, 0); // Initialization vector for DES and AES

    // DES Encryption (Avoid if possible due to weak encryption)
    const desCipher = crypto.createCipheriv('des-cbc', desKey, iv); // DES encryption with CBC mode
    let desEncrypted = desCipher.update(secretText, 'utf8', 'hex');
    desEncrypted += desCipher.final('hex');

    // AES-128-CBC Encryption (Preferred for strong encryption)
    const aesIv = crypto.randomBytes(16); // Random IV for AES-128-CBC
    const aesCipher = crypto.createCipheriv('aes-128-cbc', key, aesIv); // AES-128-CBC encryption
    let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
    aesEncrypted += aesCipher.final('hex');

    // Store encrypted data
    this.encryptedData = {
      des: desEncrypted,
      aes: aesEncrypted,
      aesIv: aesIv.toString('hex'), // Exposing IV for AES-128-CBC
    };

    console.log('DES Encrypted:', desEncrypted);
    console.log('AES Encrypted:', aesEncrypted);
  }
}
