<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Tabbar"
  }
</script>

<style scoped>
  @import "../../../assets/css/base.css";
  #tab-bar{
      display: flex;
      /*垂直布局改为水平布局*/
      background-color: var(--color-tab);
      color: var(--color-tab-color);
      /*顶部改为底部*/
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0px -1px 1px rgba(100,100,100,0.1);
    }

</style>
