<template>
  <div id="detection">
  <NavBar class="task-nav"><div slot="center">钢筋检测</div></NavBar>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3">
      <van-cell-group v-show="hasCreate" >
        <van-cell title="钢筋总数" :value="testAllSteelNum" />
      </van-cell-group>
      <!--大任务钢筋类型与数量输入-->
      <div v-for="(item,index) in barTaskInfos" >
        <van-dropdown-menu v-show="!hasCreate" @click="reload">
          <van-dropdown-item v-model="item.barId" :options="option1" />
        </van-dropdown-menu>

        <van-cell-group v-show="hasCreate">
          <van-cell title="钢筋类型" :value="item.barName" />
        </van-cell-group>
      </div>
      <!--大任务操控类型数量按钮-->
      <div class="big-butkind-box" v-show="!hasCreate">
        <div class="butkind-box">
          <button class="but-kind" @click.stop="reduceBig"  v-bind:disabled="barTaskInfos.length<=1 ">
            <i class="fa fa-minus-circle fa-kindclor" aria-hidden="true"></i>
          </button>
          &emsp;
          钢筋类型
          &emsp;
          <button class="but-kind" @click.stop="addBig" >
            <i class="fa fa-plus-circle fa-kindclor" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!--选择钢筋类型进行检测-->
      <van-field v-show="hasCreate"
        readonly
        clickable
        :name="value"
        left-icon="smile-o"
        :value="value"
        label="选择检测类型"
        placeholder="点击选择钢筋类型"
        @click="showPickerBar = true"
      />

      <!--图片上传-->
      <div class="img" v-show="hasCreate">
        <div class="uploader">
          <van-uploader :after-read="afterRead" :max-count="9" multiple v-model="fileList"
                        upload-text="钢筋检测" capture="camcorder" accepte="image/*"/>
        </div>
      </div>
      <div class="button" v-show="hasCreate">
        <van-button class="button-up" type="info" icon="checked" color="var(--color-button)" block @click="fileUploader">上传检测</van-button>
      </div>
<!--      查看返回图片详情信息-->
      <div class="block" v-show="!showImgs">

      </div>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }" v-show="showImgs">
        详情信息
      </van-divider>
      <div v-for="(item1,index1) in resAllImageInfo" v-show="showImgs">
        <van-cell-group>
          <van-cell :title="item1.barName" label="钢筋类型"  :value="item1.barNum" />
        </van-cell-group>
        <template v-for="(item2,index2) in item1.resImageInfo">
          <van-card
            :num="item2.testSteelNum"
            desc="点击图片可预览"
            title="图片详情"
            :thumb="item2.imageUrl"
            @click-thumb="imgPre(index1,index2)"
          >
            <template #tags>
              <van-tag plain >图片编号：{{item2.id}}</van-tag>
            </template>
            <template #bottom>
              <van-tag plain type="danger">已检测</van-tag>
            </template>
            <template #footer>
              <van-button size="mini" @click="redNum(index1,index2)"><i class="fa fa-minus" aria-hidden="true"></i></van-button>
              <van-button size="mini" @click="addNum(index1,index2)">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </van-button>
              <van-button size="mini" @click="delTask(index1,index2)">删除</van-button>
            </template>
          </van-card>
        </template>
      </div>

    </Scroll>
    <div class="addtask">
      <van-button v-if="!hasCreate" plain round type="info"  size="small" @click="addClick">确认</van-button>
      <van-button v-else plain round type="info"  size="small" @click="delClick">完成</van-button>
    </div>
    <!--    选择钢筋类别-->
    <van-popup v-model="showPickerBar" position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsBar"
        @confirm="onConfirmBar"
        @cancel="showPickerBar = false"
      />
    </van-popup>
  </div>


</template>

<script>


  import NavBar from "../../../components/common/navbar/NavBar";
  import Scroll from "../../../components/common/scroll/Scroll";

  import {createNewTestTask} from "../../../network/detection";
  import {testSmallTask,updateSmallTask,deleteImage,discordImage} from "network/upimage";

  import {ADD_TEST_TASK, DEL_IMG_INFO, DEL_TEST_TASK} from "../../../store/mutations-types";
  import {Dialog, ImagePreview, Toast} from "vant";

  export default {
    name: "Detection",
    components:{
      NavBar,
      Scroll
    },
    data() {
      return {
        showImgs:false,//是否显示检测图片
        resAllImageInfo:[{
          resImageInfo:[],//存储一类钢筋返回的图片信息
          barName:'',
          barNum:0,
        }],//存储所有返回的图片信息
        resImageInfo:[],//存储一类钢筋返回的图片信息
        barIndex:null,//当前检测钢筋的index
        selBarId:null,//选择图片检测的barId
        allBarInfo:this.$store.state.allBarInfo,
        value1: 0,
        option1: [
          { text: '选择钢筋类型', value: 0 },
        ],
        checked:false,
        isHand:false,//是否启用手动修改
        hasCreate:false,
        value:null,
        testSteelNum:0,//存储某一个钢筋类型总数
        columnsBars:[],
        showPickerBar:false,
        time:new Date(),
        fileList: [],
        imageList: [],
        taskId:null,
        barTaskInfos:[{
          id:null,
          barId:0,
          taskId:null,
          barNum:null,
          testNum:0,
          testStatus:null,
          barName:'',
        }],

      }
    },

    computed:{

      //获取所有钢筋信息
      // allBarInfo: function () {
      //   return Object.values(this.$store.state.allBarInfo)
      // },
      //返回钢筋类型列表
      columnsBar: function() {
        for (let barInfo of this.barTaskInfos) {
          this.columnsBars.push(barInfo.barName);
        }
        for (let i = 0 ; i <  this.columnsBars.length;i++){
          let isHas = false;
          for(let barInfo of this.barTaskInfos){
            //如果有相同的则为ture
            if(barInfo.barName === this.columnsBars[i]){
              isHas = true;
            }
          }
          //如果没有相同则删除
          if(!isHas){
            this.columnsBars.splice(i,1)
          }
        }
        this.columnsBars = this.delCom(this.columnsBars);
        // console.log('bar');
        // console.log(this.columnsBars);
        return this.columnsBars;
      },
      //获取所有钢筋总数
      testAllSteelNum:function () {
        let num = 0;
        for(let i = 0; i < this.resAllImageInfo.length; i++){
          num += this.resAllImageInfo[i].barNum;
        }
        return num;
      }
    },
    updated() {

    },
    created() {
        for(let info of this.allBarInfo){
          this.option1.push({
            text:info.barName,
            value:info.id
          })
        }


    },
    methods:{
      //强制刷新组件
      reload(){
        // this.$forceUpdate()
      },
      /**
       * 网络请求相关方法
       */
      //创建随机任务
      createNewTestTask(testTask){
        createNewTestTask(testTask).then(res=>{
          if(res){
            // console.log(testTask);
            this.$store.commit(ADD_TEST_TASK,testTask);
            this.taskId = res.taskId;
            this.hasCreate = true;
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      //检测图片
      testSmallTask(fd){
        testSmallTask(fd).then(res=>{
          if(res==='false'){
            Toast.fail('检测失败');
            this.setFileUploaderStatus(1, '检测失败')
          }
          else if(!res){
            this.setFileUploaderStatus(1, '失败，无返回')
            Toast.fail('检测失败');
          }
          else{
            this.setFileUploaderStatus(2, '检测成功')

            this.resAllImageInfo[this.barIndex].barName = this.value;
            this.resAllImageInfo[this.barIndex].resImageInfo.push({
              barId:res.barId,
              id:res.id,
              barName:res.barName,
              imageUrl:res.imageUrl,
              sTaskId:res.sTaskId,
              status:res.status,
              testSteelNum:res.testSteelNum,
            })
            this.showImgs = true;
          }
          this.getAllNum(this.barIndex);
          // console.log('barindex');
          // console.log(this.barIndex);
          this.resAllImageInfo[this.barIndex].barNum = this.testSteelNum;
          Toast.success('请求成功');
          // console.log('rsImg');
          // console.log(this.resAllImageInfo);
        }).catch(err=>{
          this.setFileUploaderStatus(1, '请求失败')
          console.log(err);
          Toast.fail('请求失败');
        })
      },
      //删除数据库图片信息
      deleteImage(id){
        deleteImage(id).then(res=>{
          console.log(res);
        }).catch(err=>{
          console.log(err);
        })
      },
      /**
       * 按钮点击相关操作
       */
      //创建一个随机任务
      addClick(){
        if(this.barTaskInfos[0].barId&&this.barTaskInfos[0].barId!==0 ){
          this.getTime();
          this.getBarName();
          let testTask = {
            id:null,
            taskId:null,
            createdTime:this.time,
            empId:this.$store.state.profile.empId,
            status:0,//零是未检测
            barTaskInfos:this.barTaskInfos
          }
          this.createNewTestTask(testTask);
        }
        else{
          Toast.fail('请选择钢筋类型');
          return
        }

      },

      //删除随机检测任务
      delClick(){
        this.$store.commit(DEL_TEST_TASK);
        this.hasCreate = false;
        for(let i = 0; i<this.resAllImageInfo.length ;i++){
          for(let j = 0; j<this.resAllImageInfo[i].resImageInfo.length;j++){
            this.deleteImage(this.resAllImageInfo[i].resImageInfo[j].id);
          }
        }
        this.showImgs=false;//是否显示检测图片
          this.resAllImageInfo=[{
            resImageInfo:[],//存储一类钢筋返回的图片信息
            barName:'',
            barNum:0,
          }];//存储所有返回的图片信息
        this.resImageInfo=[];//存储一类钢筋返回的图片信息
        this.barIndex=null;//当前检测钢筋的index
        this.selBarId=null;//选择图片检测的barId
        this.value1= 0;
        this.hasCreate=false;
        this.value='';
        this.testSteelNum=0;//存储某一个钢筋类型总数
        this.barTaskInfos=[{
          id:null,
          barId:0,
          taskId:null,
          barNum:null,
          testNum:0,
          testStatus:null,
          barName:'',
        }]
      },

      //添加钢筋类型
      addBig(){
        this.barTaskInfos.push({
          id:null,
          barId:0,
          taskId:null,
          barNum:null,
          testNum:0,
          testStatus:null,
          barName:'',
        })
        this.resAllImageInfo.push({
          resImageInfo:[],
          barName:null,
          barNum:null,
        })
      },

      //删除数据类型
      reduceBig(){
        this.barTaskInfos.pop();
      },

      //选择钢筋类型
      onConfirmBar(value) {
        this.value = value;
        console.log(this.value);
        this.showPickerBar = false;
        this.barIndex = this.barTaskInfos.findIndex(item => item.barName === value);
        this.getselBarId(this.barIndex)
      },

      //删除相关图片信息
      delTask(index1,index2){
        if(this.resAllImageInfo[index1].resImageInfo.length!==0){
          deleteImage(this.resAllImageInfo[index1].resImageInfo[index2].id).then(res=>{
            if(res==='ok'){
              this.resAllImageInfo[index1].resImageInfo.splice(index2,1)
              Toast('删除成功');
              this.getAllNum(index1);
              this.resAllImageInfo[index1].barNum = this.testSteelNum;
            }
            else{
              Toast('删除失败');
            }
          }).catch(err=>{
            console.log(err);
          })
        }
        else{
          Dialog.confirm({
            title: '确认消息',
            message: '是否确认删除此类型下的最后一张照片'
          }).then(() => {
            // on confirm
            deleteImage(this.resAllImageInfo[index1].resImageInfo[index2].id).then(res=>{
              this.resAllImageInfo[index1].barNum = this.testSteelNum;
            }).catch(err=>{
              console.log(err);
            })
          }).catch(() => {
            // on cancel弹框取消按钮
          });
        }

      },
      /**
       * 数据操控相关操作
       */
      //删除相同元素
      delCom(array){
        var n = [array[0]]; //结果数组
        //从第二项开始遍历
        for(var i = 1; i < array.length; i++) {
          //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
          //那么表示第i项是重复的，忽略掉。否则存入结果数组
          if (array.indexOf(array[i]) == i) n.push(array[i]);
        }
        return n;
      },

      //获取时间
      getTime(){
        let date = new Date(this.time);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        this.time = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      },

      //计算钢筋总数
      getAllNum(index){
        let num = 0;
        if(this.resAllImageInfo[index].resImageInfo.length !== 0){
          for(let i = 0 ; i < this.resAllImageInfo[index].resImageInfo.length;i++){
            num += this.resAllImageInfo[index].resImageInfo[i].testSteelNum;
            // console.log(num);
          }
        }
        this.testSteelNum = num;
      },

      //知道钢筋id获取name
      getBarName(){
        for(let i = 0; i<this.barTaskInfos.length ; i++){
          let index = this.$store.state.allBarInfo.findIndex(item => item.id === this.barTaskInfos[i].barId)
          this.barTaskInfos[i].barName = this.$store.state.allBarInfo[index].barName
        }
      },

      //获取选择的钢筋id
      getselBarId(index){
        this.selBarId = this.$store.state.allBarInfo[index].id;
      },

      //点击图片查看
      imgPre(index1,index2){
        ImagePreview({
          images: [this.resAllImageInfo[index1].resImageInfo[index2].imageUrl],
          closeable: true
        });
      },
      //增加钢筋检测结果数量
      addNum(index1,index2){
        this.resAllImageInfo[index1].resImageInfo[index2].testSteelNum++;
        this.resAllImageInfo[index1].barNum++
      },
      //减少钢筋检测结果数量
      redNum(index1,index2){
        this.resAllImageInfo[index1].resImageInfo[index2].testSteelNum--;
        this.resAllImageInfo[index1].barNum--
      },
      /**
       * 文件上传
       */
      fileUploader() {
        if(this.value===null){
          Toast.fail("请选择待检测钢筋类型");
          return
        }
        console.log('点击了')
        // 检测是否选择图片
        if (this.fileList.length === 0) {
          Toast.fail("请选择检测图片");
          return
        }
        // 设置文件上传状态
        this.setFileUploaderStatus(0, '上传中')
        this.testSteelNum = 0;

        for(let i = 0; i < this.fileList.length; i++){
          console.log("循环"+i+"次了");
          this.setFileUploaderStatus(0, '上传中');
          // 将数据进行FormData处理
          let fd = new FormData()
          let sTaskId = this.taskId;
          let barId = this.selBarId;
          let barName = this.value;
          let image = this.fileList[i];
          fd.append('image', image.file, image.file.name);
          fd.append('sTaskId',sTaskId);
          fd.append('barId',barId);
          fd.append('barName',barName);
          //发送检测图片请求
          this.testSmallTask(fd);

        }
      },
      /**
       * 图片文件操作相关方法
       */
      afterRead(files) {
        for (let i = 0; i < files.length; i++) {
          // console.log(files[i].file)
          // console.log(files[i].file.name)
        }
      },
     //预览图片
      showImage(src) {
        // console.log(src)
        ImagePreview([src]);
        const instance = ImagePreview([src]);
        setTimeout(() => {
          instance.close();
        }, 1000);
      },
      //设置文件上传状态
      setFileUploaderStatus(index, msg) {
        // uploading 上传中 failed 失败 done 完成
        let status = ['uploading', 'failed', 'done']
        for (let i = 0; i < this.fileList.length; i++) {
          this.fileList[i].status = status[index]
          this.fileList[i].message = msg
        }
      },
    }
  }
</script>

<style scoped>
  #detection{
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
  .uploader{
    margin-top: 20px;
    margin-left: 20px;
  }
  .button{
    margin-top: 20px;
    text-align: center;
    padding-bottom: 20px;
    padding-top: 20px;
  }
  .button-up{
    width: 300px;
    margin: 0 auto;
  }
  .addtask {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    bottom: 65px;
  }

  .content{
    /*height: 100px;*/
    /*background-color: #d3dbff;*/
    /*overflow: hidden;*/
    overflow: hidden;
    position: absolute;
    top:45px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .pos p{
    font-size: 16px;
    line-height: 30px;
    padding-left: 20px;
    font-weight: bold;
  }

  .big-butkind-box{
    background-color: #fff;

  }
  .but-kind{
    background: #fff;
    border-width: 0px;
  }
  .fa-kindclor{
    color: #1880D0;
  }
  .butkind-box{
    background-color: #fff;
    margin: 0 auto;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 200px;
    border-top: 1px solid rgba(0,0,0,0.1);
  }

  .gotask-text p{
    margin-bottom: 20px;
    margin-left: 20px;
    color: #4c4c4c;
  }
  .block{
    height: 500px;
  }
</style>
