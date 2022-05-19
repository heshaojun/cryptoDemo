import axios from 'axios'
import {Promise} from 'core-js'
import {
    HeaderNames,
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
        config.headers[HeaderNames.headerToken] = token;
        let clientKey = getClientKey();
        if (clientKey === null || clientKey === undefined || clientKey === "") {
            let clientKey = createClientKey();
            config.headers[HeaderNames.headerClientKey] = clientKey;
        }
    }
    let encryptedFields = config.headers[HeaderNames.headerReqEncryptFields];
    let signFields = config.headers[HeaderNames.headerSignMark];
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
                config.headers[HeaderNames.headerSignMark] = sign;
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
                config.headers[HeaderNames.headerSignMark] = signData(value);
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
    let replay = config.headers[HeaderNames.headerReplayMark]
    if (replay) {
        let apiId = replay
        if (apiId) {
            let replayContext = apiId + "#" + getApiReplayNum(apiId);
            let contextSign = signData(replayContext);
            replayContext = replayContext + "#" + contextSign;
            replayContext = symmEncrypt(replayContext, getServerKey());
            config.headers[HeaderNames.headerReplayMark] = replayContext;
        }
    }
    return config;
}, error => {
    return Promise.reject(error)
})
http.interceptors.response.use(resp => {
    let token = resp.headers[HeaderNames.setHeaderToken];

    if (token !== null && token !== undefined && token !== "") {
        storeToken(token)
    }
    let clientCert = resp.headers[HeaderNames.setHeaderClientCert];
    if (clientCert !== null && clientCert !== undefined && clientCert !== "") {
        clientCert = symmDecrypt(clientCert, getClientKey())
        let keys = clientCert.split("#");
        storeClientPriKey(keys[0]);
        storeClientPubKey(keys[1]);
        storeServerPubKey(keys[2]);
    }
    let serverKey = resp.headers[HeaderNames.setHeaderServerKey]
    if (serverKey !== null && serverKey !== undefined && serverKey !== "") {
        if (isLogged()) {
            serverKey = asymmDecrypt(serverKey, getClientPriKey());
        } else {
            serverKey = symmDecrypt(serverKey, getToken());
        }
        storeServerKey(serverKey);
    }
    let replayMark = resp.headers[HeaderNames.setHeaderReplayMark]
    if (replayMark) {
        replayMark = symmDecrypt(replayMark, getClientKey())
        let datas = replayMark.split("#");
        let apiId = datas[0];
        let num = datas[1];
        setApiReplayNum(apiId, num);
    }
    let respDataEncrypted = resp.headers[HeaderNames.headerRespDataEncryptedMark]
    if (respDataEncrypted === 'true') {
        if (resp.data.data) {
            resp.data.data = JSON.parse(symmDecrypt(resp.data.data, getClientKey()))
        }
    }
    return resp
}, error => {
    let resp = error.response;

    let token = resp.headers[HeaderNames.setHeaderToken];
    if (token !== null && token !== undefined && token !== "") {
        storeToken(token)
    }
    let clientCert = resp.headers[HeaderNames.setHeaderClientCert];
    if (clientCert !== null && clientCert !== undefined && clientCert !== "") {
        clientCert = symmDecrypt(clientCert, getClientKey())
        let keys = clientCert.split("#");
        storeClientPriKey(keys[0]);
        storeClientPubKey(keys[1])
        storeServerPubKey(keys[2])
    }
    let serverKey = resp.headers[HeaderNames.setHeaderServerKey]
    if (serverKey !== null && serverKey !== undefined && serverKey !== "") {
        if (isLogged()) {
            serverKey = asymmDecrypt(serverKey, getClientPriKey());
        } else {
            serverKey = symmDecrypt(serverKey, getToken());
        }
        storeServerKey(serverKey);
    }
    let replayMark = resp.headers[HeaderNames.setHeaderReplayMark]
    if (replayMark) {
        replayMark = symmDecrypt(replayMark, getClientKey())
        let datas = replayMark.split("#");
        let apiId = datas[0];
        let num = datas[1];
        setApiReplayNum(apiId, num);
    }
    return Promise.reject(error)
})
export default http