<template>
  <div id="app">
<!--    <keep-alive :include="keepAliveData">-->
      <router-view ></router-view>
<!--    </keep-alive>-->

  </div>
</template>

<script>
  //导入组件

  import Login from "./views/Login";
  import MainTabBar from "./components/content/MainTabBar";
  export default {
    name: 'App',
    components: {MainTabBar, Login},

  }
</script>

<style>
  @import "assets/css/base.css";
</style>
