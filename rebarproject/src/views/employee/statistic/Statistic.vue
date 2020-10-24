<template>
  <div id="statistic">
    <NavBar class="task-nav"><div slot="center">数据统计</div></NavBar>
<!--    需要在最外层包裹才能使用-->
    <div class="head">
      <h5>钢检测结果统计</h5>
      <div class="left head-info">
        <p class="text">任务数</p>
        <p class="number">12</p>
      </div >
      <div class="right head-info">
        <p class="text">钢筋数</p>
        <p class="number">2897</p>
      </div>
    </div>
    <div class="box">
      <div class="chart_2">
        <div class="chart">
        </div>
      </div>
        <!--      <div style="padding-bottom: 30px"></div>-->
    </div>
    <div class="head">
      <h5>新任务完成进度</h5>
      <div class="left head-info">
        <p class="text">任务数</p>
        <p class="number">12</p>
      </div >
      <div class="right head-info">
        <p class="text">钢筋数</p>
        <p class="number">2897</p>
      </div>
    </div>
    <div class="box0">
      <Scroll class="content"
              ref="scroll"
              :probe-type="3">
        <div class="chart_1">
          <div class="chart" :style="{height: allheight+'px'}" >
          </div>
        </div>
      </Scroll>
    </div>
    <div class="head">
      <h5>月度检测统计</h5>
      <div class="left head-info">
        <p class="text">任务数</p>
        <p class="number">10</p>
      </div >
      <div class="right head-info">
        <p class="text">钢筋数</p>
        <p class="number">2397</p>
      </div>
    </div>
    <div class="box">
      <div class="chart_3">
        <div class="chart">
        </div>
      </div>
    </div>
    <div style="padding: 40px"></div>
  </div>

</template>

<script>
  import NavBar from "../../../components/common/navbar/NavBar";
  import Scroll from "../../../components/common/scroll/Scroll";
  import echarts from 'echarts'
  // import BScroll from 'better-scroll'
  //
  // let scroll = new BScroll(this.$refs.wra,{
  //   scrollX: true,
  // });

  export default {
    name: "Statistic",
    data(){
      return{
        scroll: null,
        message:'',
        show:false,
        taskIID:[],
        num:[],
        testnum:[],
        percentage:[],

        // allheight:500,
      }
    },
    components:{
      NavBar,
      Scroll,
    },
    computed:{
      allheight(){
        return 600;
      },


    },
    created() {
      this.gettaskIID();
      this.getnum();
      this.gettestnum();
      this.getpercentage();
    },
    mounted() {
      this.per1();
      this.per2();
      this.per3();
    },
    methods:{
      per1(){
        let myChart = this.$echarts.init(document.querySelector(".chart_1 .chart"));
        let charts = { // 按顺序排列从大到小
          cityList: this.taskIID,
          cityData: this.percentage,
        }
        let top10CityList = charts.cityList
        let top10CityData = charts.cityData
        let color = ['rgba(248,195,248', 'rgba(0,242,241', 'rgba(135,183,255',
          'rgba(248,195,248', 'rgba(100,255,249','rgba(248,195,248',
          'rgba(100,255,249', 'rgba(135,183,255', 'rgba(248,195,248',
          'rgba(100,255,249','rgba(248,195,248', 'rgba(100,255,249',
          'rgba(135,183,255']

        let lineY = []
        for (let i = 0; i < charts.cityList.length; i++) {
          let x = i
          if (x > color.length - 1) {
            x = color.length - 1
          }
          let data = {
            name: charts.cityList[i],
            color: color[x] + ')',
            value: top10CityData[i],
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: color[x] + ', 0.7)'
                }, {
                  offset: 1,
                  color: color[x] + ', 1)'
                }], false),
                barBorderRadius: 10
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
          lineY.push(data)
        }

        console.log(lineY)
        let option= {
          backgroundColor:'#ffffff',
          title: {
            show: false
          },

          grid: {
            borderWidth: 0,
            top: '5%',
            left: '5%',
            right: '15%',
            bottom: '3%'
          },
          color: color,
          yAxis: [{
            type: 'category',
            // inverse: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {

              show: false,
              inside: false
            },
            data: top10CityList
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              inside: false,
              textStyle: {
                color: "#1880D0",
                fontSize: '10',
                fontFamily: 'PingFangSC-Regular'
              },
              formatter: function (val) {
                return `${val}%`
              }
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: top10CityData
          }],
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          series: [{
            name: '',
            type: 'bar',
            zlevel: 2,
            barWidth: '10px',
            data: lineY,
            animationDuration: 1500,
            label: {
              normal: {
                color: "#1880D0",
                show: true,
                position: [0, '-16px'],
                textStyle: {
                  fontSize: 10
                },
                formatter: function (a, b) {
                  return a.name
                }
              }
            }
          }],
          animationEasing: 'cubicOut'
        }


        myChart.setOption(option);

        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});
      },

      per2(){
        let myChart = this.$echarts.init(document.querySelector(".chart_2 .chart"));
        let option = {
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 20,
            left: 'center',
            data: ['未检测', '数量符合', '数量不符']
          },
          series: [
            {

              color: [ '#00f2f1','#0E7CE2','#E271DE',],
              // color = ['#0E7CE2', '#FF8352',  '#F8456B', '#00FFFF', '#4AEAB0'];
              type: 'pie',
              radius: '50%',
              center: ['50%', '42%'],
              selectedMode: 'single',
              label: {
                formatter: '{a|{b}}{abg|}\n{hr|}\n  数量:{b|{c}} {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 10,
                    lineHeight: 22
                  },
                  per: {
                    fontSize: 10,
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [0, 0],
                    borderRadius: 2
                  }
                }
              },
              labelLine: {
                // 连接扇形图线长
                length: 10,
                length2: 12
           },

        data: [
                {value: 1548,name: '未检测'},
                {value: 535, name: '数量符合'},
                {value: 200, name: '数量不符'},
              ],
            }
          ]
        };

        myChart.setOption(option);
        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});

      },
      per3(){
        let myChart = this.$echarts.init(document.querySelector(".chart_3 .chart"));
        let yearData = [
          {
            year: "2020", // 年份
            data: [
              // 两个数组是因为有两条线
              [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
              [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
            ]
          },
          {
            year: "2021", // 年份
            data: [
              // 两个数组是因为有两条线
              [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
              [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34]
            ]
          }
        ];

        // 2.指定配置
        let option = {
          // 通过这个color修改两条线的颜色
          color: ["#00f2f1", "#ed3f35"],
          tooltip: {
            trigger: "axis"
          },
          legend: {
            // 如果series 对象有name 值，则 legend可以不用写data
            // 修改图例组件 文字颜色
            textStyle: {
              color: "#4c9bfd"
            },
            // 这个10% 必须加引号
            right: "10%"
          },
          grid: {
            top: "20%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            show: false, // 显示边框
            borderColor: "#012f4a", // 边框颜色
            containLabel: true // 包含刻度文字在内
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisTick: {
              show: false // 去除刻度线
            },
            axisLabel: {
              color: "#4c9bfd" // 文本颜色
            },
            axisLine: {
              show: false // 去除轴线
            }
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false // 去除刻度线
            },
            axisLabel: {
              color: "#4c9bfd" // 文本颜色
            },
            axisLine: {
              show: false // 去除轴线
            },
            splitLine: {
              lineStyle: {
                color: "rgba(1,113,168,0.2)" // 分割线颜色
              }
            }
          },
          series: [
            {
              name: "检测任务",
              type: "line",
              // true 可以让我们的折线显示带有弧度
              smooth: true,
              data: yearData[0].data[0]
            },
            {
              name: "新增任务",
              type: "line",
              smooth: true,
              data: yearData[0].data[1]
            }
          ]
        };

        // 3. 把配置给实例对象
        myChart.setOption(option);

        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});

      },
      // this.addCart(product).then(res=>{
      //   this.show=true;
      //   this.message=res;
      //   setTimeout(()=>{
      //     this.show=false;
      //     this.message='';
      //   },1500)
      // })


      gettaskIID(){
        // let array=[];
        // for(let i = 0; i < this.$store.state.newList.length ; i++){
        //   let taskID  = this.$store.state.newList[i].taskID;
        //   array.push(taskID);
        // }
        // return array;
        this.taskIID =  ['A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
          'A07E53C127E83435DBC0D31E92B999A38',
        ]
      },

      getnum(){
        this.num = [100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
          100,
        ]
      },

      gettestnum(){
        this.testnum  = [40,
          34,
          67,
          89,
          67,
          34,
          56,
          34,
          100,
          90,
          90,
          78,
          89,
        ]
      },

      getpercentage(){
        let array = [];
        for(let i = 0; i < this.taskIID.length ; i++){
          let n = this.testnum[i]/this.num[i]*100;
          let per = Math.round(n);


          array.push(per);
        }
        this.percentage = array;
      },
    }
  }
</script>

<style scoped>
 @import"../../../assets/css/statistic.css";
 .content{
   margin: 0px 10px;
   height: 400px;
   background-color: #fff;
   overflow: hidden;
   position: absolute;
   left: 0;
   right: 0;
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
 }


</style>
