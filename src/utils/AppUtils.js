import axios from 'axios'


export function sendUssdRequest(endpoint, ...args) {
    return axios.get(endpoint, ...args)
}

export function loadUserConfigs() {
    let configs = process.env.VUE_APP_USER_CONFIGS
    let localStorageConfigs = getUserConfigs()
    if (localStorageConfigs.length === 0) {
        setUserConfigs(configs)
    }

}

export function getAppConfigs() {
    let configs = process.env.VUE_APP_DEFAULT_CONFIGS
    return JSON.parse(configs)
}

export function getUserConfigs(){
    let configs = localStorage.getItem(process.env.VUE_APP_LOCAL_STORAGE_NAME) || '[]'
    configs = isValidJson(configs) ? configs : process.env.VUE_APP_USER_CONFIGS
    return JSON.parse(configs)
}

export function setUserConfigs(configs) {
    localStorage.setItem(process.env.VUE_APP_LOCAL_STORAGE_NAME, JSON.stringify(configs));
}

export function getMsisdn() {
    let configs = getUserConfigs()
    configs = JSON.parse(configs)
    return configs.msisdn
}

export function getURL() {
    let url = ''
    let env = getEnvironment()
    let appConfigs = getAppConfigs()
    if (env === 'sandbox') {
        url = appConfigs.sandbox.endpoint
    } else {
        url = appConfigs.live.endpoint
    }
    return url
}

export function isDialCodeAllowed(dialCode){
    let allowedCodes = []
    let appConfigs = getAppConfigs()
    let env = getEnvironment()
    if (env === 'sandbox') {
        allowedCodes = appConfigs.sandbox.codes
    } else {
        allowedCodes = appConfigs.live.codes
    }
    return allowedCodes.includes(dialCode)
}

export function getEnvironment(){
    let configs = getUserConfigs()
    configs = JSON.parse(configs)
    return configs.environment
}

export function isValidJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function generateSessionId() {
    let text = ""
    let chars = "abcdefghjklmnpqrstuvwxyz123456789"

    for (let i = 0; i < 10; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text.toUpperCase()
}

export function encodeRFC5987ValueChars(str) {
    return (
      encodeURIComponent(str)
        // The following creates the sequences %27 %28 %29 %2A (Note that
        // the valid encoding of "*" is %2A, which necessitates calling
        // toUpperCase() to properly encode). Although RFC3986 reserves "!",
        // RFC5987 does not, so we do not need to escape it.
        .replace(
          /['()*]/g,
          (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
        )
        // The following are not required for percent-encoding per RFC5987,
        // so we can allow for a little better readability over the wire: |`^
        .replace(/%(7C|60|5E)/g, (str, hex) =>
          String.fromCharCode(parseInt(hex, 16)),
        )
    );
  }