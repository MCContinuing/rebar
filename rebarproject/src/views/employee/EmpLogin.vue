<template>
  <!--    keepalive使得路由切换时不销毁(除了组件Detail)-->
  <!--  <keep-alive exclude="Detail">-->
  <div>
    <keep-alive exclude="Detail,GoTask,ImgDetail">
      <router-view></router-view>
    </keep-alive>
    <MainTabBar></MainTabBar>
  </div>

</template>

<script>
  import MainTabBar from "components/content/MainTabBar.vue";
  import {ADD_ALL_BAR_INFO} from "../../store/mutations-types";
  import { getAllBarInfo} from "network/login";
  export default {
    name: "EmpLogin",
    components:{
      MainTabBar
    },
    created() {
      getAllBarInfo().then(res => {
        this.$store.commit(ADD_ALL_BAR_INFO, res);
        console.log('钢筋信息');
        console.log(this.$store.state.allBarInfo);
      })
    },
  }
</script>

<style scoped>

</style>
