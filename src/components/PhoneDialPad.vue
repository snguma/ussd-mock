<template>
    <div class="phone-to-call">
        <input id="dial-code" v-show="dialCodeInterface" v-model="dialCode" type="text" :maxlength="maxDigits" />
    </div>
    <div class="phone-dialpad" v-show="dialCodeInterface">
        <ul>
            <li v-for="digit in digits" :key="digit" @click="appendDigit(digit)">{{ digit.number }} <span>{{ digit.letters
            }}</span></li>
            <li><i class="fa fa-cog"></i></li>
            <li @click="call"><i class="fa fa-phone"></i></li>
            <li @click="clearDialedCode"><i class="fa fa-times"></i></li>
        </ul>
    </div>
    <div class="overlay" v-show="callingInterface">
        <div class="calling-info">
            <h2>Live USSD</h2>
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
            <input v-model="responseInputCode" type="text" :maxlength="maxDigits" />
        </div>
        <div class="send-response-button">
            <a class="submitButton" @click="submitButton"><i class="fa fa-phone"></i></a>
            <a class="cancelButton" @click="cancelCall"><i class="fa fa-phone"></i></a>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            dialCode: "",
            responseInputCode: "",
            dialCodeInterface: true,
            callingInterface: false,
            resultInterface: false,
            backendResponse: "",
            maxDigits: 10,
            sessionId: null,
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
        generateSessionId() {
            let text = ""
            let chars = "abcdefghjklmnpqrstuvwxyz123456789"

            for (let i = 0; i < 10; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }

            return text.toUpperCase()
        },
        appendDigit(digit) {
            if (this.dialCode.length < this.maxDigits) {
                this.dialCode += digit.number;
            }
        },
        call() {
            // Add logic to initiate a call with the dial code
            if (this.dialCode !== '') {
                console.log("Calling:", this.dialCode);
                
                this.sessionId = this.generateSessionId()

                axios
                    .get('https://ussd.revenue.co.ke/api/v1/county/ussd?MSISDN=254720709784&SESSIONID='+this.sessionId+'&DATA=&STAGE=BEGIN&SHORTCODE=%2A604%23')
                    .then(response => {
                        console.log(response.data)
                        let responseData = response.data
                        let splitResponse = responseData.split("|");
                        this.backendResponse = splitResponse[0]
                        this.dialCodeInterface = false;
                        this.callingInterface = false;
                        this.resultInterface = true;
                    })
                    .catch(error => {
                        console.log(error)
                        this.backendResponse = "An error has occurred"
                        this.dialCodeInterface = false;
                        this.callingInterface = false;
                        this.resultInterface = true;
                    })

                this.dialCodeInterface = false;
                this.callingInterface = true;
            }

        },
        clearDialedCode() {
            console.log("Clear Dialed Numbers");
            this.dialCode = ''
        },
        cancelCall() {
            console.log("Cancel Call:", this.dialCode);
            this.dialCodeInterface = true;
            this.callingInterface = false;
            this.resultInterface = false;
        },
        submitButton() {

            console.log("Input: " + this.responseInputCode);
        }
    },
};
</script>