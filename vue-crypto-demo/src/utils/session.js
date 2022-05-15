import {asymmEncrypt, symmEncrypt} from "./crypto"

import {v4} from 'uuid';

const ServerPubKey = "serverPubKey";
const ServerKey = "serverKey";
const ClientPubKey = "clientPubKey";
const ClientPriKey = "clientPriKey";
const ClientKey = "clientKey";
const Token = "token";
const LoginMark = "loginMark";

const Storage = sessionStorage;

export function getServerPubKey() {
    return Storage.getItem(ServerPubKey)
}

export function storeServerPubKey(serverPubKey) {
    Storage.setItem(ServerPubKey, serverPubKey);
}

export function getClientPriKey() {
    return Storage.getItem(ClientPriKey);
}

export function storeClientPriKey(clientPriKey) {
    Storage.setItem(ClientPriKey, clientPriKey)
}

export function getClientPubKey() {
    return Storage.getItem(ClientPubKey)
}

export function storeClientPubKey(clientPubKey) {
    Storage.setItem(ClientPubKey, clientPubKey);
}

export function getServerKey() {
    return Storage.getItem(ServerKey);
}

export function storeServerKey(serverKey) {
    Storage.setItem(ServerKey, serverKey)
}

export function getClientKey() {
    return Storage.getItem(ClientKey);
}

export function storeClientKey(clientKey) {
    Storage.setItem(ClientKey, clientKey);
}

export function getToken() {
    return Storage.getItem(Token);
}

export function storeToken(token) {
    Storage.setItem(Token, token)
}

export function login() {
    Storage.setItem(LoginMark, "logged")
}

export function isLogged() {
    Storage.removeItem(ClientKey)
    return Storage.getItem(LoginMark) === "logged"
}

export function logout() {
    return Storage.removeItem(LoginMark)
}

export function uuid() {
    return v4().replace(/-/g, "");
}

export function createClientKey() {
    let clientKey = uuid();
    console.log("----------客户端密钥原文：", clientKey)
    let encrypted = "";
    if (isLogged()) {
        encrypted = asymmEncrypt(clientKey, getServerPubKey())
    } else {
        encrypted = symmEncrypt(clientKey, getToken())
    }
    console.log("----------客户端密钥密文：", encrypted)
    storeClientKey(clientKey);
    return encrypted;
}