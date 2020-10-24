<!--封装弹框-->
<template>
  <div class="toast" v-show="isShow">
    <div >{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props:{

    },
    data(){
      return{
        message: '',
        isShow: false,
      }
    },
    methods:{
      show(message, duration=2000){
        this.isShow = true;
        this.message = message
        setTimeout(()=>{
          this.isShow = false;
          this.message =''
        },duration)

      }
    }
  }
</script>

<style scoped>
 .toast{
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%,-50%);
   background-color: rgba(0,0,0,0.75);
   padding: 10px 12px;
   color: #eee;
   border-radius: 10px;
   z-index: 9999;
 }
</style>
