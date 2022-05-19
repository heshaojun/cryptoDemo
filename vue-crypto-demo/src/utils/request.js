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
    storeServerPubKey,
    getApiReplayNum,
    setApiReplayNum,
    signData,

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
    if (token !== null && token !== undefined && token !== "") {
        config.headers['cheerfish-token'] = token;
        let clientKey = getClientKey();
        if (clientKey === null || clientKey === undefined || clientKey === "") {
            let clientKey = createClientKey();
            config.headers['cheerfish-client-key'] = clientKey;
        }
    }
    let encryptedFields = config.headers["req-encrypted-fields"];
    let signFields = config.headers["cheerfish-data-sign"];
    if (config.method.toUpperCase() === "POST") {
        if (signFields) {
            let fields = signFields.split(';');
            if (fields) {
                let value = "";
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.data[key]
                    if (data) {
                        value += data;
                    }
                }
                let sign = signData(value)
                config.headers["cheerfish-data-sign"] = sign;
            }
        }
        if (encryptedFields) {
            let fields = encryptedFields.split(';');
            if (fields) {
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.data[key]
                    if (data) {
                        data = symmEncrypt(data, getServerKey())
                        config.data[key] = data
                    }
                }
            }
        }
        if (!(config.data instanceof FormData)) {
            config.data = qs.stringify(config.data)
        }
    }
    if (config.method.toUpperCase() === "GET") {
        if (signFields) {
            let fields = signFields.split(';');
            if (fields) {
                let value = "";
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.params[key]
                    if (data) {
                        value += data;
                    }
                }
                config.headers["cheerfish-data-sign"] = signData(value);
            }
        }
        if (encryptedFields) {
            let fields = encryptedFields.split(';');
            if (fields) {
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let data = config.params[key]
                    if (data) {
                        data = symmEncrypt(data, getServerKey())
                        config.params[key] = data
                    }
                }
            }
        }
    }
    let replay = config.headers["cheerfish-replay"]
    if (replay) {
        let apiId = config.headers["api-id"];
        if (apiId) {
            let replayContext = apiId + "#" + getApiReplayNum(apiId);
            let contextSign = signData(replayContext);
            replayContext = replayContext + "#" + contextSign;
            replayContext = symmEncrypt(replayContext, getServerKey());
            config.headers["cheerfish-replay"] = replayContext;
            config.headers["api-id"] = "";
        }
    }
    return config;
}, error => {
    return Promise.reject(error)
})
http.interceptors.response.use(resp => {
    let token = resp.headers['set-cheerfish-token'];
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
        if (isLogged()) {
            serverKey = asymmDecrypt(serverKey, getClientPriKey());
        } else {
            serverKey = symmDecrypt(serverKey, getToken());
        }
        storeServerKey(serverKey);
    }
    let replayMark = resp.headers["set-cheerfish-replay"]
    if (replayMark) {
        if (isLogged()) {
            replayMark = symmDecrypt(replayMark, getClientKey())
        } else {
            replayMark = asymmDecrypt(replayMark, getClientPriKey())
        }
        let datas = replayMark.split("#");
        let apiId = datas[0];
        let num = datas[1];
        setApiReplayNum(apiId, num);
    }
    let respDataEncrypted 
    return resp
}, error => {
    let token = error.headers['set-cheerfish-token'];
    if (token !== null && token !== undefined && token !== "") {
        storeToken(token)
    }
    let clientCert = error.headers['set-client-cert'];
    if (clientCert !== null && clientCert !== undefined && clientCert !== "") {
        clientCert = symmDecrypt(clientCert, getClientKey())
        let keys = clientCert.split("#");
        storeClientPriKey(keys[0]);
        storeClientPubKey(keys[1])
        storeServerPubKey(keys[2])
    }
    let serverKey = error.headers['set-cheerfish-server-key']
    if (serverKey !== null && serverKey !== undefined && serverKey !== "") {
        if (isLogged()) {
            serverKey = asymmDecrypt(serverKey, getClientPriKey());
        } else {
            serverKey = symmDecrypt(serverKey, getToken());
        }
        storeServerKey(serverKey);
    }
    let replayMark = error.headers["set-cheerfish-replay"]
    if (replayMark) {
        if (isLogged()) {
            replayMark = symmDecrypt(replayMark, getClientKey())
        } else {
            replayMark = asymmDecrypt(replayMark, getClientPriKey())
        }
        let datas = replayMark.split("#");
        let apiId = datas[0];
        let num = datas[1];
        setApiReplayNum(apiId, num);
    }
    return Promise.reject(error)
})
export default http