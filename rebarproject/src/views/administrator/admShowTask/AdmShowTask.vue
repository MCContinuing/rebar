<template>
  <div id="admShowTask">
    <AdmShowNavBar></AdmShowNavBar>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3">
    <van-cell-group>
      <van-cell title="大任务编号" :value="taskDetail[0].bigTaskId" />
      <van-cell title="供货商" :value="taskDetail[0].supplier" />
      <van-cell title="分任务编号" :value="taskDetail[0].taskIID" />
      <van-cell title="检测员" :value="taskDetail[0].empName" />
      <van-cell title="车辆编号" :value="taskDetail[0].taskCar" />
      <van-cell title="检测时间" :value="taskDetail[0].endTime" />
      <van-cell title="钢筋总数" :value="kindallNum" />
    </van-cell-group>
    <template v-for="(item,index) in taskDetail[0].kindall">
      <van-cell title="钢筋类型" :value="item.kindname" />
      <van-cell title="钢筋类型" :value="item.kindnum" />
    </template>
    </Scroll>
  </div>
</template>

<script>
    import Scroll from "../../../components/common/scroll/Scroll";
    import AdmShowNavBar from "./AdmShowNavBar";
    export default {
      name: "AdmShowTask",
      components: {AdmShowNavBar,Scroll},
      data() {
        return {
          istrue:true,
          isfalse:false,
          stepper: 2,
          showCalendar: false,
          showPicker: false,
          iid: null,
          id:null,
          taskDetail:[],
        };
      },
      computed:{
        kindallNum: function () {
          let kindallNum = 0;
          for(let i = 0 ; i<this.taskDetail[0].kindall.length;i++){
            kindallNum += this.taskDetail[0].kindall[i].kindnum;
          }
          return kindallNum;
        }
      },
      created(){
        //1.保存传入的任务iid
        this.iid = this.$route.params.iid;
        this.id = this.$route.params.id;
        this.taskDetail = this.$store.state.oldAdmList.filter(item => item.id===this.id)
        if(this.taskDetail.length===0){
          this.taskDetail = this.$store.state.oldAdmList.filter(item => item.id===parseInt(this.id))
        }
        this.taskDetail = this.taskDetail[0].taskIDList
        this.taskDetail = this.taskDetail.filter(item => item.iid === parseInt(this.iid))
        console.log('taskShow');
        console.log(this.taskDetail);
        //2.根据iid请求数据
        // getDetail(this.iid).then(res => {
        //   console.log(res);
        // })


      },
    }

</script>

<style scoped>
  .content{
    /*height: 100px;*/
    /*background-color: #d3dbff;*/
    /*overflow: hidden;*/
    overflow: hidden;
    position: absolute;
    top:45px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
