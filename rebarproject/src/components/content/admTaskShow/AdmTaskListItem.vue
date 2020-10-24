<template>
<!--  <div @touchstart.prevent="touchin(tasksItem.taskID)" @touchend.prevent="cleartime">-->
<div>
    <van-swipe-cell :disabled="isSwipe" :before-close="beforeClose1">
        <van-collapse v-model="activeNames" :border=border v-if="tasksItem.taskIDList.length !==0" >
          <van-collapse-item name="0" :border=border>
            <div slot="title">
              <div class="myicon">
                <van-icon v-if="tasksItem.taskIDList[0].state === '未检测'"
                          name="tosend" color="#1989fa" size="20"
                          :info="tasksItem.taskIDList.length"/>
                <van-icon v-else name="tosend" size="20" class="icon"/>
              </div>
              {{"任务"+tasksItem.id }}
            </div>

            <van-swipe-cell  v-for="(item,index) in tasksItem.taskIDList"
                             v-if="tasksItem.taskIDList[0].state === '未检测'"
                             :before-close="beforeClose2">
              <div class="reset">
                <van-cell
                  :title=item.taskCar
                  value="负责员工：小张"
                  @click="itemClick(item.iid,tasksItem.id)"/>
              </div>

              <template slot="right">
                <van-button
                  slot="right"
                  square
                  text="删除"
                  type="danger"
                  @click="delIndex = index"
                  class="delete-button"/>
              </template>
            </van-swipe-cell>



          </van-collapse-item>
        </van-collapse>

      <van-cell v-else is-link  arrow-direction="down">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <div class="myicon">
            <van-icon
              name="tosend" color="#1989fa" size="20"
              :info="tasksItem.taskIDList.length"/>
          </div>
          {{"任务"+tasksItem.id }}
        </template>
      </van-cell>

      <template #right>
        <van-button
          square
          text="删除"
          type="danger"
          class="delete-button"

        />
      </template>
    </van-swipe-cell>
  </div>

</template>

<script>
  import { Dialog ,Toast} from 'vant';
  import {deleteBigTask, deleteSmallTask} from "../../../network/adm";
  import {DEL_ADM_BIGTASK, DEL_ADM_SMATASK} from "../../../store/mutations-types";

  export default {
    name: "AdmTaskListItem",
    props: {
      tasksItem: {
        type: Object,
        default() {
          return {}
        }
      },
      index:0
    },
    data() {
      return {
        delIndex:null,
        border:true,
        activeNames: ['1'],
      };
    },

    computed:{
      isSwipe: function () {
        if(this.activeNames.length > 1){
          return true;
        }
        else {
        return false
        }
      }
    },

    methods:{
      /**
       * 数据请求相关操作
       *
       */
      //删除大任务
      deleteBigTask(){
        let taskID = this.tasksItem.taskID;
        this.$store.commit(DEL_ADM_BIGTASK,taskID)
        deleteBigTask(taskID).then(res=>{
          Toast.success('删除成功');
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      //删除小任务
      deleteSmallTask(index){
        let sTaskId = this.tasksItem.taskIDList[index].taskIID;
        if(this.tasksItem.taskIDList.length>0){
          let taskIds = {
            taskID:this.tasksItem.taskID,
            taskIID:this.tasksItem.taskIDList[index].taskIID
          };
          this.$store.commit(DEL_ADM_SMATASK,taskIds);
          deleteSmallTask(sTaskId).then(res=>{
            console.log(res);
          }).catch(err=>{
            console.log(err);
          })
        }

      },

      /**
       * 跳转路由相关操作
       * @param iid
       * @param id
       */
      itemClick(iid,id) {
        // this.$router.push({path:'/detail',query:{iid:iid,taskID:taskID}})
        if(this.tasksItem.taskIDList.length !== 0){
          if(this.tasksItem.taskIDList[0].state === '已检测'){
            this.$router.push('/admShowTask/'+id+'/'+iid)
          }else{
            this.$router.push('/admEditTask/'+id+'/'+iid)
          }
        }

      },
      /**
       * vant使用方法
       * @param position
       * @param instance
       */
      beforeClose1({ position, instance }) {
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
              this.deleteBigTask();
              instance.close();
            });
            break;
        }
      },

      // position 为关闭时点击的位置
      // instance 为对应的 SwipeCell 实例
      beforeClose2({ position, instance }) {
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
              this.deleteSmallTask(this.delIndex)
              // console.log(position)
              // console.log(instance)
              // this.tasksItem.taskIDList.splice(this.index,1)
              instance.close();
            });
            break;
        }
      }
    }
  }
</script>
<style>

</style>
<style scoped>
  @import "../../../assets/css/resetVui.css";
  .delete-button {
    height: 100%;
  }
  .myicon{
    margin-top: 6px;
    margin-right: 6px;
    float: left;
  }
</style>
