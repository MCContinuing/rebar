<template>
  <div id="admtask">
    <NavBar class="task-nav"><div slot="center">任务中心</div></NavBar>
    <TabControl :titles="['未检测','已检测']" @tabClick="tabClick"></TabControl>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore"
            @scroll="contentScroll">

      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <AdmTaskList :tasks="showTasks" ></AdmTaskList>
      </van-pull-refresh>

      <van-divider v-show="gotBottom" :style="{ padding: '0px 16px 50px 16px' }">已经到底啦</van-divider>
    </Scroll>

    <!--    组件不能直接监听点击，需要加上native-->
    <BackTop @click.native="backClick"  v-show="isTabFixed"></BackTop>
    <div class="addtask" v-show="isShowAdd">
    <img src="~assets/img/common/add.png" alt="" @click="addClick">
  </div>
    <!--添加按钮弹出层-->
    <van-popup v-model="showPop" class="popup">
      <div class="pop-box" @click="addBigTask">
        <p class="pop-fa left">
          <i class="fa fa-cubes fa-2x fa-cubes-pos " aria-hidden="true"></i>
        </p>
        <div  class="pop-info right">
          <p>添加大任务</p>
        </div>
      </div>
      <div class="pop-box" @click="addSmallTask">
        <p class="pop-fa left">
          <i class="fa fa-cube fa-2x fa-cubes-pos " aria-hidden="true"></i>
        </p>
        <div  class="pop-info right">
          <p>添加小任务</p>
        </div>
      </div>
<!--      <div class="popup-box" @click="addSmallTask">-->
<!--        <i class="fa fa-cube fa-5x fa-cubes-pos" aria-hidden="true"></i>-->
<!--        <p class="popup-p">添加小任务</p>-->
<!--      </div>-->

    </van-popup>
  </div>
</template>

<script>
  import NavBar from "../../../components/common/navbar/NavBar";
  import TabControl from "../../../components/content/tabControl/TabControl";
  import AdmTaskList from "../../../components/content/admTaskShow/AdmTaskList";
  import Scroll from "../../../components/common/scroll/Scroll";
  import BackTop from "../../../components/content/backTop/BackTop";
  import {Toast} from "vant";
  import { getBigTask,getAllEmp,getOldBigTask} from "network/adm";
  import {
    ADD_ADM_TASK,
    ADD_OLD_ADM_TASK,
    ADDTAST,
    DEL_ALL_ADM_BIGTASK,
    LOAD_EMPS
  } from "../../../store/mutations-types";

  export default {
    name: "AdmTask",
    components:{
      NavBar,
      TabControl,
      AdmTaskList,
      Scroll,
      BackTop,
      // getTaskList,
    },
    data(){
      return {
        gotBottom:false,
        // tasks: {
        //   'new': this.$store.state.newList,
        //   'old':this.$store.state.oldList,
        // },
        number:0,
        showPop:false,
        tasks: {
          'new': {page: 0, list: this.$store.state.newAdmList},
          'old': {page: 0, list: this.$store.state.oldAdmList},
        },
        newMassage: {
          taskID:null,//大任务编号
          id:null,
          barInfos:[],
          taskIDList:[
          ]
        },
        kindall:[],
        //默认当前类型为新任务
        currentType:'new',
        isShowBackTop: false,//判断BackTop是否显示
        tabOffsetTop: 0,
        isTabFixed: false,//决定tabControl是否吸顶
        saveY: 0,//记录路由切换时的页面状态，下次回来保持原来状态
        isLoading: false,//下拉刷新
        isShowAdd: true
      }
    },
    computed: {
      showTasks() {
        return this.tasks[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      // this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      //请求多个任务
      this.getNewBigTask(0);
      this.getOldBigTask(1);
      this.getAllEmp();
    },
    methods:{
      /**
       * 网络请求相关方法
       */
      getNewBigTask(status) {
        const page = this.tasks['new'].page + 1
        getBigTask(page,status).then(res => {
          if(res.length === 0){
            this.gotBottom = true;
          }
          else{
            for(let i = 0; i < res.length; i++) {
              this.newMassage.taskID = res[i].taskId;
              this.newMassage.id = res[i].id;
              this.newMassage.barInfos=res[i].barInfos
              //循环小任务
              for(let j = 0 ; j<res[i].smallTasks.length;j++){
                let num = 0;
                //循环钢筋种类
                for(let k = 0 ;k<res[i].smallTasks[j].barTaskInfos.length;k++){
                  this.kindall.push({
                    barId:res[i].smallTasks[j].barTaskInfos[k].barId,
                    kindname:res[i].smallTasks[j].barTaskInfos[k].barName,
                    kindnum:res[i].smallTasks[j].barTaskInfos[k].barNum,
                    tastnum:res[i].smallTasks[j].barTaskInfos[k].testNum,
                    teststatus:res[i].smallTasks[j].barTaskInfos[k].testStatus,
                  })
                  num +=res[i].smallTasks[j].barTaskInfos[k].barNum;
                }
                let endTime = this.timeStamp(res[i].smallTasks[j].endTime);
                this.newMassage.taskIDList.push({
                  barInfos:res[i].barInfos,
                  iid: res[i].smallTasks[j].id,
                  taskIID:res[i].smallTasks[j].taskId,
                  taskDay: endTime,
                  taskCar: res[i].smallTasks[j].carNumber,
                  bigTaskId:res[i].smallTasks[j].bigTaskId,
                  createdTime:res[i].smallTasks[j].createdTime,
                  empName: res[i].smallTasks[j].empName,
                  endTime:res[i].smallTasks[j].endTime,
                  num:num,
                  kindall: this.kindall,
                  state: '未检测',
                  supplier: res[i].campany,
                })
                this.kindall = [];
              }
              this.$store.commit(ADD_ADM_TASK,this.newMassage)
              this.newMassage={taskID:null,taskIDList:[]}
            }
            this.tasks['new'].page += 1
          }
          // this.tasks['new'].list.push(...res.list)
          // this.tasks['new'].page += 1
          // this.$refs.scroll.finishPullUp()
          this.$refs.scroll.finishPullUp()
          console.log('bigtask res');
          console.log(this.$store.state.newAdmList);
        })
      },

      getOldBigTask(status) {
        getOldBigTask(status).then(res => {
          if(res.length === 0){
            this.gotBottom = true;
          }
          else{
            for(let i = 0; i < res.length; i++) {
              this.newMassage.taskID = res[i].taskId;
              this.newMassage.id = res[i].id;
              this.newMassage.barInfos=res[i].barInfos
              //循环小任务
              for(let j = 0 ; j<res[i].smallTasks.length;j++){
                let num = 0;
                //循环钢筋种类
                for(let k = 0 ;k<res[i].smallTasks[j].barTaskInfos.length;k++){
                  this.kindall.push({
                    barId:res[i].smallTasks[j].barTaskInfos[k].barId,
                    kindname:res[i].smallTasks[j].barTaskInfos[k].barName,
                    kindnum:res[i].smallTasks[j].barTaskInfos[k].barNum,
                    tastnum:res[i].smallTasks[j].barTaskInfos[k].testNum,
                    teststatus:res[i].smallTasks[j].barTaskInfos[k].testStatus,
                  })
                  num +=res[i].smallTasks[j].barTaskInfos[k].barNum;
                }
                let endTime = this.timeStamp(res[i].smallTasks[j].endTime);
                this.newMassage.taskIDList.push({
                  barInfos:res[i].barInfos,
                  iid: res[i].smallTasks[j].id,
                  taskIID:res[i].smallTasks[j].taskId,
                  taskDay: endTime,
                  taskCar: res[i].smallTasks[j].carNumber,
                  bigTaskId:res[i].smallTasks[j].bigTaskId,
                  createdTime:res[i].smallTasks[j].createdTime,
                  empName: res[i].smallTasks[j].empName,
                  endTime:res[i].smallTasks[j].endTime,
                  num:num,
                  kindall: this.kindall,
                  state: '已检测',
                  supplier: res[i].campany,
                })
                this.kindall = [];
              }
              this.$store.commit(ADD_OLD_ADM_TASK,this.newMassage)
              this.newMassage={taskID:null,taskIDList:[]}
            }
          }
          // this.tasks['new'].list.push(...res.list)
          // this.tasks['new'].page += 1
          // this.$refs.scroll.finishPullUp()
          this.$refs.scroll.finishPullUp()
          console.log('bigOldtask res');
          console.log(this.$store.state.oldAdmList);
        })
      },

      getAllEmp(){
        getAllEmp().then(res=>{
          this.$store.commit(LOAD_EMPS,res)
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },

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


      /**
       * 事件监听相关方法
       */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'new'
            this.isShowAdd = true
            break
          case 1:
            this.currentType = 'old'
            this.isShowAdd = false
            break
        }
      },
      //点击即上吸到顶部
      backClick() {
        this.$refs.scroll.scrollTo(0, 0,500)
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //上拉加载
      loadMore() {
        if(this.currentType === 'new'){
          this.getNewBigTask(0);
          this.gotBottom = true;
        }
        else {
          this.getOldBigTask(1)
        }

      },
      //下拉刷新
      onRefresh() {


          setTimeout(() => {
            Toast('刷新成功');
            this.isLoading = false;
          }, 1000);
      },
      addClick(){
        this.showPop = true;
      },
      addBigTask(){
        this.showPop = false;
        this.$router.push('/admAddTask')

      },
      addSmallTask(){
        this.showPop = false;
        this.$router.push('/admAddSmallTask')
      },
    }
  }
</script>

<style scoped>

  #admtask{
    padding-top:  44px;
    /*视口高度*/
    height: 100vh;
  }

  .task-nav{
    background-color:  var(--color-nav);
    color: var(--color-nav-color);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .content{
    /*height: 100px;*/
    /*background-color: #d3dbff;*/
    /*overflow: hidden;*/
    overflow: hidden;
    position: absolute;
    top:94px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .addtask {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    bottom: 60px;
  }

  .addtask img {
    width: 45px;
    height: 45px;
  }
  .popup{
    background-color: rgba(255,255,255,0);
  }
  .fa-cubes-pos{
    padding-top: 10px;
    color: azure;

  }
  .pop-box{
    height: 45px;
    width: 166px;
    margin: 20px;
  }
  .pop-info{
    height: 36px;
    width: 100px;
    background-color: azure;
    margin-top: 8px;
    border-radius: 8px;
    text-align: center;
  }
  .pop-info p {
    line-height: 36px;
    color: rgb(135, 177, 242);
  }
  .pop-fa{
    width: 52px;
    height: 52px;
    background-color: rgb(135, 177, 242);
    border-radius: 50%;
    text-align: center;
    padding-left: 3px;
  }
  .popup-box{
    margin-top: 30px;
    margin-bottom: 30px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #e5e5e5;
    text-align: center;
    vertical-align: center;

  }
  .popup-p{
    font-size: 18px;
    margin-top: 12px;
  }

  /deep/ .van-cell{
    line-height: 34px;
  }
</style>
