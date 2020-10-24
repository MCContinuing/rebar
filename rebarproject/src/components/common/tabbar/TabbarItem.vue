<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else="!isActive"><slot name="item-icon-active"></slot></div>
<!--    <slot :class="{active: isActive}" name="item-text"></slot>
        此方法会导致插槽最终被替换，展示不了样式-->
    <div :style="activeStyle" ><slot name="item-text"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "TabbarItem",
    // 用于父组件向子组件传递信息
    props:{
      path: String,
      activeColor: {
        type: String,
        default: 'blue'
      }
    },
    data(){
      return{
        // isActive: false
      }
    },
    // 计算属性
    computed:{
      isActive(){
        //=-1代表没找到
        //没找到路径显示不活跃
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle(){
        return this.isActive? {color: this.activeColor}:{}
      }
    },
    methods:{
      itemClick(){
        this.$router.replace(this.path)
      }
    }

  }
</script>

<style scoped>
  .tab-bar-item{
    /*权重均设置为1*/
    flex:1;
    text-align:center;
    /*安卓常用高度*/
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    margin-bottom: 2px;
    /*去掉图片底下本身的3px*/
    vertical-align: middle;
  }

</style>
