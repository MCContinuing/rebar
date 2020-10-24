<template>
  <div class="tasks-item">
<!--    <td class="tasks-item-next">-->
<!--      <img class="nextimg" src="~assets/img/common/task.png">-->
<!--    </td>-->
<!--      <td class="tasks-item-inner">-->
<!--        <p>任务编号</p>-->
<!--        {{tasksItem.taskID}}-->
<!--      </td>-->
    <van-collapse v-model="activeNames">

      <van-collapse-item name="0"  v-if="tasksItem.taskIDList.length !== 0">
          <div slot="title">
            <div class="myicon" >
              <van-icon v-if="tasksItem.taskIDList[0].state === '未检测'"
                        name="tosend" color="#1989fa" size="20" class="myicon"
                        :info="tasksItem.taskIDList.length"/>
              <van-icon v-else name="tosend" size="20" class="myicon"/>
            </div >
            <div class="mytask">
              {{"任务编号"+tasksItem.id}}
            </div>
              </div>

        <van-cell  v-for="item in tasksItem.taskIDList"
                   :title=item.taskCar
                   :value=item.iid
                    @click="itemClick(item.iid,tasksItem.id)"/>
      </van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
  export default {
    name: "TaskListItem",
    props: {
      tasksItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        activeNames: ['1'],
      };
    },

    methods:{
      itemClick(iid,id) {
        // this.$router.push({path:'/detail',query:{iid:iid,taskID:taskID}})
        this.$router.push('/detail/'+id+'/'+iid)
      }
    }
  }
</script>

<style scoped>
  @import "../../../assets/css/empReset.css";
.myicon{
  padding-top: 4px;
  margin-right: 4px;
  float: left;
}
  /*.mytask{*/
  /*  float: left;*/
  /*  padding-left: 30px;*/
  /*  margin: auto;*/
  /*}*/
</style>
