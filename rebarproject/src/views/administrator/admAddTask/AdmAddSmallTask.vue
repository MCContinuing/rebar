<template>
  <div id="admAddTask">
    <AdmAddNavBar></AdmAddNavBar>

    <Scroll class="content"
            ref="scroll"
            :probe-type="3">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value0" :options="option" />
      </van-dropdown-menu>
      <van-cell title="任务编号" :value="id"  :label="value0"/>
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
            name="barName"
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
            <button class="but-kind" @click.stop="reduce(index)" v-show="smallTasks[index].barTaskInfos.length" v-bind:disabled="smallTasks[index].barTaskInfos.length<=1 ">
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

      <div class="buts" v-show="showFirst">
        <div class="but-inleft">
          <van-button round type="info" @click.stop="add_task"
                      color="#636FA4">继续添加 </van-button>
        </div>
        <div class="but-inright">
          <van-button round type="info" @click.stop="onSubmit"
                      color="#636FA4">提交任务</van-button>
        </div>
      </div>
      <div class="buts" v-show="!showFirst">
        <div class="but-inleft">
          <van-button round type="info" @click.stop="add_task"
                      color="#636FA4">继续添加</van-button>
        </div>
        <div class="but-inright">
          <van-button round type="info" @click.stop="reduce_task"
                      color="#636FA4">删除任务</van-button>
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


      <!--      </van-form>-->

    </Scroll>

    <van-calendar v-model="showCalendar" @confirm="onConfirm" />

    <van-popup v-model="showPicker" position="bottom">
<!--选择员工-->
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
  import Scroll from "../../../components/common/scroll/Scroll";
  import {ADD_ADM_TASK} from "../../../store/mutations-types";
  import {createSmallTask} from "network/adm";
  import {delCom, findKey, getBarName, getTime} from "../../../common/utils";
  import {Toast} from 'vant';

  export default {
    name: "AdmAddSmallTask",
    components: {
      AdmAddNavBar,
      Scroll
    },
    computed:{

      columns: function () {
        return Object.values(this.$store.state.emps)
      },

      kindallNum: function () {
        let kindallNum = 0;
        for(let i = 0 ; i<this.smallTasks.length;i++){
          for(let j = 0; j < this.smallTasks[i].barTaskInfos.length;j++){
            kindallNum += this.smallTasks[i].barTaskInfos[j].barNum;
          }
        }
        return kindallNum;
      },

      option: function () {
        for(let i = 0; i < this.$store.state.newAdmList.length;i++){
          this.options.push({
            value:this.$store.state.newAdmList[i].taskID,
            text:this.$store.state.newAdmList[i].id,
          })
        }

        return this.options
      },
      // 当前任务的钢筋类型
      columnsBar: function(){
        let barkindsarray = [];
        let bar = this.$store.state.newAdmList.filter(item => item.taskID===this.value0)
        if(bar.length>=1){
          this.bigTaskId = bar[0].taskID
          this.id = bar[0].id;
          this.smallTasks[0].bigTaskId = this.bigTaskId;
          this.barInfos = bar[0].barInfos;
          bar=bar[0].barInfos;
          for(let i = 0 ; i<bar.length ;i++){
            let barId = bar[i].barId;
            let barName = getBarName(this.$store.state.allBarInfo,barId)
            barkindsarray.push(barName);
          }
        }
        barkindsarray=delCom(barkindsarray);
        // console.log('bar');
        // console.log(barkindsarray);
        return barkindsarray;
      },




    },

    data() {
      return {
        allBarInfo:this.$store.state.allBarInfo,
        barInfos:[],
        time:new Date(),
        id:null,
        barIndex1:null,
        barIndex2:null,//判断钢筋类型选择
        value0:0,

        options:[{
          text: '选择任务', value: 0
        }],
        empNmaeIndex:null,//判断是第几个小任务的员工
        count:1,
        value:null,
        showFirst:true,
        showCalendar: false,
        showPicker: false,
        showPickerBar:false,
        istrue:true,
        isfalse:false,
        stepper: 2,
        createdTimeindex:null,

        newMassage: {
          taskID:null,//大任务编号
          id:null,
          taskIDList:[
          ]
        },
        kindall:[],
        // taskMassage:{
        //   taskID:'',
        //   taskIDList:[
        //     {
        //       taskIID:'',
        //       bigTaskId:'',
        //       taskCar:null,
        //       createdTime:null,
        //       kindall:[],
        //       state:'未检测',
        //       supplier:'',
        //       empName:'',
        //     },
        //   ]
        // },
        smallTasks: [
        ],

      };
    },
    created() {
      this.time = getTime(this.time);
      this.smallTasks.push({
        barTaskInfos:[{
          barId:0,
          barName:null,
          barNum:0,
          id:null,
          imageInfoList:[],
          taskId:null,
          testNum:null,
          testStatus:0
        }
        ],
        bigTaskId:null,
        carNumber:null,
        createdTime:this.time,
        endTime:null,
        empName:null,
        empPhone:null,
        employeeId:null,
        id:null,
        status:0,
        taskId:null,
      });
    },
    methods: {
      /**
       * 数据请求相关操作
       */
      onSubmit() {
        let i = 0;
        // this.$store.commit(ADD_ADM_TASK,this.taskMassage)
        console.log(this.smallTasks);
        for(let smallTask of this.smallTasks){
          if(smallTask.bigTaskId===null){
            Toast.fail("请选择分配任务");
            return
          }
          if(smallTask.endTime===null){
            Toast.fail("请选择检测截止时间");
            return
          }
          if(smallTask.carNumber===null){
            Toast.fail("请输入车辆编号");
            return
          }

          if(smallTask.employeeId===null){
            Toast.fail("请分配质检员");
            return
          }
          for(let j = 0 ; j<smallTask.barTaskInfos.length;j++){
            if(smallTask.barTaskInfos[j].barId===0){
              console.log(smallTask);
              console.log(smallTask.barTaskInfos[j].barId);
              Toast.fail("请分配正确的钢筋类型");
              return
            }
          }
        }
        for(let smallTask of this.smallTasks){
          i++;
          createSmallTask(smallTask).then(res=>{
            console.log(res);
            this.addNewMassage(res);

          }).catch(err=>{
            Toast.fail('创建失败');
            console.log(err);
          })
          if(i===this.smallTasks.length){
            Toast.success('创建成功');
            this.$router.replace('/admTask');
          }
        }
      },

      /**
       * 向store中添加新小任务
       *
       */
      addNewMassage(res){
          this.newMassage.taskID = res.bigTaskId;
          this.newMassage.id = this.id;
            let num = 0;
            //循环钢筋种类
            for(let k = 0 ;k<res.barTaskInfos.length;k++){
              this.kindall.push({
                kindname:res.barTaskInfos[k].barName,
                kindnum:res.barTaskInfos[k].barNum,
                tastnum:null,
              })
              num +=res.barTaskInfos[k].barNum;
            }
            let endTime = this.timeStamp(res.endTime);
            this.newMassage.taskIDList.push({
              barInfos: this.barInfos,
              iid: res.id,
              taskIID:res.taskId,
              taskDay: endTime,
              taskCar: res.carNumber,
              bigTaskId:res.bigTaskId,
              createdTime:res.createdTime,
              empName: res.empName,
              num:num,
              kindall: this.kindall,
              state: '未检测',
              supplier: '',
            })
            this.kindall = [];
        console.log(this.newMassage);
        this.$store.commit(ADD_ADM_TASK,this.newMassage);
        this.newMassage={id:null,taskID:null,taskIDList:[]};
        this.$store.commit(ADD_ADM_TASK, this.newMassage);
      },
      /**
       * 按钮点击相关操作
       *
       */
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
        this.smallTasks[this.barIndex1].barTaskInfos[this.barIndex2].barId = this.allBarInfo[barIndex].id;
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
            taskId:null,
            testNum:null,
            testStatus:0
          }
          ],
          bigTaskId:this.bigTaskId,
          carNumber:null,
          createdTime:this.time,
          endTime:null,
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
      },
      /**
       * 数据操控处理方法
       * @param m
       * @returns {string}
       */
      add0(m){
        let mStr = m.toString();
        return m<10 ?  `0${mStr}` : mStr;
      },

      timeStamp(stamp) {
        let toTime = new Date(+stamp);//+号可以把string转换为number
        let year = this.add0((toTime.getFullYear()));
        let day = this.add0(toTime.getDate());
        let month = this.add0(toTime.getDay());
        return `${year}-${month}-${day}`;
      },
    },
  }
</script>

<style scoped>
  #admAddTask{
    background-color: #f0f0f0;
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
