import {JSEncrypt} from 'jsencrypt'
import CryptoJS from 'crypto-js'


export function symmEncrypt(data, key) {
    let kb = CryptoJS.enc.Utf8.parse(key);
    let k = CryptoJS.SHA256(kb);
    let ck = CryptoJS.SHA256(k);
    let words = ck.words.slice(0, 4);
    ck.words = words;
    ck.sigBytes = 16;
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), k, {
        iv: ck,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function symmDecrypt(data, key) {
    let kb = CryptoJS.enc.Utf8.parse(key);
    let k = CryptoJS.SHA256(kb);
    let ck = CryptoJS.SHA256(k);
    let words = ck.words.slice(0, 4);
    ck.words = words;
    ck.sigBytes = 16;
    let decrypted = CryptoJS.AES.decrypt(data, k, {
        iv: ck,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
}

export function asymmEncrypt(data, pubKey) {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(pubKey);
    return encryptor.encrypt(data);
}

export function asymmDecrypt(data, priKey) {
    let decryptor = new JSEncrypt();
    decryptor.setPrivateKey(priKey);
    return decryptor.decrypt(data)
}

