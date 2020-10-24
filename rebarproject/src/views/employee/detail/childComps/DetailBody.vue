<template>
    <div class="detail-body">
      <Scroll class="content"
              ref="scroll"
              :probe-type="3">
      <van-panel title='大任务编号' :desc="taskDetail[0].bigTaskId" :status=taskDetail[0].state>
        <van-cell-group>
          <van-cell title="分任务编号" :label="taskDetail[0].taskIID" :value="taskDetail[0].iid"/>
          <van-cell title="供货商" :value=taskDetail[0].supplier />
          <van-cell title="车辆编号" :value=taskDetail[0].taskCar />
          <van-cell title="检测员" :value=empName />
          <van-cell title="检测截至日期" :value=taskDetail[0].taskDay />
          <van-cell title="钢筋总数" :value=taskDetail[0].num />
          <div  v-for="item in taskDetail[0].kindall">
            <van-cell :title=item.kindname :value=item.kindnum />
            <van-cell title=检测结果 :value="item.tastnum" />
          </div>

        </van-cell-group>
        <div slot="footer" v-show="this.taskDetail[0].state!=='已检测'">
          <van-button  class="button-up" type="info" color="var(--color-button)" block @click="goTask(taskDetail[0].iid,id)">立即检测</van-button>
        </div>
      </van-panel>
      </Scroll>
      <div class="db-button">

      </div>
    </div>

</template>

<script>
  import NavBar from "../../../../components/common/navbar/NavBar";
  export default {
    name: "DetailBody",
    components: {NavBar},
    data(){
      return {
        empName:this.$store.state.profile.empName,
      }
    },
    props:{
      id:{
        type:String,
        default(){
          return ''
        }
      },
      taskDetail: {
        type:Array,
        default(){
          return []
        }
      }
    },
    created() {
      // console.log(this.taskDetail);
    },
    methods:{
      goTask(iid,id){
        // this.$router.push({name:'GoTask',params:{iid:iid,taskID:taskID}})
        this.$router.push('/gotask/'+id+'/'+iid)
      },
    }
  }
</script>

<style scoped>
.detail-body{
  height: 100vh;
}
.detail-body p {
  margin-top: 10px;
  margin-bottom: 14px;
  margin-left: 20px;
  font-size: 16px;
  /*color:var(--color-betailbody-color) ;*/
  color: #4c4c4c;
}
.db-button{
  width: 100px;
  height: 60px;
  margin: 0 auto;
}
  .db-text{
    margin: 20px;
    /*background-color: var(--color-betailbody);*/
    /*background-color: rgba(225,225,225,0.3);*/
    background-color: #fff;
    padding: 10px;
    border-radius: 15px;
    box-shadow:  0px 3px 3px 3px rgba(100,100,100,0.05);

  }
  .kinds-p{
    margin-left: 40px;
    width: 250px;
    height: 70px;
    /*background-color:var(--color-betailbody-kind);*/
    /*background-color: #fff;*/

  }
  .button-up{

  }

</style>
