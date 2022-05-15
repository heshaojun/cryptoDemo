import axios from 'axios'
import {Promise} from 'core-js'
import {
    getToken,
    storeToken,
    getClientKey,
    createClientKey,
    getServerKey,
    isLogged,
    getClientPriKey,
    storeServerKey,
    storeClientPriKey,
    storeClientPubKey,
    storeServerPubKey
} from "./session"
import {symmEncrypt, asymmDecrypt, symmDecrypt} from "./crypto"
import qs from 'qs'

const http = axios.create({
    timeout: 10000, // request timeout,
    baseURL: '/test'
})
http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

http.interceptors.request.use(config => {
    let token = getToken();
    console.log("---------------token === ", token)
    if (token !== null && token !== undefined && token !== "") {
        config.headers['cheerfish-token'] = token;
        if (getClientKey() === null || getClientKey() === "") {
            let clientKey = createClientKey();
            console.log("--------------clientKey", clientKey)
            config.headers['cheerfish-client-key'] = clientKey;
        }
    }
    let encryptedFields = config.headers["req-encrypted-fields"];
    let signFields = config.headers[""];
    if (config.method.toUpperCase() === "POST") {
        if (encryptedFields) {
            let fields = encryptedFields.split(';');
            console.log("----加密前数据：", config.data)
            if (fields) {
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.data[key]
                    if (data) {
                        data = symmEncrypt(data, getServerKey())
                        config.data[key] = data
                    }
                }
                console.log("----加密数据：", config.data)
            }
        }
        if (!(config.data instanceof FormData)) {
            config.data = qs.stringify(config.data)
        }
    }
    if (config.method.toUpperCase() === "GET") {
        if (encryptedFields) {
            let fields = encryptedFields.split(';');
            console.log("----加密前数据：", config.params);
            if (fields) {
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.params[key]
                    if (data) {
                        data = symmEncrypt(data, getServerKey())
                        config.params[key] = data
                    }
                }
                console.log("----加密数据：", config.params)
            }
        }
    }
    return config;
}, error => {
    return Promise.reject(error)
})
http.interceptors.response.use(resp => {
    let token = resp.headers['set-cheerfish-token'];
    console.log("------set token", token)
    if (token !== null && token !== undefined && token !== "") {
        storeToken(token)
    }
    let clientCert = resp.headers['set-client-cert'];
    if (clientCert !== null && clientCert !== undefined && clientCert !== "") {
        clientCert = symmDecrypt(clientCert, getClientKey())
        let keys = clientCert.split("#");
        storeClientPriKey(keys[0]);
        storeClientPubKey(keys[1])
        storeServerPubKey(keys[2])
    }
    let serverKey = resp.headers['set-cheerfish-server-key']
    if (serverKey !== null && serverKey !== undefined && serverKey !== "") {
        console.log("--- 解密前serverKey：", serverKey)
        if (isLogged()) {
            serverKey = asymmDecrypt(serverKey, getClientPriKey());
        } else {
            serverKey = symmDecrypt(serverKey, getToken());
        }
        storeServerKey(serverKey);
        console.log("--- 解密后serverKey：", serverKey)
    }


    return resp
}, error => {
    return Promise.reject(error)
})
export default http