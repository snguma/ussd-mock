<template>
    <div class="top-bar">
        <div class="bar-icons">
            <a class="left-icons">
                <span>
                    <i class="fa fa-lock"></i>
                </span>
                <span> {{ this.phoneNumber }}</span>
            </a>
            <a class="right-icons">
                <span>
                    <i class="fa fa-wifi"></i>
                </span>
                <span>
                    <i class="fa fa-signal"></i>
                </span>
                <span>
                    <small>98%</small><i class="fa fa-battery-full"></i>
                </span>
                <span>
                    <small>{{ this.currentTime }}</small>
                </span>
            </a>
        </div>
    </div>
</template>
<script>
import * as AppUtils from '@/utils/AppUtils'
export default {
    data() {
        return {
            currentTime: "13:30",
            phoneNumber: null
        };
    },
    created() {
        setInterval(this.getNow, 1000);
        this.getPhoneNumber();
    },
    methods: {
        getNow: function () {
            const today = new Date();
            //const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
            const time = today.getHours() + ":" + minutes;
            const dateTime = time;
            this.currentTime = dateTime;
        },
        getPhoneNumber: function() {
            this.phoneNumber = AppUtils.getMsisdn();
            console.log(this.phoneNumber);
        }
    },
}
</script>