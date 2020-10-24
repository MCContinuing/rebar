<template>
  <div id="profile">
    <NavBar class="task-nav">
      <div slot="center">个人中心</div>
      <!--      <div slot="right" @click="goLoad">登陆</div>-->
    </NavBar>
    <div class="boxp">
      <h5>
        总任务进度
        <i class="fa fa-history" aria-hidden="true"></i>
      </h5>
      <div class="chart_p">
        <div class="chart">
        </div>
      </div>
      <!--      <div style="padding-bottom: 30px"></div>-->
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-cell-group>
        <van-cell title="姓名" :value="this.profile.empName" />
        <van-cell title="工号" :value="this.profile.empId" />
        <van-cell title="性别" :value="this.profile.empSex" />
        <van-cell title="联系方式" :value="this.profile.empPhoneNumber" />
        <van-cell title="退出登陆" @click="isExit"/>
      </van-cell-group>
    </van-pull-refresh>




  </div>

</template>

<script>
  import NavBar from "../../../components/common/navbar/NavBar";
  import {Dialog, Toast} from 'vant';
  import {DELUSER} from "../../../store/mutations-types";

  export default {
    name: "AdmProfile",

    components:{
      NavBar,
      [Dialog.Component.name]: Dialog.Component,
    },

    data() {
      return {

        count: 0,
        isLoading: false,
        profile:this.$store.state.profile,
      }
    },
    mounted() {
      this.per1();

    },
    methods:{
      per1(){
        let myChart = this.$echarts.init(document.querySelector(".chart_p .chart"));
        var dataArr = 44;
        var colorSet = {
          color: '#468EFD'
        };
        let option = {
          backgroundColor: '#fff',
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },

          series: [{
            name: "内部进度条",
            type: "gauge",
            // center: ['20%', '50%'],
            radius: '40%',

            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 100, colorSet.color],
                  [1, "#111F42"]
                ],
                width: 8
              }
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,

            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
            detail: {
              formatter: function(value) {
                if (value !== 0) {
                  var num = Math.round(value ) ;
                  return parseInt(num).toFixed(0)+"%";
                } else {
                  return 0;
                }
              },
              offsetCenter: [0, 82],
              textStyle: {
                padding: [0, 0, 0, 0],
                fontSize: 18,
                fontWeight: '700',
                color: colorSet.color
              }
            },
            title: { //标题
              show: true,
              offsetCenter: [0, 46], // x, y，单位px
              textStyle: {
                color: "#fff",
                fontSize: 14, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: 'PingFangSC'
              }
            },
            data: [{
              name: "title",
              value: dataArr,
            }],
            pointer: {
              show: true,
              length: '75%',
              radius: '30%',
              width: 5, //指针粗细
            },
            animationDuration: 4000,
          },
            {
              name: '外部刻度',
              type: 'gauge',
              radius: '60%',
              min: 0, //最小刻度
              max: 100, //最大刻度
              splitNumber: 10, //刻度数量
              startAngle: 225,
              endAngle: -45,
              axisLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: [
                    [1, 'rgba(0,0,0,0)']
                  ]
                }
              }, //仪表盘轴线
              axisLabel: {
                show: true,
                color: '#4d5bd1',
                distance: 25,
                formatter: function(v) {
                  switch (v + '') {
                    case '0':
                      return '0';
                    case '10':
                      return '10';
                    case '20':
                      return '20';
                    case '30':
                      return '30';
                    case '40':
                      return '40';
                    case '50':
                      return '50';
                    case '60':
                      return '60';
                    case '70':
                      return '70';
                    case '80':
                      return '80';
                    case '90':
                      return '90';
                    case '100':
                      return '100';
                  }
                }
              }, //刻度标签。
              axisTick: {
                show: true,
                splitNumber: 7,
                lineStyle: {
                  color: colorSet.color, //用颜色渐变函数不起作用
                  width: 1,
                },
                length: -8
              }, //刻度样式
              splitLine: {
                show: true,
                length: -20,
                lineStyle: {
                  color: colorSet.color, //用颜色渐变函数不起作用
                }
              }, //分隔线样式
              detail: {
                show: false
              },
              pointer: {
                show: false
              }
            },
          ]
        };

        myChart.setOption(option);

        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});
      },


      open(item, i) {
        const liCon = this.$refs.liCon[i]
        var height = liCon.offsetHeight
        if (height === this.liConHeight) { // 展开
          liCon.style.height = 'auto'
          height = liCon.offsetHeight
          liCon.style.height = this.liConHeight + 'px'
          var f = document.body.offsetHeight  // 必加
          liCon.style.height = height + 'px'
        } else { // 收缩
          liCon.style.height = this.liConHeight + 'px'
        }
        if (!item.openFlag) {
          Vue.set(item, 'openFlag', true)
        } else {
          Vue.set(item, 'openFlag', false)
        }
      },


      onRefresh() {
        setTimeout(() => {
          Toast('刷新成功');
          this.isLoading = false;
          this.count++;
        }, 1000);
      },
      isExit(){
        Dialog.confirm({
          title: '退出',
          message: '您是否确定退出登陆'
        }).then(() => {
          // on confirm
          this.$store.commit(DELUSER);
          this.$router.replace('/login')
        }).catch(() => {
          // on cancel
        });

      },
    }
  }
</script>

<style scoped >
  #profile{
    padding-top:  44px;
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

  .boxp{
    /*width: 100%;*/
    background-color: #fff;
    /*margin: 0px 10px 10px;*/
    /*box-shadow:  0px 1px 1px 1px rgba(0,0,0,0.05);*/
    /*border-bottom-left-radius: 10px;*/
    /*border-bottom-right-radius: 10px;*/

  }
  .boxp h5{
    color:  var(--color-nav);;
    font-size: 16px;
    padding: 20px 20px 0px;
  }
  .chart_p .chart {
    width: 100%;
    height: 240px;
  }
</style>
