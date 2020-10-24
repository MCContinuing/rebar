<template>
  <div id="task">
    <van-notice-bar v-if="tasks.new.length!==0" :scrollable="true" mode="closeable"
      text="您有新的钢筋检测任务待完成，注意任务截至时间哦" left-icon="volume-o" />
  <NavBar class="task-nav"><div slot="center">任务中心</div></NavBar>
  <TabControl :titles="['我的任务','历史记录']" @tabClick="tabClick"></TabControl>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore"
            @scroll="contentScroll">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <TaskList :tasks="showTasks"></TaskList>
      </van-pull-refresh>
      <van-divider v-show="gotBottom" :style="{ padding: '0px 16px 50px 16px' }">已经到底啦</van-divider>
    </Scroll>
<!--    组件不能直接监听点击，需要加上native-->
    <BackTop @click.native="backClick"  v-show="isTabFixed"></BackTop>
  </div>
</template>

<script>
  import NavBar from "../../../components/common/navbar/NavBar";
  import TabControl from "../../../components/content/tabControl/TabControl";
  import TaskList from "../../../components/content/taskShow/TaskList";
  import Scroll from "../../../components/common/scroll/Scroll";
  import BackTop from "../../../components/content/backTop/BackTop";
  import {Toast} from "vant";

  import { getSmallTasks} from "network/task";
  import {ADD_ADM_TASK, ADD_OLD_TASK, ADDTAST} from "../../../store/mutations-types";


  export default {
    name: "Task",
    components:{
      NavBar,
      TabControl,
      TaskList,
      Scroll,
      BackTop,
    },
    data(){
      return {
        gotBottom:false,
        ifCreat:true,
        tasks: {
          'new': {page: 0, list: this.$store.state.newList},
          'old': {page: 0, list: this.$store.state.oldList},
        },
        newMassage: {
          taskID:null,//大任务编号
          id:null,
          taskIDList:[
          ]
        },
        kindall:[],
        oldMassage: {
          taskID:10,//大任务编号
          taskIDList:[]
        },
        //默认当前类型为新任务
        currentType:'new',
        isShowBackTop: false,//判断BackTop是否显示
        tabOffsetTop: 0,
        isTabFixed: false,//决定tabControl是否吸顶
        saveY: 0,//记录路由切换时的页面状态，下次回来保持原来状态
        isLoading: false,
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
      // if(this.ifCreat){
      //   this.getNewTaskList();
      // }
      // this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      //请求多个任务
      this.getNewBigTask(0);
      this.ifCreat=false;
      this.getOldBigTask(1);
    },
    methods:{

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



      getNewBigTask(status) {
        const page = this.tasks['new'].page + 1
      getSmallTasks(page,status).then(res => {
        if(res.length === 0){
          this.gotBottom = true;
        }
        else{
          // this.tasks['new'].list.push(...res.data.list)
          // this.tasks['new'].page += 1
          // this.$refs.scroll.finishPullUp()
          console.log('请求成功');
          this.regetNewTaskList(res);
          this.tasks['new'].page += 1
          console.log(this.$store.state.newList);
        }
        this.$refs.scroll.finishPullUp();
      }).catch(err => {
          console.log(err)
        })
      },
      getOldBigTask(status) {
        const page = this.tasks['old'].page + 1
        getSmallTasks(page,status).then(res => {
          if(res.length === 0){
            this.gotBottom = true;
          }
          else{
            // this.tasks['new'].list.push(...res.data.list)
            // this.tasks['new'].page += 1
            // this.$refs.scroll.finishPullUp()
            console.log('请求成功');
            this.regetOldTaskList(res);
            this.tasks['old'].page += 1
            console.log(this.$store.state.oldList);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 事件监听相关方法
       */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'new'
            break
          case 1:
            this.currentType = 'old'
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
          this.getNewBigTask(0)
        }
        else {
          this.getOldBigTask(1)
        }

      },
      //下拉刷新
      onRefresh() {
        // this.tasks[this.currentType].page = 0;
        this.tasks[this.currentType].page=0;
        if(this.currentType==='new'){
          this.$store.state.newList=[];
          this.getNewBigTask(0);
        }
        else{
          this.$store.state.oldList=[];
          this.getOldBigTask(1);
        }
        // this.tasks['new'].page = 1;

        setTimeout(() => {
          Toast('刷新成功');
          this.isLoading = false;
        }, 1000);
      },
      /**
       * 处理请求来的数据
       */
      regetNewTaskList(res){
        //循环大任务
        for(let i = 0; i < res.length; i++) {
          this.newMassage.taskID = res[i].taskId;
          this.newMassage.id = res[i].id;
          //循环小任务
          for(let j = 0 ; j<res[i].smallTasks.length;j++){
            let num = 0;
            //循环钢筋种类
            for(let k = 0 ;k<res[i].smallTasks[j].barTaskInfos.length;k++){
              this.kindall.push({
                kindname:res[i].smallTasks[j].barTaskInfos[k].barName,
                kindnum:res[i].smallTasks[j].barTaskInfos[k].barNum,
                testStatus:res[i].smallTasks[j].barTaskInfos[k].testStatus,
                tastnum:res[i].smallTasks[j].barTaskInfos[k].testNum,
                barId:res[i].smallTasks[j].barTaskInfos[k].barId,
              })
              num +=res[i].smallTasks[j].barTaskInfos[k].barNum;
            }
            let endTime = this.timeStamp(res[i].smallTasks[j].endTime);
            this.newMassage.taskIDList.push({
              iid: res[i].smallTasks[j].id,
              taskIID:res[i].smallTasks[j].taskId,
              taskDay: endTime,
              taskCar: res[i].smallTasks[j].carNumber,
              bigTaskId:res[i].smallTasks[j].bigTaskId,
              createdTime:res[i].smallTasks[j].createdTime,
              staff: this.$store.state.profile.empName,
              num:num,
              kindall: this.kindall,
              state: '未检测',
              supplier: res[i].campany,
            })
            this.kindall = [];
          }
          this.$store.commit(ADDTAST,this.newMassage)
          this.newMassage={taskID:null,taskIDList:[]}
        }
      },
      regetOldTaskList(res){
        //循环大任务
        for(let i = 0; i < res.length; i++) {
          this.newMassage.taskID = res[i].taskId;
          this.newMassage.id = res[i].id;
          //循环小任务
          for(let j = 0 ; j<res[i].smallTasks.length;j++){
            let num = 0;
            //循环钢筋种类
            for(let k = 0 ;k<res[i].smallTasks[j].barTaskInfos.length;k++){
              this.kindall.push({
                kindname:res[i].smallTasks[j].barTaskInfos[k].barName,
                kindnum:res[i].smallTasks[j].barTaskInfos[k].barNum,
                testStatus:res[i].smallTasks[j].barTaskInfos[k].testStatus,
                tastnum:res[i].smallTasks[j].barTaskInfos[k].testNum,
                barId:res[i].smallTasks[j].barTaskInfos[k].barId,
              })
              num +=res[i].smallTasks[j].barTaskInfos[k].barNum;
            }
            let endTime = this.timeStamp(res[i].smallTasks[j].endTime);
            this.newMassage.taskIDList.push({
              iid: res[i].smallTasks[j].id,
              taskIID:res[i].smallTasks[j].taskId,
              taskDay: endTime,
              taskCar: res[i].smallTasks[j].carNumber,
              bigTaskId:res[i].smallTasks[j].bigTaskId,
              createdTime:res[i].smallTasks[j].createdTime,
              staff: this.$store.state.profile.empName,
              num:num,
              kindall: this.kindall,
              state: '已检测',
              supplier: res[i].campany,
            })
            this.kindall = [];
          }
          this.$store.commit(ADD_OLD_TASK,this.newMassage)
          this.newMassage={taskID:null,taskIDList:[]}
        }
      },
    }
  }
</script>

<style scoped>

  #task{
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

</style>
