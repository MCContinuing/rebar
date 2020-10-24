<template>
  <div id="gotask">
    <NavBar>
      <div slot="left" class="back">
        <img src="~assets/img/common/back.svg" alt="" @click="backClick">
      </div>
      <div slot="center">立即检测</div>
    </NavBar>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3">

      <p class="title">待检测任务</p>
      <div class="gotask-text">
        <p>任务编号：{{gotaskDetail[0].bigTaskId}}</p>
        <p>车辆编号:{{gotaskDetail[0].taskCar}}</p>
        <p>钢筋总数：{{gotaskDetail[0].num}}</p>
        <div class="kinds-p">
          <p v-for="item in gotaskDetail[0].kindall">{{item.kindname}}：{{item.kindnum}}
            <i v-if="item.testStatus !== 1" class="fa fa-frown-o" aria-hidden="true"></i>
            <i v-else class="fa fa-smile-o iconcolor" aria-hidden="true" ></i>
          </p>
        </div>
      </div>
      <van-dropdown-menu>
        <van-dropdown-item v-model="value" :options="option" />
      </van-dropdown-menu>
      <p class="title">拍照检测</p>
            <div class="uploader">
              <van-uploader :after-read="afterRead"  multiple v-model="fileList"
                            upload-text="钢筋检测" capture="camcorder" accepte="image/*"/>
            </div>
      <div class="button">
        <van-button class="button-up" type="info" icon="checked" color="var(--color-button)" block @click="fileUploader">上传检测</van-button>
      </div>
    </Scroll>
<!--    检测成功弹框-->
    <van-dialog v-model="show" title="检测成功">
      <p class="dialog-p">
        <i class="fa fa-bar-chart" aria-hidden="true"></i>
        已检测
      </p>
      <p v-for="item in gotaskDetail[0].kindall" v-if="item.testStatus===1" class="dialog-list">
        {{item.kindname}}：{{item.kindnum}}
        <i class="fa fa-check fa-check-pos" aria-hidden="true"></i>
      </p>
      <p class="dialog-p">
        <i class="fa fa-bar-chart" aria-hidden="true"></i>
        未检测
      </p>
      <p v-for="item in gotaskDetail[0].kindall" v-if="item.testStatus!==1" class="dialog-list">
        {{item.kindname}}：{{item.kindnum}}
      </p>
    </van-dialog>
<!--    检测数量不匹配弹框-->
    <van-dialog v-model="showNumFalse" title="检测数量不匹配"
                show-cancel-button
                confirm-button-text="查看详情" @confirm="goImgDetil"
                cancel-button-text="重新检测" @cancel="delImgInfo">
      <div class="dialog-img">
        <p class="dialog-msg1">
          {{msg1}}
        </p>
      </div>
    </van-dialog>
<!--    展现环形进度条-->
    <van-dialog v-model="showCircle" title="正在检测,请耐心等待"
                :show-cancel-button=isfalse
                :show-confirm-button=isfalse
                width="240px"
                cancel-button-text="取消检测" >
      <div class="dialog-circle">
        <van-circle
          v-model="currentRate"
          :rate="rate"
          :speed="100"
          :color="gradientColor"
          layer-color="#ebedf0"
          :text="text"
        />
      </div>
    </van-dialog>
  </div>

</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from "../../../components/common/scroll/Scroll";
  import {testSmallTask,updateSmallTask,deleteImage,updateSmallTaskBarInfo,discordImage} from "network/upimage";
  import {ADD_IMG_INFO, ADD_INDEX, CHANGE_TASKATATE, DEL_IMG_INFO, DEL_INDEX} from "../../../store/mutations-types";
  import {Dialog,Toast,ImagePreview} from 'vant';
  import {upData} from "../../../network/detection";


  export default {
    name: "GoTask",
    components: {
      NavBar,
      Scroll,
      [Dialog.Component.name]: Dialog.Component,
    },
    data() {
      return {

        rate:0,//控制环形进度
        showCircle:false,//请求时显示环形进度条
        currentRate: 0,//环形进度条初始为0
        gradientColor: {
          '0%': '#3fecff',
          '100%': '#6149f6'
        },//进度条时间
        isfalse :false,//绑定false
        showFalse:false,//如果检测失败，显示失败
        showBadNum:true,//所有图片正常完成检测后，才显示，数量不一致
        testSteelNum:0,//存储钢筋类型总数
        barAllNum:0,//存储所有总数
        resImageInfo:[],//检测返回的图片相关信息，包括数量，id,url
        msg1:null,//数量检测不一致返回的信息
        imgUrl:'',
        showNumFalse:false,
        show: false,//决定自定义组件是否出现
        iid: null,
        id: null,
        fileList: [],
        imageList: [],
        gotaskDetail: [],
        flag:false,//为true时，任务检测完成
        value: 0,//选择钢筋种类
        option: [
          {text: '选择类型', value: 0},
        ],
      }
    },
    computed:{
      // testSteelNum: function () {
      //   let num = 0;
      //
      //   return
      // }
      //保存跳转出错时的option下标
      indexStu(){
        if(this.$store.state.indexStu){
          this.gotaskDetail[0].kindall[this.$store.state.indexStu].testStatus=1;
          this.$store.commit(DEL_INDEX)
        }
        return this.$store.state.indexStu;
      },
      //返回环形进度条文本
      text() {
        return this.currentRate.toFixed(0) + '%'
      }
    },


    created() {
      //1.保存传入的任务iid
      this.iid = this.$route.params.iid;
      this.id = this.$route.params.id;
      //2根据iid寻找相应的任务详情信息
      this.gotaskDetail = this.$store.state.newList.filter(item => item.id === parseInt(this.id));
      if(this.gotaskDetail.length === 0){
        this.gotaskDetail = this.$store.state.newList.filter(item => item.id === this.id)
      }
      if (this.gotaskDetail.length === 0) {
        this.gotaskDetail = this.$store.state.oldList.filter(item => item.id === parseInt(this.id))
      }
      if (this.gotaskDetail.length === 0) {
        this.gotaskDetail = this.$store.state.oldList.filter(item => item.id === this.id)
      }
      this.gotaskDetail = this.gotaskDetail[0].taskIDList;
      this.gotaskDetail = this.gotaskDetail.filter(item => item.iid === parseInt(this.iid));
      // console.log(this.gotaskDetail[0]);
      //将状态改为已检测

      //获取所有钢筋类型信息
      for (let i = 0; i < this.gotaskDetail[0].kindall.length; i++) {
        this.option.push({
          text: this.gotaskDetail[0].kindall[i].kindname,
          value: i+1,
        })
      }

    },

    updated() {
      // console.log('value');
      // console.log(this.value);
    },
    mounted() {
      //将跳回的任务变为已完成
      // console.log(this.$store.state.indexStu);
      if(this.$store.state.indexStu){
        this.gotaskDetail[0].kindall[this.$store.state.indexStu].testStatus=1;
        this.$store.commit(DEL_INDEX);
        // console.log("便状态了");
      }
      //判断任务是否都检测完毕
      //都检测完毕提交数据
      this.hasTaskAll();
      // console.log('flag' + this.flag);
      // console.log('skip' + this.$store.state.skip);
      if(this.flag){
        // console.log('111');
        this.updata();
        this.$store.state.skip=false;
      }
    },

    methods: {
      /**
       * 网络请求相关方法
       */

      //向数据库更新钢筋数据
      updataBar(){
        this.fileList = [];
        this.gotaskDetail[0].kindall[this.value-1].tastnum = this.resImageInfo;
        let sTaskId = this.gotaskDetail[0].taskIID;
        let barId = this.resImageInfo[0].barId;
        let testNum = this.testSteelNum;
        let testStatus = 1;
        updateSmallTaskBarInfo(sTaskId,barId,testNum,testStatus).then(res=>{
          //判断任务中所有钢筋类型是否都检测完成
          this.flag = true;
          //判断数据库更新是否成功
          //数据库更新成功
          if(res==='ok'){
            let ids = {
              id:this.id,
              iid:this.iid,
              barId:barId,
              testNum: testNum
            }
            console.log(res);
            this.gotaskDetail[0].kindall[this.value-1].testStatus=1
            for(let i = 0; i < this.gotaskDetail[0].kindall.length; i++){
              if(this.gotaskDetail[0].kindall[i].testStatus!==1){
                this.flag = false;
              }
            }
            if(this.flag){
              //如果所有任务均完成 更改数据库任务数据
              this.updata();
            }
            else {
              //如果没有检测完成 继续提示用户检测状态
              this.show = true;
            }
            this.resImageInfo = [];
          }
          //数据库更新失败
          else{
            Dialog.alert({
              title: '失败',
              message: '数据库更新失败，请重新检测'
            }).then(() => {
              this.resImageInfo = [];
            });
          }
        })
      },

      //向数据库更新任务数据
      updata(){
        //将钢筋改成已检测
        let sTaskId = this.gotaskDetail[0].taskIID;
        let ids = {
          id:this.id,
          iid:this.iid
        }
        updateSmallTask(sTaskId).then(res=>{

          //判断数据库更新是否成功
          //数据库更新成功
          if(res==='ok'){
            //提示用户任务检测完成，即将退出
            Dialog.alert({
              title: '任务完成',
              message: '您已完成本次任务，点击回到任务列表'
            }).then(() => {
              if(this.gotaskDetail[0].state === '未检测')
                //改变小任务状态为已经检测
                this.$store.commit(CHANGE_TASKATATE,ids);
              //跳转到任务列表
              this.goBackTask();
            });
          }
          //数据库更新失败
          else{
            Dialog.alert({
              title: '失败',
              message: '数据库更新失败，请重新检测'
            }).then(() => {

            });
          }
          console.log(res);
        }).catch(err=>{
          Toast.fail('数据更新失败');
        })
      },



      /**
       * 按钮点击相关操作
       */
      //用户选择重新检测时，清除已检测所有检测图片信息
      delImgInfo(){
        for(let i =0 ; i < this.resImageInfo.length;i++) {
          deleteImage(this.resImageInfo[i].id).then(res=>{
            // console.log(res);
            this.resImageInfo = [];
            this.fileList=[];
          }).catch(err=>{
            console.log(err);
          })
        }
      },


      /**
       * 数据操控相关操作
       */
      //计算钢筋总数
      getAllNum(){
        let num = 0;
        if(this.resImageInfo.length !== 0){
          for(let i =0 ; i < this.resImageInfo.length;i++){
            num += this.resImageInfo[i].testSteelNum;
            console.log(num);
          }
          this.testSteelNum = num;
        }
      },
      //判断是否所有类型都检测完毕
      hasTaskAll(){
        this.flag = true;
        for(let i = 0; i < this.gotaskDetail[0].kindall.length; i++){
          console.log('teststate');
          console.log(this.gotaskDetail[0].kindall[i].testStatus);
          if(this.gotaskDetail[0].kindall[i].testStatus!==1){
            //false时代表未检测完毕
            this.flag = false;
          }
        }
      },

      //如果数量不一致,显示的信息
      setMsg1(){
        this.msg1='目标数量：'+this.gotaskDetail[0].kindall[this.value-1].kindnum + ' —— 检测结果：' + this.testSteelNum
      },

      /**
       * 文件上传
       */
      fileUploader() {
        if(this.value===0){
          Toast.fail("请选择待检测钢筋类型")
          return
        }
        console.log('点击了')
        // 检测是否选择图片
        if (this.fileList.length === 0) {
          Toast.fail("请选择检测图片")
          // this.$notify({type: 'warning', message: '请选择需要的图片'})
          return
        }

        // 设置文件上传状态
        this.setFileUploaderStatus(0, '上传中')
        this.testSteelNum = 0;
        this.showCircle = true;
        this.rate = 0;
        let rateTop = 0.0;
        for(let i = 0; i < this.fileList.length; i++){
          console.log("循环"+i+"次了");
          this.setFileUploaderStatus(0, '上传中');
          // 将数据进行FormData处理
          let fd = new FormData()
          let sTaskId = this.gotaskDetail[0].taskIID;
          let barId = this.gotaskDetail[0].kindall[this.value-1].barId;
          let image = this.fileList[i];
          let barName = this.option[this.value-1].text;
          fd.append('image', image.file, image.file.name);
          fd.append('sTaskId',sTaskId);
          fd.append('barId',barId);
          fd.append('barName',barName);
          //发送检测图片请求
          let tep = rateTop+1/(this.fileList.length*2);
          tep = tep.toFixed(2);
          this.rate = tep*100;
          testSmallTask(fd).then(res=>{
            rateTop += 1;
            let tep = rateTop/this.fileList.length;
            tep = tep.toFixed(2);
            this.rate = tep*100;
            if(res==='false'){
              Toast.fail('检测失败');
              this.setFileUploaderStatus(1, '检测失败')
              this.showFalse = true;
              this.showBadNum = false;
            }
            else if(!res){
              this.setFileUploaderStatus(1, '失败，无返回')
              Toast.fail('检测失败');
              this.showFalse = true;
              this.showBadNum = false;
              // this.delImgInfo();
            }
            else{
              this.setFileUploaderStatus(2, '检测成功')

              // console.log(this.gotaskDetail[0].kindall[this.value-1].kindnum);
              this.resImageInfo.push({
                barId:res.barId,
                id:res.id,
                imageUrl:res.imageUrl,
                sTaskId:res.sTaskId,
                status:res.status,
                testSteelNum:res.testSteelNum,
              })
              this.getAllNum();
              //最后一张图片循环后，显示弹框
              if(this.resImageInfo.length === this.fileList.length && !this.showFalse) {
                this.showCircle=false;
                //判断数量与目标数量是否一致
                if (this.testSteelNum === this.gotaskDetail[0].kindall[this.value-1].kindnum) {
                  Dialog.confirm({
                    title: '检测成功',
                    message: '检测结果与目标一致，点击确认提交数据'
                  }).then(() => {
                    //发送消息，更新数据库
                    console.log('准备更库');
                    this.updataBar();
                  }).catch(() => {
                    // dialog中取消数据提交
                  });
                }
                //如果数目不匹配
                else {
                  this.setMsg1();//设置提示文字
                  this.showNumFalse = true;
                }
              }
            }
            console.log(this.resImageInfo);
          }).catch(err=>{
            this.delImgInfo();
            this.setFileUploaderStatus(1, '请求失败')
            console.log(err);
            Toast.fail('请求失败');
            this.showBadNum = false;
          })
        }
      },

      /**
       * 路由跳转相关操作
       */
      //去图片详情页
      goImgDetil() {
        let id = this.id;
        let iid = this.iid;
        let barindex = this.value-1
        this.$store.commit(DEL_IMG_INFO);
        this.$store.commit(ADD_IMG_INFO,this.resImageInfo);
        console.log(this.$store.state.resImageInfo);
        this.$router.push('/imgDetail/'+id+'/'+iid+'/'+barindex);
      },
      //返回上一页
      backClick(){
        this.$router.back()
      },
      //任务完成后自动跳出
      goBackTask(){
        if(this.flag){
          this.$router.replace('/task')
        }
      },



      /**
       * 图片选择后的回调方法
       */
      afterRead(files) {
        for (let i = 0; i < files.length; i++) {
          // console.log(files[i].file)
          // console.log(files[i].file.name)
        }
      },






      /**
       * 预览图片
       */
      showImage(src) {
        console.log(src)
        ImagePreview({
          images: [src],
          closeable: true
        });
      },

      /**
       * 设置文件上传状态
       *
       */
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
  #gotask{
    height: 100vh;
  }
  .title{
    padding-top: 10px;
    padding-left: 10px;
    font-size:16px;
    font-weight: bold;
    color: #303030;
  }
  .imgs {
    /*background-color:rgba(225,225,225,0.2);*/
    margin: 8px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow:  0px 2px 2px 3px rgba(0,0,0,0.02);
  }

  .img p{
    padding: 20px;
    color: #303030;
  }
  .uploader{
    padding: 10px;
  }
  .button{
    text-align: center;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .button-up{
    width: 300px;
    margin: 0 auto;
  }
  .content{
    /*height: 100px;*/
    /*background-color: #d3dbff;*/
    background-color: #fff;
    /*overflow: hidden;*/
    overflow: hidden;
    position: absolute;
    top:45px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .gotask-text{
    margin: 8px;
    padding-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow:  0px 2px 2px 3px rgba(0,0,0,0.02);
  }
  .gotask-text p{
    margin-bottom: 20px;
    margin-left: 20px;
    color: #4c4c4c;

  }
  .kinds-p{
    margin-left: 40px;
    width: 250px;
    padding-bottom: 12px;
    /*height: 70px;*/
    /*background-color:var(--color-betailbody-kind);*/
    /*background-color: #fff;*/
  }
  .back img{
    width: 26px;
    height: 26px;
    margin-top: 11px;
  }
  .iconcolor{
    color: #1880D0;
  }
  .dialog-p{
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .dialog-list{
    padding-left: 80px;
    padding-bottom: 10px;

  }
  .fa-check-pos{
    margin-left: 10px;
  }
  .dialog-img{
    text-align: center;
  }
  .dialog-msg1{
    padding-top: 10px;
    padding-bottom: 20px;
  }
  .swipe-img{
    width: 300px;
  }
  .dialog-circle{
    text-align: center;
    padding: 30px;
  }
  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.7);
  }
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>
