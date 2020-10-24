<template>
  <div id="admAddTask">
    <AdmAddNavBar></AdmAddNavBar>
    <Scroll class="content"
                     ref="scroll"
                     :probe-type="3">
<!--大任务输入-->
    <van-field
      v-model="campany"
      name="campany"
      label="供货商"
      left-icon="smile-o"
      placeholder="请填写供货商"
      :rules="[{ required: true, message: '请填写供货商' }]"
    />
<!--大任务钢筋类型与数量输入-->
      <div v-for="(item,index) in barInfos">
        <van-dropdown-menu >
          <van-dropdown-item v-model="item.barId" :options="option1" />
        </van-dropdown-menu>
        <van-field label-align="center" input-align="center"
                   left-icon="music-o"
                   :name=item.barNum.toString() label="钢筋数量" integer>
          <template #input>
            <van-stepper v-model="item.barNum" min="0"	/>
          </template>
        </van-field>
      </div>
<!--大任务操控类型数量按钮-->
      <div class="big-butkind-box">
        <div class="butkind-box">
          <button class="but-kind" @click.stop="reduceBig"  v-bind:disabled="barInfos.length<=1 ">
            <i class="fa fa-minus-circle fa-kindclor" aria-hidden="true"></i>
          </button>
          &emsp;
          钢筋类型
          &emsp;
          <button class="but-kind" @click.stop="addBig" >
            <i class="fa fa-plus-circle fa-kindclor" aria-hidden="true"></i>
          </button>
        </div>
      </div>
<!--添加小任务或提交按钮-->
      <div class="buts" v-show="showFirst">
        <div class="but-inleft">
<!--          <van-button round type="info" @click.stop="add_task"-->
<!--                      color="#636FA4">添加小任务</van-button>-->
          <van-button plain type="info"  round  color="#266Eff" style="background-color: #f0f8ff" @click.stop="add_task">
            <i class="fa fa-line-chart" aria-hidden="true"></i>
            添加小任务
          </van-button>
        </div>
        <div class="but-inright">
<!--          <van-button round type="info" @click.stop="onSubmit"-->
<!--                      color="#636FA4">提交任务</van-button>-->
          <van-button plain type="info"  round  color="#266Eff" style="background-color: #f0f8ff" @click.stop="onSubmit">
            <i class="fa fa-line-chart" aria-hidden="true"></i>
            提交任务
          </van-button>
        </div>
      </div>
<!-- 小任务添加-->
      <div v-for="(item,index) in smallTasks">
        <div class="pos">
           <p>添加小任务{{index+1}}:</p>
        </div>
        <div class="van-hairline--top-bottom"></div>
        <van-field
          readonly
          clickable
          name="createdTime"
          :value="item.endTime"
          label="检测日期"
          left-icon="smile-o"
          placeholder="点击选择日期"
          @click="showCalendar = true, createdTimeindex = index"
        />
        <van-field
          v-model="item.carNumber"
          left-icon="smile-o"
          name="carNumber"
          label="车辆编号"
          placeholder="车辆编号"
          :rules="[{ required: true, message: '请填写车辆编号' }]"
        />
        <van-field
          readonly
          clickable
          name="empName"
          left-icon="smile-o"
          :value="item.empName"
          label="检测员"
          placeholder="点击选择检测员"
          @click="showPicker = true,empNmaeIndex = index"
        />
        <div v-for="(item2,index2) in smallTasks[index].barTaskInfos">
          <van-field
            readonly
            clickable
            :name="item2.barName"
            left-icon="smile-o"
            :value="item2.barName"
            label="钢筋类型"
            placeholder="点击选择钢筋类型"
            @click="showPickerBar = true,barIndex1 = index, barIndex2 = index2"
          />

          <van-field label-align="center" input-align="center"
                     left-icon="music-o"
                     :name=item2.barNum.toString() label="钢筋数量" integer>
            <template #input>
              <van-stepper v-model="item2.barNum" min="0"	/>
            </template>
          </van-field>
        </div>
        <div class="big-butkind-box">
          <div class="butkind-box">
            <button class="but-kind" @click.stop="reduce(index)"  v-bind:disabled="smallTasks[index].barTaskInfos.length<=1 ">
              <i class="fa fa-minus-circle fa-kindclor" aria-hidden="true"></i>
            </button>
            &emsp;
            钢筋类型
            &emsp;
            <button class="but-kind" @click.stop="add(index)" v-show="smallTasks[index].barTaskInfos.length ">
              <i class="fa fa-plus-circle fa-kindclor" aria-hidden="true"></i>
            </button>
          </div>
        </div>

      </div>
        <div class="buts" v-show="!showFirst">
          <div class="but-inleft">
<!--            <van-button round type="info" @click.stop="add_task"-->
<!--                        color="#636FA4">继续添加</van-button>-->
            <van-button plain type="info"  round  color="#266Eff" style="background-color: #f0f8ff" @click.stop="add_task">
              <i class="fa fa-line-chart" aria-hidden="true"></i>
              继续添加
            </van-button>
          </div>
          <div class="but-inright">
<!--            <van-button round type="info" @click.stop="reduce_task"-->
<!--                        color="#636FA4">删除任务</van-button>-->
            <van-button plain type="info"  round  color="#266Eff" style="background-color: #f0f8ff" @click.stop="reduce_task">
              <i class="fa fa-line-chart" aria-hidden="true"></i>
              删除任务
            </van-button>
          </div>
      </div>
      <div class="sunmit" v-show="!showFirst">
        <div class="gotask-text">
          <i class="fa fa-bar-chart" aria-hidden="true"></i>
          &emsp;
          <b>本次共分配钢筋检测数量：{{kindallNum}}</b>
          <div class="submit-fa">
            <i class="fa fa-truck fa-5x fa-truck-class" aria-hidden="true" ></i>
          </div>

          <div style="margin: 16px;" >
            <button class="up-button" @click="onSubmit" >提交任务</button>
          </div>
        </div>
      </div>
  </Scroll>

    <van-calendar v-model="showCalendar" @confirm="onConfirm" />
<!--选择员工-->
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
  </div>
</template>

<script>
  import AdmAddNavBar from "./AdmAddNavBar";
  import {Toast} from "vant";
  import Scroll from "../../../components/common/scroll/Scroll";
  import {ADD_ADM_TASK} from "../../../store/mutations-types";
  import {createBigTask} from "network/adm";
  import {findKey} from "../../../common/utils";

  export default {
    name: "AdmAddTask",
    components: {
      AdmAddNavBar,
      Scroll
    },
    computed:{
      columns: function () {
        return Object.values(this.$store.state.emps)
      },
      //已分配的所有钢筋数量
      kindallNum: function () {
        let kindallNum = 0;
        for(let i = 0 ; i<this.smallTasks.length;i++){
          for(let j = 0; j < this.smallTasks[i].barTaskInfos.length;j++){
            kindallNum += this.smallTasks[i].barTaskInfos[j].barNum;
          }
        }
        return kindallNum;
      },
      columnsBar: function() {
        for (let i = 0; i <  this.barInfos.length;i++) {
          let index = this.allBarInfo.findIndex(item => item.id === this.barInfos[i].barId)
          if(index>=0){
            this.columnsBars.push( this.allBarInfo[index].barName);
          }
        }
        this.columnsBars = this.delCom(this.columnsBars);
        return this.columnsBars;
      },
    },

    data() {
      return {
        newMassage: {
          taskID:null,//大任务编号
          id:null,
          barInfos:[],
          taskIDList:[
          ]
        },
        kindall:[],
        allBarInfo:this.$store.state.allBarInfo,
        option1: [
          { text: '选择钢筋类型', value: 0 },
        ],
        columnsBars:[],
        time:new Date(),
        barIndex1:null,
        barIndex2:null,//判断钢筋类型选择
        empNmaeIndex:null,//判断是第几个小任务的员工
        count:1,
        value: '',
        showFirst:true,
        showCalendar: false,
        showPicker: false,
        showPickerBar:false,
        istrue:true,
        isfalse:false,
        stepper: 2,
        campany:null,
        createdTimeindex:null,
        endTime:null,


        taskMassage:{
          taskID:null,
          taskIDList:[
          {
            taskIID:null,
            bigTaskId:null,
            taskCar:null,
            createdTime:null,
            kindall:[],
            state:'未检测',
            supplier:null,
            empName:null,
          },
        ]
      },
        smallTasks: [
        ],
        barInfos:[{
          barId:0,
          barNum:0,
          id:null,
          taskId:null,
        }],
      };
    },
    created() {
      for(let info of this.allBarInfo){
        this.option1.push({
          text:info.barName,
          value:info.id
        })
      }
      this.getTime();
    },
    methods: {
      add0(m){
        let mStr = m.toString();
        return m<10 ?  `0${mStr}` : mStr;
      },

      timeStamp(stamp) {
        let toTime = new Date(+stamp);//+号可以把string转换为number
        let year = this.add0((toTime.getFullYear()));
        let day = this.add0(toTime.getDate());
        let month = this.add0(toTime.getDay());
        return `${year}/${month}/${day}`;
      },
      //删除相同元素
      delCom(array){
          var n = [array[0]]; //结果数组
          //从第二项开始遍历
          for(var i = 1; i < array.length; i++) {
            //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
            //那么表示第i项是重复的，忽略掉。否则存入结果数组
            if (array.indexOf(array[i]) == i) n.push(array[i]);
          }
          return n;
        },
      //获取时间
      getTime(){
        let date = new Date(this.time);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        this.time = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      },

      onSubmit() {
        let BigTask={
            barInfos:this.barInfos,
            campany:this.campany,
            createdTime:this.time,
            id:null,
            smallTasks:this.smallTasks,
            taskId:null,
        };
        console.log(BigTask);
        if(BigTask.campany===null){
          Toast.fail("请输入供货商名称");
          return
        }
        for(let i =0; i < BigTask.barInfos.length ;i++){
          if(BigTask.barInfos[i].barId===0){
            Toast.fail("请选择正确的钢筋类型");
            return
          }
        }
        for(let i = 0 ; i<BigTask.smallTasks.length;i++){
          if(BigTask.smallTasks[i].endTime===null){
            Toast.fail("请选择检测截止时间");
            return
          }
          if(BigTask.smallTasks[i].carNumber===null){
            Toast.fail("请输入车辆编号");
            return
          }
          if(BigTask.smallTasks[i].employeeId===null){
            Toast.fail("请分配质检员");
            return
          }
          for(let j = 0 ; j<BigTask.smallTasks[i].barTaskInfos.length;j++){
            if(BigTask.smallTasks[i].barTaskInfos[j].barId===0){
              Toast.fail("请分配正确的钢筋类型");
              return
            }
          }
        }

        createBigTask(BigTask).then(res=>{
          if(res) {
            console.log('addBigTask res');
            console.log(res);
            this.newMassage.taskID = res.taskId;
            this.newMassage.id = res.id;
            this.newMassage.barInfos=res.barInfos
            for (let j = 0; j < res.smallTasks.length; j++) {
              let num = 0;
              //循环钢筋种类
              for (let k = 0; k < res.smallTasks[j].barTaskInfos.length; k++) {
                this.kindall.push({
                  barId: res.smallTasks[j].barTaskInfos[k].barId,
                  kindname: res.smallTasks[j].barTaskInfos[k].barName,
                  kindnum: res.smallTasks[j].barTaskInfos[k].barNum,
                  tastnum: res.smallTasks[j].barTaskInfos[k].testNum,
                })
                num += res.smallTasks[j].barTaskInfos[k].barNum;
              }
              let endTime = this.timeStamp(res.smallTasks[j].endTime);
              this.newMassage.taskIDList.push({
                barInfos: res.barInfos,
                iid: res.smallTasks[j].id,
                taskIID: res.smallTasks[j].taskId,
                taskDay: endTime,
                taskCar: res.smallTasks[j].carNumber,
                bigTaskId: res.smallTasks[j].bigTaskId,
                createdTime: res.smallTasks[j].createdTime,
                empName: res.smallTasks[j].empName,
                endTime: res.smallTasks[j].endTime,
                num: num,
                kindall: this.kindall,
                state: '未检测',
                supplier: res.campany,
              })
              this.kindall = [];

            }
            console.log('this.newMassage');
            console.log(this.newMassage);
            this.$store.commit(ADD_ADM_TASK, this.newMassage);
            this.newMassage = {taskID: null, taskIDList: []};
            this.$router.replace('/admTask')
            Toast.success('添加成功')
          }
        }).catch(err=>{
          Toast.fail('提交失败');
          console.log(err);
        })
      },
      onConfirm(date) {
        this.smallTasks[this.createdTimeindex].endTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        this.showCalendar = false;
      },
      onConfirmP(value) {
        this.smallTasks[this.empNmaeIndex].empName = value;
        this.showPicker = false;
        this.smallTasks[this.empNmaeIndex].employeeId = findKey(this.$store.state.emps,value);
      },
      onConfirmBar(value) {
        this.smallTasks[this.barIndex1].barTaskInfos[this.barIndex2].barName = value;
        this.showPickerBar = false;
        let barIndex = this.allBarInfo.findIndex(item => item.barName === value);
        console.log(value);
        console.log('barid');
        console.log(barIndex);
        this.smallTasks[this.barIndex1].barTaskInfos[this.barIndex2].barId = this.allBarInfo[barIndex].id;
        // this.getselBarId(this.barIndex)
      },
      //获取选择的钢筋id
      // getselBarId(index){
      //   this. = this.$store.state.allBarInfo[index].id;
      // },
      //添加大任务钢筋类型
      addBig(){
        this.barInfos.push({
          barId:0,
          barNum:0,
          id:null,
          taskId:null,
        })
      },
      reduceBig(){
        this.barInfos.pop();
      },
      //添加钢筋类型
      add(index){
        this.smallTasks[index].barTaskInfos.push({
          barId:0,
          barName:null,
          barNum:0,
          testNum:null,
          id:null,
          imageInfoList:null,
          taskId:null,
          testStatus:0,
        })
        // this.kindallNum += this.smallTasks[index].barInfos.
      },
      reduce(index){
        this.smallTasks[index].barTaskInfos.pop();
      },
      //添加任务
      add_task(){
        this.smallTasks.push({
          barTaskInfos:[{
            barId:0,
            barName:null,
            barNum:0,
            id:null,
            imageInfoList:[],
            taskId:"",
            testNum:null,
            testStatus:0
          }
          ],
          bigTaskId:null,
          carNumber:null,
          createdTime:this.time,
          endTime:this.endTime,
          empName:null,
          empPhone:null,
          employeeId:null,
          id:null,
          status:0,
          taskId:null,
        });
        this.showFirst = false;
      },
      reduce_task(){
        this.smallTasks.pop();
        if(this.smallTasks.length===0){
          this.showFirst = true;
        }
      }
    },
  }
</script>

<style scoped>
  #admAddTask{
    background-color: #fbfbfb;
    height: 1000px;
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
