import axios from 'axios'


export function sendUssdRequest(endpoint, ...args) {
    return axios.get(endpoint, ...args)
}

export function loadDefaultConfigs() {
    let configs = process.env.VUE_APP_DEFAULT_CONFIGS
    let localStorageConfigs = getConfigs()
    if (localStorageConfigs.length === 0) {
        setConfigs(configs)
    }

}

export function getConfigs() {
    let configs = localStorage.getItem(process.env.VUE_APP_LOCAL_STORAGE_NAME) || '[]'
    configs = isValidJson(configs) ? configs : process.env.VUE_APP_DEFAULT_CONFIGS
    return JSON.parse(configs)
}

export function setConfigs(configs) {
    localStorage.setItem(process.env.VUE_APP_LOCAL_STORAGE_NAME, JSON.stringify(configs));
}

export function getMsisdn() {
    let configs = getConfigs()
    configs = JSON.parse(configs)
    return configs.msisdn
}

export function getURL() {
    let url = ''
    let configs = getConfigs()
    if (configs.active_environment === 'sandbox') {
        let sandboxConfigs = configs.sandbox
        url = sandboxConfigs.endpoint
    } else {
        let liveConfigs = JSON.parse(configs)
        url = liveConfigs.live.endpoint
    }
    return url
}

export function isValidJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}