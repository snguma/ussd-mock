<template>
    <div class="phone-to-call">
        <input id="dial-code" v-show="dialCodeInterface" v-model="dialCode" type="text" :maxlength="maxDigits" />
    </div>
    <div class="phone-dialpad" v-show="dialCodeInterface">
        <ul>
            <li v-for="digit in digits" :key="digit" @click="appendDigit(digit)">{{ digit.number }} <span>{{ digit.letters
            }}</span></li>
            <li @click="showSettingsInterface"><i class="fa fa-cog"></i></li>
            <li @click="call"><i class="fa fa-phone"></i></li>
            <li @click="clearDialedCode"><i class="fa fa-times"></i></li>
        </ul>
    </div>
    <div class="overlay" v-show="callingInterface">
        <div class="calling-info">
            <h2>{{ this.environment }} USSD</h2>
            <p>{{ this.dialCode }}</p>
            <small>Calling</small>
        </div>
        <div class="call-icons">
            <ul>
                <li><a><i class="fa fa-keyboard-o"></i><span>Dial pad</span></a></li>
                <li><a><i class="fa fa-volume-control-phone"></i><span>volume</span></a></li>
                <li><a><i class="fa fa-user-plus"></i><span>user</span></a></li>
                <li><a><i class="fa fa-pause"></i><span>pause</span></a></li>
                <li><a><i class="fa fa-headphones"></i><span>headphone</span></a></li>
                <li><a><i class="fa fa-bell-slash"></i><span>silent</span></a></li>
            </ul>
        </div>
        <div class="end-call-button">
            <a @click="cancelCall"><i class="fa fa-phone"></i></a>
        </div>
    </div>
    <div class="overlay" v-show="resultInterface">
        <div class="calling-info">
            <h2>Response</h2>
        </div>
        <div class="call-result">
            <p>{{ this.backendResponse }}</p>
        </div>
        <div class="call-input">
            <input class="form-input" v-show="showResponseInput" v-model="responseInputCode" type="text" :maxlength="maxDigits" />
        </div>
        <div class="send-response-button">
            <a class="submitButton" v-show="showResponseInput" @click="submitButton"><i class="fa fa-check"></i></a>
            <a class="cancelButton" @click="cancelCall"><i class="fa fa-times"></i></a>
        </div>
    </div>
    <div class="overlay" v-show="settingsInterface">
        <div class="calling-info">
            <h2>Settings</h2>
        </div>
        <div class="settings-form">
            <form>
                <div class="input-container">
                    <label class="input-label" for="msisdn">MSISDN</label>
                    <input class="form-input" v-model="msisdn" type="text" />
                </div>

                <div class="input-container">
                    <label class="input-label" for="environment">Environment</label>
                </div>

                <div class="form-radio-select">
                    <div class="radio-select-button">
                        <input type="radio" value="sandbox" v-model="environment" name="chkEnvironment" />
                        <label class="btn btn-default" for="a25">Sandbox</label>
                    </div>
                    <div class="radio-select-button">
                        <input type="radio" value="live" v-model="environment" name="chkEnvironment" />
                        <label class="btn btn-default" for="a50">Live</label>
                    </div>
                </div>
            </form>

        </div>
        <div class="send-response-button">
            <a class="submitButton" @click="saveSettings"><i class="fa fa-save"></i></a>
            <a class="cancelButton" @click="cancelCall"><i class="fa fa-times"></i></a>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import * as AppUtils from '@/utils/AppUtils'

export default {
    data() {
        return {
            dialCode: "",
            responseInputCode: "",
            dialCodeInterface: true,
            callingInterface: false,
            resultInterface: false,
            showResponseInput: false,
            settingsInterface: false,
            backendResponse: "",
            environment: "",
            maxDigits: 10,
            sessionId: null,
            appSettings: null,
            msisdn: null,
            digits: [
                { 'number': 1, 'letters': '&' },
                { 'number': 2, 'letters': 'abc' },
                { 'number': 3, 'letters': 'def' },
                { 'number': 4, 'letters': 'ghi' },
                { 'number': 5, 'letters': 'jkl' },
                { 'number': 6, 'letters': 'mno' },
                { 'number': 7, 'letters': 'pqrs' },
                { 'number': 8, 'letters': 'tuv' },
                { 'number': 9, 'letters': 'wxyz' },
                { 'number': '*', 'letters': 'W' },
                { 'number': 0, 'letters': '+' },
                { 'number': '#', 'letters': 'P' }
            ],
        };
    },
    methods: {
        appendDigit(digit) {
            if (this.dialCode.length < this.maxDigits) {
                this.dialCode += digit.number;
            }
        },
        call() {
            this.environment = AppUtils.getEnvironment()
            // Add logic to initiate a call with the dial code
            if (this.dialCode !== '') {
                //check if dial code is allowed
                if (AppUtils.isDialCodeAllowed(this.dialCode)) {
                    this.sessionId = AppUtils.generateSessionId()

                    let endpoint = "";
                    endpoint += AppUtils.getURL()
                    endpoint += '?MSISDN=' + AppUtils.getMsisdn()
                    endpoint += '&SESSIONID=' + this.sessionId
                    endpoint += '&STAGE=BEGIN'
                    endpoint += '&DATA=' + this.responseInputCode
                    endpoint += '&SHORTCODE=' + AppUtils.encodeRFC5987ValueChars(this.dialCode)
                    axios
                        .get(endpoint)
                        .then(response => {
                            console.log(response)
                            this.handleUSSDOkResponse(response)
                        })
                        .catch(error => {
                            console.log(error)
                            this.handleUSSDErrorResponse("An error has occurred")
                        })

                    this.dialCodeInterface = false;
                    this.callingInterface = true;
                    this.resultInterface = false;
                    this.settingsInterface = false;
                } else {
                    this.handleUSSDErrorResponse("The code is not whitelisted")
                }
            }

        },
        clearDialedCode() {
            console.log("Clear Dialed Numbers");
            this.dialCode = ''
        },

        cancelCall() {
            this.dialCodeInterface = true;
            this.callingInterface = false;
            this.resultInterface = false;
            this.settingsInterface = false;
        },

        handleUSSDOkResponse(response) {
            let responseData = response.data
            let splitResponse = responseData.split("|")[0]
            this.backendResponse = splitResponse
            this.dialCodeInterface = false;
            this.callingInterface = false;
            this.resultInterface = true;
            this.showResponseInput = true;
            this.settingsInterface = false;
        },

        handleUSSDErrorResponse(message) {
            this.backendResponse = message
            this.dialCodeInterface = false;
            this.callingInterface = false;
            this.resultInterface = true;
            this.settingsInterface = false;
            this.showResponseInput = false;
        },

        showSettingsInterface() {
            this.msisdn = AppUtils.getMsisdn()
            this.environment = AppUtils.getEnvironment()
            this.dialCodeInterface = false;
            this.callingInterface = false;
            this.resultInterface = false;
            this.settingsInterface = true;
        },

        saveSettings() {
            let configs = '{"environment": "'+this.environment+'", "msisdn": "'+this.msisdn+'"}'
            AppUtils.setUserConfigs(configs)
            this.handleUSSDErrorResponse("Saved Successfully")
        },

        submitButton() {
            let endpoint = "";
            endpoint += AppUtils.getURL()
            endpoint += '?MSISDN=' + AppUtils.getMsisdn()
            endpoint += '&SESSIONID=' + this.sessionId
            endpoint += '&STAGE=CONTINUE'
            endpoint += '&DATA=' + this.responseInputCode
            endpoint += '&SHORTCODE=' + AppUtils.encodeRFC5987ValueChars(this.dialCode)
            this.responseInputCode = null
            AppUtils.sendUssdRequest(endpoint).then(response => {
                console.log(response)
                this.handleUSSDOkResponse(response)
            }).catch(error => {
                console.log(error)
                this.handleUSSDErrorResponse("An error has occurred")
            });
            this.dialCodeInterface = false;
            this.callingInterface = true;
            this.resultInterface = false;
            this.settingsInterface = false;
        }
    },
    mounted() {
        AppUtils.loadUserConfigs()
    },


};
</script>