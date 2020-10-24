<template>
  <Tabbar>
    <TabbarItem path="/admTask" activeColor="#1880D0">
      <img slot="item-icon" src="~assets/img/tab/3huigu1.png">
      <img slot="item-icon-active" src="~assets/img/tab/3huigu2.png">
      <div slot="item-text">任务</div>
    </TabbarItem>
    <TabbarItem path="/admStatistic" activeColor="#1880D0">
      <img slot="item-icon" src="~assets/img/tab/3other1.png">
      <img slot="item-icon-active" src="~assets/img/tab/3other2.png">
      <div slot="item-text">统计</div>
    </TabbarItem>
    <TabbarItem path="/admProfile" activeColor="#1880D0">
      <img slot="item-icon" src="~assets/img/tab/icon_signal.png">
      <img slot="item-icon-active" src="~assets/img/tab/icon_people_fill2.png">
      <div slot="item-text">我的</div>
    </TabbarItem>
  </Tabbar>
</template>

<script>
  import Tabbar from "../common/tabbar/Tabbar";
  import TabbarItem from "../common/tabbar/TabbarItem";
  export default {
    name: "AdmMainTabBar",
    components: {
      Tabbar,
      TabbarItem
    }
  }
</script>

<style scoped>

</style>
