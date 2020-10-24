<template>
    <div class="detail">
      <DetailNavBar></DetailNavBar>

          <DetailBody :task-detail="taskDetail" :id="id"></DetailBody>
        <div style="padding-bottom: 30px"></div>


    </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailBody from "./childComps/DetailBody";
  import Scroll from "../../../components/common/scroll/Scroll";
  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailBody,
      Scroll
    },
    data(){
      return {
        iid: null,
        id:null,
        taskDetail:[],
      }
    },
    created(){
      //1.保存传入的任务iid
      this.iid = this.$route.params.iid;
      this.id = this.$route.params.id;
      this.taskDetail = this.$store.state.newList.filter(item => item.id===this.id || item.id===parseInt(this.id))

      if(this.taskDetail.length!==0){
        this.taskDetail = this.taskDetail[0].taskIDList;
        this.taskDetail = this.taskDetail.filter(item => item.iid === parseInt(this.iid))

      }
      if(this.taskDetail.length===0){
        this.taskDetail = this.$store.state.oldList.filter(item => item.id===this.id || item.id===parseInt(this.id));
        this.taskDetail = this.taskDetail[0].taskIDList
        this.taskDetail = this.taskDetail.filter(item => item.iid === parseInt(this.iid))
      }

      // console.log(this.taskDetail);

      //2.根据iid请求数据
      // getDetail(this.iid).then(res => {
      //   console.log(res);
      // })
    },
  }

</script>

<style scoped>


</style>
