import { JSEncrypt } from 'jsencrypt'

export function encryptByPub(pubKey, data) {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(pubKey);
    let result = encryptor.encrypt(data);
    console.log("----pub--",pubKey);
    console.log("----data--",data);
    console.log("--result--", result);
    return result;
}
export function decryptByPub(pubKey, data) {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(pubKey);
    let result = encryptor.decrypt(data)
    console.log("----pub--",pubKey);
    console.log("----data--",data);
    console.log("--result--", result);
    return result
}

export function encryptByPri(priKey, data) {
    let decryptor = new JSEncrypt();
    decryptor.setPrivateKey(priKey);
    let result = decryptor.encrypt(data)
    console.log("----priKey--",priKey);
    console.log("----data--",data);
    console.log("--result--", result);
    return result
}
export function decryptByPri(priKey, data) {
    let decryptor = new JSEncrypt();
    decryptor.setPrivateKey(priKey);
    let result = decryptor.decrypt(data);
    console.log("----priKey--",priKey);
    console.log("----data--",data);
    console.log("--result--", result);
    return result
}