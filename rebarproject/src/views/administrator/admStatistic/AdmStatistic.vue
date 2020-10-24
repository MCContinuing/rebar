<template>
  <div id="admstatistic">
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
      <h5>钢筋检测信息一览表</h5>
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
      <van-row type="flex" justify="space-between" class="row">
        <van-col style="background-color: rgba(51,236,239,0.32)" span="4">编号</van-col>
        <van-col style="background-color: rgba(182,162,222,0.39)" span="5">钢筋型号</van-col>
        <van-col style="background-color: rgba(90,177,239,0.4)" span="4">目标量</van-col>
        <van-col style="background-color: rgba(255,185,128,0.31)" span="4">提交量</van-col>
        <van-col style="background-color: rgba(216,122,128,0.38)" span="4">检测员</van-col>
        <van-col style="background-color: rgba(141,152,179,0.48)" span="4">状态</van-col>
        <van-col style="background-color: rgba(184,208,124,0.3)" span="2">审核</van-col>
      </van-row>
      <Scroll class="content"
              ref="scroll"
              :probe-type="3">
        <div class="chart_6">
          <div class="chart" :style="{height: allheight+'px'}" >

            <van-collapse  v-for="(item,index) in newAdmList"  v-model="activeName" accordion class="van-collapse-item">
              <van-collapse-item  :title=item.taskID :name=index value="未完成">
                <div v-for="(item1,index1) in item.taskIDList">
                  <div  v-for="(item2,index2) in item1.kindall">
                    <van-row type="flex" justify="space-between" class="row">
                      <van-col style="color: rgba(43,198,201,0.8)" span="4">{{item1.taskCar}}</van-col>
                      <van-col style="color: rgb(138,122,168)" span="5">{{item2.kindname}}</van-col>
                      <van-col style="color: rgba(90,177,239,0.78)" span="4">{{item2.kindnum}}</van-col>
                      <van-col style="color: rgba(225,163,113,0.93)" span="4">{{item2.tastnum}}</van-col>
                      <van-col style="color: rgba(215,121,127,0.89)" span="4">{{item1.empName}}</van-col>
                      <van-col style="color: rgb(142,153,180)" span="4">{{item2.teststatus}}</van-col>
                      <van-col style="color: rgba(184,208,124,0.81)" span="2">审核</van-col>
                    </van-row>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
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

    <div class="head">
      <h5>员工进度统计</h5>
      <div class="left head-info">
        <p class="text">员工数</p>
        <p class="number">5</p>
      </div >
      <div class="right head-info">
        <p class="text">未完成任务数</p>
        <p class="number">10</p>
      </div>
    </div>
    <div class="box">
      <div class="chart_4">
        <div class="chart">
        </div>
      </div>
    </div>

    <div class="head">
      <h5>2020-4 任务月历</h5>
      <div class="left head-info">
        <p class="text">今日截至任务</p>
        <p class="number">0</p>
      </div >
      <div class="right head-info">
        <p class="text">明日截止任务</p>
        <p class="number">1</p>
      </div>
    </div>
    <div class="box">
      <div class="chart_5">
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
    name: "AdmStatistic",
    data(){
      return{
        activeName: '1',
        newAdmList:this.$store.state.newAdmList,
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
      this.per4();
      this.per5();
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
              radius: '46%',
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
                    padding: [1, 1],
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

      per4(){
        let myChart = this.$echarts.init(document.querySelector(".chart_4 .chart"));
        let option = {
          color: ['#00f2f1','#0E7CE2'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            top: "5%",
            right: "5%",
            data: ['任务完成进度', '年度考核分'],
            itemWidth: 12,
            itemHeight: 12,
          },
          grid: {
            top: "20%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            // 不显示刻度
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#4c9bfd" // 文本颜色
            },
            axisLine: {
              show: false // 去除轴线
            },
          },
          yAxis: {
            type: 'category',
            data: ['小张', '小李', '小王', '小高', '小孙', '平均'],
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#4c9bfd" // 文本颜色
            },
            axisLine: {
              show: false // 去除轴线
            }
          },
          series: [
            {
              name: '任务完成进度',
              type: 'bar',
              data: [89,64, 56, 89, 78, 85],
              itemStyle: {
                // 修改柱子圆角
                barBorderRadius: 10
              },
              barWidth: "30%",
            },

            {
              name: '年度考核分',
              type: 'bar',
              data: [87, 89, 78,94, 78, 87],
              itemStyle: {
                // 修改柱子圆角
                barBorderRadius: 10
              },
              barWidth: "30%",
            }
          ]
        };
        myChart.setOption(option);
        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});
      },

      per5(){
        let myChart = this.$echarts.init(document.querySelector(".chart_5 .chart"));
        let cellSize = [55, 55];
        let pieRadius = 19;

        function getVirtulData() {
          let date = +echarts.number.parseDate('2020-04-01');
          let end = +echarts.number.parseDate('2020-05-01');
          let dayTime = 3600 * 24 * 1000;
          let data = [];
          for (let time = date; time < end; time += dayTime) {
            data.push([
              echarts.format.formatTime('yyyy-MM-dd', time),
              Math.floor(Math.random() * 10000)
            ]);
          }
          return data;
        }

        function getPieSeries(scatterData, chart) {
          return echarts.util.map(scatterData, function (item, index) {
            let center = chart.convertToPixel('calendar', item);
            return {
              id: index + 'pie',
              type: 'pie',
              center: center,
              label: {
                normal: {
                  formatter: '{c}',
                  position: 'inside'
                }
              },
              radius: pieRadius,
              data: [
                {name: '新增加', value: Math.round(Math.random() * 3)},
                {name: '新检测', value: Math.round(Math.random() * 3)},
                {name: '截止', value: Math.round(Math.random() * 3)}
              ]
            };
          });
        }

        function getPieSeriesUpdate(scatterData, chart) {
          return echarts.util.map(scatterData, function (item, index) {
            let center = chart.convertToPixel('calendar', item);
            return {
              id: index + 'pie',
              center: center
            };
          });
        }

        let scatterData = getVirtulData();

        let option = {
          color: [ '#00f2f1','#0E7CE2','#E271DE',],
          tooltip : {},
          legend: {
            data: ['新增加', '新检测', '截止'],
            bottom: 5,
            itemWidth: 12,
            itemHeight: 12,
          },

          calendar: {
            height:'74%',
            width:'96%',
            top: 'middle',
            left: 'center',
            orient: 'vertical',
            cellSize: cellSize,
            yearLabel: {
              show: false,
              textStyle: {
                fontSize: 16
              }
            },
            dayLabel: {
              textStyle: {
                color: '#4c9bfd',
                fontSize: 12
              },
              margin: 20,
              firstDay: 1,
              nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            },
            monthLabel: {
              show: false
            },
            range: ['2020-04']
          },
          series: [{
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return echarts.format.formatTime('dd', params.value[0]);
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                textStyle: {
                  color: '#000',
                  fontSize: 7
                }
              }
            },
            data: scatterData
          }]
        };

        let pieInitialized;
        setTimeout(function () {
          pieInitialized = true;
          myChart.setOption({
            series: getPieSeries(scatterData, myChart)
          });
        }, 10);

        app.onresize = function () {
          if (pieInitialized) {
            myChart.setOption({
              series: getPieSeriesUpdate(scatterData, myChart)
            });
          }
        };
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

  .row{
    text-align: center;
    font-size: 11px;
    height: 25px;
    line-height: 25px;
  }


  /deep/ .van-cell{
    padding-top: 0px;
    padding-bottom: 0px;
    line-height: 30px;
    font-size: 10px;
    color: #120746;
  }
  /deep/.van-cell__right-icon {
    margin-top: 4px;
    margin-left: 12px;
    color: #969799;
    font-size: 10px;
  }

</style>
