<template>
  <div class="tastList">
    <TaskListItem v-for="item in tasks" :tasks-item="item"></TaskListItem>
  </div>
</template>

<script>
  import TaskListItem from "./TaskListItem";
  export default {
    name: "TaskList",
    props:{
      tasks:{
        type: Array,
        default() {
          return [];
        }
      }
    },
    components:{
      TaskListItem
    }
  }
</script>

<style scoped>

</style>
