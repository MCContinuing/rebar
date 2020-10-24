<!--为便于后续代码管理，此处封装Scroll-->
<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
        message: '哈哈哈'
      }
    },
      //被挂载后就创建
      mounted() {
      // 1.创建BScroll对象
        //ref如果是绑定在组件中，那么通过this.$refs.绑定名 可以获取到一个组件对象
        //ref如果是绑定在普通元素中，那么通过this.$refs.绑定名 可以获取到一个元素对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        //箭头显示隐藏
        probeType: this.probeType,
        //上拉加载更多
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position);
          //将自定义事件scorll携带position传出
          this.$emit('scroll', position)
        })
      }

      // 3.监听scroll滚动到底部，上拉加载更多
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        //this.scroll有值情况再调用
        //拿到refresh内部会重新计算可滚动区域，如果加载图片则不会卡顿
        this.scroll && this.scroll.refresh()
      },
      //有了此函数，上拉加载更多时可执行多次
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
