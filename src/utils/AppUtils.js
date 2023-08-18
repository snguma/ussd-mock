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

export function isDialCodeAllowed(dialCode){
    let allowedCodes = []
    let configs = getConfigs()
    if (configs.active_environment === 'sandbox') {
        let sandboxConfigs = configs.sandbox
        allowedCodes = sandboxConfigs.codes
    } else {
        let liveConfigs = JSON.parse(configs)
        allowedCodes = liveConfigs.live.codes
    }
    return allowedCodes.includes(dialCode)
}

export function getEnvironment(){
    let configs = getConfigs()
    configs = JSON.parse(configs)
    return configs.active_environment.toUpperCase()
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