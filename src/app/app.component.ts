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
        const desKey = Buffer.from('12345678'); // 8-byte key for DES
        const aesKey = Buffer.from('1234567890123456'); // 16-byte key for AES
        const iv = crypto.randomBytes(16); // Random IV for AES

        // DES Encryption (using createCipheriv for DES)
        const desCipher = crypto.createCipheriv('des-cbc', desKey, Buffer.alloc(8)); // IV must be 8 bytes for DES
        let desEncrypted = desCipher.update(secretText, 'utf8', 'hex');
        desEncrypted += desCipher.final('hex');

        // AES Encryption (using createCipheriv)
        const aesCipher = crypto.createCipheriv('aes-128-cbc', aesKey, iv);
        let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
        aesEncrypted += aesCipher.final('hex');

        // Expose sensitive data directly (vulnerable practice)
        this.encryptedData = {
            des: desEncrypted,
            aes: aesEncrypted,
            iv: iv.toString('hex'), // Expose IV for educational purposes
        };

        console.log('DES Encrypted:', desEncrypted);
        console.log('AES Encrypted:', aesEncrypted);
    }
}
