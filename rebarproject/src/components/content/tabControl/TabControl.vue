<template>
    <div class="tab-control">
      <div v-for="(item,index) in titles"
           class="tab-control-item"
           :class="{active: index === currentIndex}" @click="itemClick(index)">
        <span>{{item}}</span>
      </div>

    </div>
</template>

<script>
  export default {
     name: "TabControl",
    props:{
      titles:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return{
        //记录当前选中 更换颜色
        currentIndex:0


      }
    },
    methods:{
      itemClick(index){
        //更换颜色
        this.currentIndex = index
        //将子组件点击按钮事件传到外层,内部往外传用自定义事件emit
        //将活跃状态index传出去
        this.$emit('tabClick',index)
        //外层Task.vue监听
      }
    }
  }
</script>

<style scoped>
  .tab-control{
    display: flex;
    text-align: center;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
  }
  .tab-control-item{
    flex: 1;

  }
  .tab-control-item span{
    padding: 10px;
  }
  .active{
    color: var(--color-tabcontrol-active);

  }
  .active span{
    border-bottom: 3px solid var(--color-tabcontrol-active);
  }
</style>
