import { Component } from '@angular/core';
import * as crypto from 'crypto';

@Component({
    selector: 'app-root',
    template: `
        <div>
            <h1>Vulnerable Encryption App</h1>
            <input [(ngModel)]="inputText" placeholder="Enter text to encrypt" />
            <button (click)="encryptAes()">Encrypt with AES-128-CBC</button>
            <button (click)="encryptDes()">Encrypt with DES</button>
            <pre>{{ encryptedData | json }}</pre>
            <button (click)="showDecryptedText()">Show Decrypted Text</button>
        </div>
    `,
})
export class AppComponent {
    inputText: string = '';
    encryptedData: any;

    encryptAes() {
        // Vulnerable: Hardcoded key (not secure)
        const key = Buffer.from('1234567890123456'); // 16 bytes key for AES-128
        const iv = crypto.randomBytes(16); // 16 bytes IV for AES-CBC

        const secretText = this.inputText;

        // AES-128-CBC Encryption
        const aesCipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
        aesEncrypted += aesCipher.final('hex');

        // Expose sensitive data directly (vulnerable practice)
        this.encryptedData = {
            algorithm: 'aes-128-cbc',
            iv: iv.toString('hex'),
            ciphertext: aesEncrypted,
        };

        console.log('Encrypted Data (AES-128-CBC):', JSON.stringify(this.encryptedData));
    }

    encryptDes() {
        // Vulnerable: Hardcoded key (not secure)
        const key = Buffer.from('12345678'); // 8 bytes key for DES
        const iv = crypto.randomBytes(8); // 8 bytes IV for DES

        const secretText = this.inputText;

        // DES Encryption
        const desCipher = crypto.createCipheriv('des-cbc', key, iv);
        let desEncrypted = desCipher.update(secretText, 'utf8', 'hex');
        desEncrypted += desCipher.final('hex');

        // Expose sensitive data directly (vulnerable practice)
        this.encryptedData = {
            algorithm: 'des',
            iv: iv.toString('hex'),
            ciphertext: desEncrypted,
        };

        console.log('Encrypted Data (DES):', JSON.stringify(this.encryptedData));
    }

    // Example decryption function (vulnerable)
    decrypt(encryptedData: { iv: string; ciphertext: string; algorithm: string }): string {
        let key: Buffer;
        if (encryptedData.algorithm === 'aes-128-cbc') {
            key = Buffer.from('1234567890123456'); // Hardcoded key for AES-128
            const iv = Buffer.from(encryptedData.iv, 'hex');
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } else if (encryptedData.algorithm === 'des') {
            key = Buffer.from('12345678'); // Convert to Buffer for DES
            const iv = Buffer.from(encryptedData.iv, 'hex');
            const decipher = crypto.createDecipheriv('des-cbc', key, iv);
            let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        return '';
    }

    showDecryptedText() {
        if (this.encryptedData) {
            const decryptedText = this.decrypt(this.encryptedData);
            console.log('Decrypted Text:', decryptedText);
        }
    }
}
