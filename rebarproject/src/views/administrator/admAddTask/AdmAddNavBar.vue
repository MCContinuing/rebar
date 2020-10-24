<template>
  <NavBar>
    <div slot="left" class="back">
      <img src="~assets/img/common/back.svg" alt="" @click="backClick">
    </div>
    <div slot="center">添加任务</div>
  </NavBar>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  export default {
    name: "AdmAddNavBar",
    components:{
      NavBar
    },
    methods:{
      backClick(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .back img{
    width: 26px;
    height: 26px;
    margin-top: 11px;
  }
</style>
