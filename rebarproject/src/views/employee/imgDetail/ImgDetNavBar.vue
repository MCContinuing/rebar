<template>
  <NavBar>
    <div slot="left" class="back">
      <img src="~assets/img/common/back.svg" alt="" @click="backClick">
    </div>
    <div slot="center">检测结果</div>
  </NavBar>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import {DEL_IMG_INFO} from "../../../store/mutations-types";
  import{deleteImage} from "../../../network/upimage";

  export default {
    name: "ImgDetNavBar",
    components:{
      NavBar
    },
    methods:{
      backClick(){
        if(this.$store.state.resImageInfo){
          for(let i =0 ; i < this.$store.state.resImageInfo.length;i++) {
            deleteImage(this.$store.state.resImageInfo[i].id).then(res=>{
              this.$store.commit(DEL_IMG_INFO)
            }).catch(err=>{
              console.log(err);
            })
          }
        }
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
