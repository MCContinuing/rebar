<template>
  <div id="admEditTask">
    <AdmEditNavBar></AdmEditNavBar>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3">
      <van-cell title="任务编号" :value="id"  :label="taskDetail[0].bigTaskId"/>
      <van-cell title="分任务编号" :value="iid"  :label="taskDetail[0].taskIID"/>
      <van-cell title="供货商" :value="taskDetail[0].supplier" />
      <van-cell title="车辆编号" center is-link :value="taskDetail[0].taskCar" @click="showTaskCar = true"/>
      <van-cell title="检测日期" center is-link :value="taskDetail[0].taskDay" @click="showCalendar = true"> </van-cell>
      <van-cell title="检测员" center is-link :value="taskDetail[0].empName"  @click="showPicker = true"></van-cell>

      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        钢筋信息
      </van-divider>

      <template v-for="(item,index) in taskDetail[0].kindall">
<!--        <van-cell title="钢筋类型" center is-link :value="item.kindname"  @click="showPickerBar = true,barIndex = index"></van-cell>-->


        <van-swipe-cell :before-close="beforeClose">
          <van-cell :border="false" :title="item.kindname" center is-link :value="item.kindnum" @click="showKindNum=true,barindex=index"/>
          <template #right>
            <van-button square type="danger" text="删除" class="delete-button" @click="barId=item.barId,barindex=index"/>
          </template>
        </van-swipe-cell>


      </template>
      <div class="big-butkind-box">
        <div class="butkind-box">
<!--          <van-button type="info" round  size="small" style="float: left" v-if="!showDel" @click="showDel = true">-->
<!--            <i class="fa fa-trash-o" aria-hidden="true"></i>-->
<!--            删除-->
<!--          </van-button>-->
<!--          <van-button type="info" round  size="small" style="float: left" v-else @click="showDel = false">-->
<!--            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>-->
<!--            完成-->
<!--          </van-button>-->
          <van-button plain type="info"  round  color="#266Eff" style="background-color: #f0f8ff" @click="showPickerBar = true">
            <i class="fa fa-line-chart" aria-hidden="true"></i>
            添加类型
          </van-button>


<!--          <button clas s="but-kind" @click.stop="reduce"  v-bind:disabled="taskDetail[0].kindall.length<=1 ">-->
<!--            <i class="fa fa-minus-circle fa-kindclor" aria-hidden="true"></i>-->
<!--          </button>-->
<!--          &emsp;-->
<!--          钢筋类型-->
<!--          &emsp;-->
<!--          <button class="but-kind" @click.stop="add">-->
<!--            <i class="fa fa-plus-circle fa-kindclor" aria-hidden="true"></i>-->
<!--          </button>-->
        </div>
      </div>
      <div class="sunmit">
        <div class="gotask-text">
          <i class="fa fa-bar-chart" aria-hidden="true"></i>
          &emsp;
          <b>本次共分配钢筋检测数量：{{kindallNum}}</b>
          <div class="submit-fa">
            <i class="fa fa-truck fa-5x fa-truck-class" aria-hidden="true" ></i>
          </div>

<!--          <div style="margin: 16px;" >-->
<!--            <button class="up-button" @click="onSubmit" >提交任务</button>-->
<!--          </div>-->
        </div>
      </div>

    </Scroll>


<!--    选择检测时间-->
    <van-calendar v-model="showCalendar" @confirm="onConfirm" />
    <!--      选择员工-->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirmP"
        @cancel="showPicker = false"
      />
    </van-popup>
    <!--    选择钢筋类别-->
    <van-popup v-model="showPickerBar" position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsBar"
        @confirm="onConfirmBar"
        @cancel="showPickerBar = false"
      />
    </van-popup>
<!--    修改车辆编号-->
    <van-dialog v-model="showTaskCar" title="修改"
                show-cancel-button
                @confirm="editTaskCar">
      <van-field v-model="taskDetail[0].taskCar" label="车辆编号: " label-width="148px" label-align="right" />
    </van-dialog>

<!--        修改钢筋数量-->
    <template v-if="taskDetail[0].kindall.length !== 0">
      <van-dialog v-model="showKindNum" title="修改钢筋数量"
                  show-cancel-button
                  @confirm="editKindNum">
        <van-field name="stepper"  label-width="0px" input-align="center"  >
          <template #input>
            <van-stepper v-model="taskDetail[0].kindall[barindex].kindnum" min="0" />
          </template>
        </van-field>
      </van-dialog>
    </template>


  </div>

</template>

<script>
  import Scroll from "../../../components/common/scroll/Scroll";
  import AdmEditNavBar from "./AdmEditNavBar";

  import {
    updateSmallTask, updateSmallTaskBarInfo, deleteSmallTB,} from "../../../network/adm";

  import {Dialog} from 'vant'
  import {findKey, findValue} from "../../../common/utils";

  export default {
    name: "AdmEditTask",
    components: {
      [Dialog.Component.name]: Dialog.Component,
      AdmEditNavBar,
      Scroll
    },
    data() {
      return {
        kindnum:0,//存储点击的钢筋的kindnum
        barindex:0,//存储点击的钢筋index
        barId:null,//存储点击删除时的barId,
        showKindNum:false,//修改钢筋数量
        showDel:false,//显示删除钢筋
        showTaskCar:false,//修改车辆编号
        istrue:true,
        isfalse:false,
        stepper: 2,
        showCalendar: false,
        showPicker: false,
        showPickerBar:false,
        barIndex:null,
        iid: null,
        id:null,
        taskDetail:[],
      };
    },
    computed:{
      //创建员工列表
      columns: function () {
        return Object.values(this.$store.state.emps)
      },
      //创建此大任务下的钢筋类型
      columnsBar: function(){
        let barkindsarray = [];
        for(let i = 0; i<this.taskDetail[0].barInfos.length ;i++){
          let barId = this.taskDetail[0].barInfos[i].barId
          let index = this.$store.state.allBarInfo.findIndex(item => item.id === barId)
          let barName = this.$store.state.allBarInfo[index].barName;
          barkindsarray.push(barName)
        }
        console.log(barkindsarray);
        return barkindsarray;
      },
      //所有钢筋数量
      kindallNum: function () {
        let num = 0;
        let bar = this.taskDetail[0].kindall
        for(let i = 0 ; i < bar.length ; i++){
          num += parseInt(bar[i].kindnum)
        }
        return num;
      },
      //提交的小任务
      smallTask:function () {
        let smallTask = {
          bigTaskId:this.taskDetail[0].bigTaskId,
          carNumber:this.taskDetail[0].taskCar,
          createdTime:this.taskDetail[0].createdTime,
          endTime:this.taskDetail[0].taskDay,
          empName:this.taskDetail[0].empName,
          // empPhone:this.taskDetail[0].empPhone,
          // employeeId:this.taskDetail[0].employeeId,
          status:0,
          taskId:this.taskDetail[0].taskIID,
        }
        return smallTask;
      },

    },

    methods: {
      /**
       * 数据请求相关
       */

      //修改小任务除钢筋外信息
      updateSmallTask(){
        console.log(this.smallTask);
        updateSmallTask(this.smallTask).then(res=>{
          '修改信息成功'
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      //修改钢筋数量
      updateSmallTaskBarInfo(sTaskId,barId,barNum){
        updateSmallTaskBarInfo(sTaskId,barId,barNum).then(res=>{
          console.log('修改数量成功');
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      //删除钢筋类型
      deleteSmallTB(sTaskId,barId){
        deleteSmallTB(sTaskId,barId).then(res=>{
          console.log('删除成功');
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      //修改车辆信息
      editTaskCar(){
        this.updateSmallTask();
      },
      //修改钢筋数量
      editKindNum(){
        // this.taskDetail[0].kindall[this.barindex].kindnum = this.selectKindnum();
        let sTaskId = this.taskDetail[0].taskIID;
        console.log(this.barindex);
        let barId = this.taskDetail[0].kindall[this.barindex].barId;
        console.log(barId);
        let barNum = this.taskDetail[0].kindall[this.barindex].kindnum;
        console.log(barNum);
        this.updateSmallTaskBarInfo(sTaskId,barId,barNum);
      },
      /**
       * vant调用方法
       * @param values
       */
      onSubmit(values) {
        console.log('submit', values);
        console.log(values)
      },
      onConfirm(date) {
        this.taskDetail[0].taskDay = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        this.updateSmallTask();
        this.showCalendar = false;
      },
      onConfirmP(value) {
        this.taskDetail[0].empName = value;
        this.updateSmallTask()
        this.showPicker = false;
      },
      onConfirmBar(value) {
        let index = this.$store.state.allBarInfo.findIndex(item => item.barName === value)
        let barId = this.$store.state.allBarInfo[index].id;
        this.taskDetail[0].kindall.push({
          barId:barId,
          kindname:value,
          kindnum:0,
          tastnum:null,
        })
        this.showPickerBar = false;
      },

      //滑动单元格删除异步
      // position 为关闭时点击的位置
      // instance 为对应的 SwipeCell 实例
      beforeClose({ position, instance }) {
        switch (position) {
          case 'left':
          case 'cell':
          case 'outside':
            instance.close();
            break;
          case 'right':
            Dialog.confirm({
              message: '确定删除吗？'
            }).then(() => {
              this.deleteSmallTB(this.taskDetail[0].taskIID,this.barId);
              this.taskDetail[0].kindall.splice(this.barindex,1)
              instance.close();
            });
            break;
        }
      },
      /**
       * 自定义按钮点击相关操作
       */



    },

    created(){
      //1.保存传入的任务iid
      this.iid = this.$route.params.iid;
      this.id = this.$route.params.id;
      this.taskDetail = this.$store.state.newAdmList.filter(item => item.id===this.id)
      if(this.taskDetail.length===0){
        this.taskDetail = this.$store.state.newAdmList.filter(item => item.id===parseInt(this.id))
      }

      this.taskDetail = this.taskDetail[0].taskIDList
      this.taskDetail = this.taskDetail.filter(item => item.iid === parseInt(this.iid))
      console.log('this.taskDetail');
      console.log(this.taskDetail);


    },
  }
</script>

<style scoped>
  @import "../../../assets/css/empReset.css";
  @import "../../../assets/css/resetVui.css";

   #admEditTask{
     background-color: #f0f0f0;
   }

  .delete-button {
    height: 100%;
  }
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
  .but-addfirst{
    padding: 6px;
    height: 50px;
    text-align: center;
  }
  .pos{
    height: 40px;
    padding-top: 10px;
  }

  .pos p{
    font-size: 16px;
    line-height: 30px;
    padding-left: 20px;
    font-weight: bold;
  }
  .buts{
    padding: 20px 36px 0px 36px;
    margin: 0 auto;
    height: 60px;
  }

  .but-inleft{
    float: left;
  }
  .but-inright{
    float: right;
  }
  .big-butkind-box{
    background-color: #fff;

  }
  .but-kind{
    background: #fff;
    border-width: 0px;
  }
  .fa-kindclor{
    color: #1880D0;
  }
  .butkind-box{
    background-color: #fff;
    margin: 0 auto;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 200px;
    border-top: 1px solid rgba(0,0,0,0.1);
  }


  .up-button { /* 按钮美化 */
    width: 270px; /* 宽度 */
    height: 40px; /* 高度 */
    border-width: 0px; /* 边框宽度 */
    border-radius: 3px; /* 边框半径 */
    background: #266eff; /* 背景颜色 */
    cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
    outline: none; /* 不显示轮廓线 */
    font-family: Microsoft YaHei; /* 设置字体 */
    color: white; /* 字体颜色 */
    font-size: 17px; /* 字体大小 */
    left:50%;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  /*.up-button:hover { !* 鼠标移入按钮范围时改变颜色 *!*/
  /*  background: #636FA4;*/
  /*}*/
  .sunmit{
    padding-bottom: 20px;
  }
  .gotask-text{
    margin: 20px 8px 20px 8px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow:  0px 2px 2px 3px rgba(0,0,0,0.02);
  }
  .gotask-text p{
    margin-bottom: 20px;
    margin-left: 20px;
    color: #4c4c4c;
  }
  .submit-fa{
    width: 100%;
    text-align: center;
  }
  .fa-truck-class{
    background:linear-gradient(to right, #2c3e50, #636FA4);
    -webkit-background-clip: text;
    color:transparent;
  }

</style>
