<template>
  <div>
    <keep-alive  exclude="AdmAddTask,AdmAddSmallTask,AdmEditTask,AdmShowTask">
      <router-view  ></router-view>
    </keep-alive>
    <AdmMainTabBar></AdmMainTabBar>
  </div>
</template>

<script>
  import AdmMainTabBar from "components/content/AdmMainTabBar";
  import {ADD_ALL_BAR_INFO} from "../../store/mutations-types";
  import { getAllBarInfo} from "network/login";
  export default {
    name: "AdmLogin",
    components:{
      AdmMainTabBar,
    },
    created() {
        getAllBarInfo().then(res => {
          this.$store.commit(ADD_ALL_BAR_INFO, res);
          console.log('钢筋信息');
          console.log(this.$store.state.allBarInfo);
        })
    }
  }
</script>

<style scoped>

</style>
