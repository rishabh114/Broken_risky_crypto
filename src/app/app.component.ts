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
            <button (click)="showDecryptedText()">Show Decrypted Text</button>
        </div>
    `,
})
export class AppComponent {
    inputText: string = '';
    encryptedData: any;

    encrypt() {
        // Vulnerable: Hardcoded key (not secure)
        const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes key

        // Generate a random initialization vector (IV)
        const iv = crypto.randomBytes(12); // 12 bytes for GCM mode

        // Use the input text as the secret text
        const secretText = this.inputText;

        // AES Encryption using AES-256-GCM
        const aesCipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let aesEncrypted = aesCipher.update(secretText, 'utf8', 'hex');
        aesEncrypted += aesCipher.final('hex');

        // Get the authentication tag
        const tag = aesCipher.getAuthTag().toString('hex');

        // Expose sensitive data directly (vulnerable practice)
        this.encryptedData = {
            iv: iv.toString('hex'),        // IV exposed
            ciphertext: aesEncrypted,      // Ciphertext exposed
            tag: tag                       // Authentication tag exposed
        };

        console.log('Encrypted Data:', JSON.stringify(this.encryptedData));
    }

    // Vulnerable decryption function
    decrypt(encryptedData: { iv: string; ciphertext: string; tag: string }): string {
        const key = Buffer.from('12345678901234567890123456789012'); // Hardcoded key
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const tag = Buffer.from(encryptedData.tag, 'hex');
        const encryptedText = Buffer.from(encryptedData.ciphertext, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encryptedText, undefined, 'utf8'); // Note: inputEncoding set to undefined
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // Example decryption (for demonstration purposes)
    showDecryptedText() {
        if (this.encryptedData) {
            const decryptedText = this.decrypt(this.encryptedData);
            console.log('Decrypted Text:', decryptedText);
        }
    }
}
