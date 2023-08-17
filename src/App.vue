<template>
  <PhoneApp />
</template>

<script>
import '@/assets/css/font-awesome/css/font-awesome.css'
import PhoneApp from './components/PhoneApp.vue';

export default {
  name: 'App',
  components: {
    PhoneApp
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
