<template>
  <div id="page-wrap">
    <div class="layout-container">
      <TopBar />
      <PhoneDialPad />
    </div>
  </div>
</template>
  
<script>
import '@/assets/css/MobileUI.css'
import TopBar from "./TopBar.vue"
import PhoneDialPad from "./PhoneDialPad.vue"

export default {
  components: {
    TopBar,
    PhoneDialPad
},
};
</script>
  