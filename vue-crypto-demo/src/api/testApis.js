import http from "@/utils/request";

export function beforeLoginTest(data) {
    return http({
        url: '/beforeLoginTest',
        method: 'post',
        data
    })
}

export function loginRequiredTest(data) {
    return http({
        url: '/loginRequiredTest',
        method: 'post',
        data
    })
}

export function reqEncryptTest(data) {
    return http({
        headers: {"req-encrypted-fields": "userName;password", "cheerfish-data-sign": "password"},
        url: '/reqEncryptTest',
        method: 'post',
        data
    })
}

export function loginEntryTest(data) {
    return http({
        headers: {"req-encrypted-fields": "userName;password"},
        url: '/loginEntryTest',
        method: 'post',
        data
    })
}

export function respEncryptedTest(data) {
    return http({
        url: '/respEncryptedTest',
        method: 'post',
        data
    })
}

export function replayDefenseTest(data) {
    return http({
        headers: {"cheerfish-replay": "replayDefenseTest",},
        url: '/replayDefenseTest',
        method: 'post',
        data
    })
}