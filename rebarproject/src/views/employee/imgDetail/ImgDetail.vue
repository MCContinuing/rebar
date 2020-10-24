<template>
    <div id="imgDetail">
      <ImgDetNavBar></ImgDetNavBar>

      <van-cell-group>
        <van-cell title="目标数量" :value="gotaskDetail[0].kindall[barindex].kindnum" />
        <van-cell title="检测数量" :value="testSteelNum" />
        <van-cell title="图片数量" :value="resImageInfo.length" />
      </van-cell-group>

      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        提交结果
      </van-divider>

      <van-cell center title="手动输入" >
        <template #right-icon>
          <van-switch v-model="checked" size="24" />
        </template>
      </van-cell>
      <!-- 允许输入正整数，调起纯数字键盘 -->
      <van-field v-show="checked" v-model="value" type="digit" label="钢筋总数"  placeholder="输入钢筋总数"/>
      <van-cell :title="titleValve" center >
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon >
          <van-button @click="updataBar">确认提交</van-button>
        </template>
      </van-cell>

      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        详情信息
      </van-divider>
<!--      <van-divider>文字</van-divider>-->
      <template v-for="(item,index) in resImageInfo">
        <van-card
          :num="item.testSteelNum"
          desc="点击图片可预览"
          title="图片详情"
          :thumb="item.imageUrl"
          @click-thumb="imgPre(index)"
        >
          <template #tags>
            <van-tag plain >图片编号：{{item.id}}</van-tag>
          </template>
          <template #bottom>
            <van-tag plain type="danger">已检测</van-tag>
          </template>
          <template #footer>
            <van-button size="mini" @click="redNum(index)">
              <i class="fa fa-minus" aria-hidden="true"></i>
            </van-button>
            <van-button size="mini" @click="addNum(index)">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </van-button>
            <van-button size="mini" @click="delTask(index)">删除</van-button>
          </template>
        </van-card>
      </template>

      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        继续添加
      </van-divider>
      <div class="imgs">
        <div class="uploader">
          <van-uploader :after-read="afterRead"  :max-count="1" multiple v-model="fileList"
                        upload-text="钢筋检测" capture="camera" accepte="image/*"/>
        </div>
      </div>
      <div class="button">
        <van-button class="button-up" type="info" icon="checked" color="var(--color-button)" block @click="fileUploader">上传检测</van-button>
      </div>


      <van-cell title="目标数量" :value="kindnum" />
    </div>
</template>

<script>
    import ImgDetNavBar from "./ImgDetNavBar";
    import {Dialog,Toast,ImagePreview} from 'vant';
    import {testSmallTask,deleteImage,updateSmallTaskBarInfo} from "../../../network/upimage";
    import {ADD_INDEX, CHANGE_TASKATATE, DEL_IMG_INFO} from "../../../store/mutations-types";

    export default {
      name: "ImgDetail",
      components: {
        ImgDetNavBar,
        [Dialog.Component.name]: Dialog.Component
      },
      data(){
        return{
          id:null,
          iid:null,
          barindex:null,
          resImageInfo:this.$store.state.resImageInfo,
          kindnum:0,
          testSteelNum:0,
          fileList: [],
          imageList: [],
          gotaskDetail: [],
          index:null,
          show: true,//显示数字键盘
          value: '',//键盘输入的值
          checked: false,//是否选择手动输入
          relAllNum:0,//实际钢筋数量
          flag:true,
        }
      },
      computed:{
        //返回环形进度条文本
        // text() {
        //   return this.currentRate.toFixed(0) + '%'
        // }
        titleValve(){
          if(this.checked){
            this.relAllNum = this.value;
          }
          else{
            this.relAllNum = this.testSteelNum
          }
          return '待提交实际钢筋总数 '+this.relAllNum
        }
      },
      created() {
        //1.保存传入的任务iid
        this.iid = this.$route.params.iid;
        this.id = this.$route.params.id;
        this.barindex = this.$route.params.barindex
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
        console.log(this.gotaskDetail[0]);
        this.getAllNum();
      },

      methods:{
        //
        //向数据库更新钢筋数据
        updataBar(){
          this.fileList = [];
          let sTaskId = this.gotaskDetail[0].taskIID;
          let barId = this.resImageInfo[0].barId;
          let testNum = this.relAllNum;
          let testStatus = 1;
          updateSmallTaskBarInfo(sTaskId,barId,testNum,testStatus).then(res=>{
            //判断任务中所有钢筋类型是否都检测完成
            //判断数据库更新是否成功
            //数据库更新成功
            if(res==='ok'){
              console.log(res);
              this.$store.commit(ADD_INDEX,this.barindex);
              this.hasTaskAll();
              if(this.flag){
                //如果所有任务均完成 更改数据库任务数据
                this.updata();
              }
              else {
                //如果没有检测完成 返回任务页
                Toast('提交成功');
                this.$router.back();
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
        //向数据库更改任务数据
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
                  this.$store.commit(ADD_INDEX,this.barindex)
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
        //判断是否所有类型都检测完毕
        hasTaskAll(){
          for(let i = 0; i < this.gotaskDetail[0].kindall.length; i++){
            if(this.gotaskDetail[0].kindall[i].testStatus!==1){
              this.flag = false;
            }
          }
        },
        //根据id判断位置
        getIndex(id) {
          this.index = this.resImageInfo.findIndex(item => item.id === id)
        },
        //删除相关图片信息
        delTask(index){
          this.getIndex(this.resImageInfo[index].id)
          if(this.resImageInfo.length!==1){
            deleteImage(this.resImageInfo[index].id).then(res=>{
              if(res==='ok'){
                this.resImageInfo.splice(this.index,1)
                Toast('删除成功');
                this. getAllNum();
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
              message: '删除全部图片信息后会回到初始检测页面，重新检测此任务，是否仍然确认删除'
            }).then(() => {
              // on confirm
                deleteImage(this.resImageInfo[index].id).then(res=>{
                  this.$store.commit(DEL_IMG_INFO)
                }).catch(err=>{
                  console.log(err);
                })
              this.$router.back()
            }).catch(() => {
              // on cancel弹框取消按钮
            });
          }
        },
        //查看图片
        imgPre(index){
          ImagePreview({
            images: [this.resImageInfo[index].imageUrl],
            closeable: true
          });
        },
        //计算钢筋总数
        getAllNum(){
          let num = 0;
          if(this.resImageInfo.length !== 0){
            for(let i =0 ; i < this.resImageInfo.length;i++){
              num += this.resImageInfo[i].testSteelNum;
            }
            this.testSteelNum = num;
          }
        },
        //增加钢筋检测结果数量
        addNum(index){
          this.resImageInfo[index].testSteelNum++;
          this.testSteelNum++
        },
        //减少钢筋检测结果数量
        redNum(index){
          this.resImageInfo[index].testSteelNum--;
          this.testSteelNum--
        },
        /**
         * 任务完成后自动跳出
         */
        goBackTask(){
          this.$store.state.skip=true;
          this.$router.replace('/task')

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
         * 文件上传
         */
        fileUploader() {
          console.log('点击了')
          // 检测是否选择图片
          if (this.fileList.length === 0) {
            this.$notify({type: 'warning', message: '请选择需要的图片'})
            return
          }

          // 设置文件上传状态
          this.setFileUploaderStatus(0, '上传中')
          for(let i = 0; i < this.fileList.length; i++){
            this.setFileUploaderStatus(0, '上传中');
            // 将数据进行FormData处理
            let fd = new FormData()
            let sTaskId = this.resImageInfo[i].taskIID;
            let barId = this.resImageInfo[i].barId;
            let image = this.fileList[i];
            let barName = this.resImageInfo[i].barName;
            fd.append('image', image.file, image.file.name);
            fd.append('sTaskId',sTaskId);
            fd.append('barId',barId);
            fd.append('barName',barName);
            //发送检测图片请求
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
                this.resImageInfo.push({
                  barId:res.barId,
                  id:res.id,
                  imageUrl:res.imageUrl,
                  sTaskId:res.sTaskId,
                  status:res.status,
                  testSteelNum:res.testSteelNum,
                })
                //计算已检测总数
                this.getAllNum();
                this.fileList = [];
                Toast.success('添加成功');
              }
              console.log(this.resImageInfo);
            }).catch(err=>{
              this.setFileUploaderStatus(1, '请求失败')
              console.log(err);
            })
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
  .imgs {
    /*background-color:rgba(225,225,225,0.2);*/
    margin: 8px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow:  0px 2px 2px 3px rgba(0,0,0,0.02);
    text-align: center;
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
  .img p{
    padding: 20px;
    color: #303030;
  }
  .uploader{
    padding: 20px;
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
</style>
