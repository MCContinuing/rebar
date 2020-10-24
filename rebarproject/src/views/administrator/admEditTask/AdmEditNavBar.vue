<template>
  <NavBar>
    <div slot="left" class="back">
      <img src="~assets/img/common/back.svg" alt="" @click="backClick">
    </div>
    <div slot="center">任务详情</div>
  </NavBar>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  export default {
    name: "AdmEditNavBar",
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
