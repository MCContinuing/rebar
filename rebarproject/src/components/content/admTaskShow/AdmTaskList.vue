<template>
  <div  >
    <AdmTaskListItem  v-for="(item,index) in tasks"  :tasks-item="item" :index="index"></AdmTaskListItem>
  </div>

</template>

<script>
  import AdmTaskListItem from "./AdmTaskListItem";
  import {deleteBigTask} from "../../../network/adm";


  export default {
    name: "AdmTaskList",
    components: {AdmTaskListItem},
    props:{
      tasks:{
        type: Array,
        default() {
          return [];
        }
      }
    },
    data(){
      return{
        // key:this.tasks.length
      }
    },
    created() {
      console.log('tasks');
      console.log(this.tasks);
    },
    methods:{
      /**
       * 数据请求相关操作
       *
       */
      //删除大任务
      deleteBigTask(bigTaskId){
        deleteBigTask(bigTaskId).then(res=>{
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      touchin() {
        clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
        this.Loop = setTimeout(function() {
          alert('是否确认删除')
        }.bind(this), 1000);
      },
      cleartime() {
        // 这个方法主要是用来将每次手指移出之后将计时器清零
        clearInterval(this.Loop);
      },
    }

  }
</script>

<style scoped>

</style>
