<template>
    <div class="top-bar">
        <div class="bar-icons">
            <a class="left-icons">
                <span>
                    <i class="fa fa-lock"></i>
                </span>
            </a>
            <a class="right-icons">
                <span>
                    <i class="fa fa-wifi"></i>
                </span>
                <span>
                    <i class="fa fa-signal"></i>
                </span>
                <span>
                    <small>51%</small><i class="fa fa-battery-half"></i>
                </span>
                <span>
                    <small>{{ this.currentTime }}</small>
                </span>
            </a>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentTime: "13:30"
        };
    },
    created() {
        setInterval(this.getNow, 1000);
    },
    methods: {
        getNow: function () {
            const today = new Date();
            //const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
            const time = today.getHours() + ":" + minutes + ":" + today.getSeconds();
            const dateTime = time;
            this.currentTime = dateTime;
        }
    },
}
</script>