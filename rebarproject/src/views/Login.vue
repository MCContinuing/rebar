<template>
  <div class="login">
    <div class="icon-box">
      <div class="icon-user">
        <i class="fa fa-user-circle-o fa-5x "   aria-hidden="true"></i>
      </div>
    </div>

    <van-form @submit="onSubmit" class="form">
      <van-field
        readonly
        clickable
        name="lever"
        :value="value"
        label="选择身份"
        placeholder="点击选择身份"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>

      <van-field
        v-model="username"
        name="username"
        label="工号"
        placeholder="工号"
        :rules="[{ validator, message: '请填写工号' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>


</template>

<script>
  import MainTabBar from "components/content/MainTabBar";
  import { Toast } from 'vant';
  import { getlogin,getAllBarInfo} from "network/login";
  import {
    ADDPROFILE
  } from 'store/mutations-types';

  import qs from 'qs';
  import {ADD_ALL_BAR_INFO} from "../store/mutations-types";

  export default {
    name: "Login",
    components:{
      MainTabBar
    },
    data(){
      return{
        username: '',
        password: '',
        select:0,
        radio: '0',
        value: '员工',
        columns: ['员工','管理员' ],
        showPicker: false,
      }
    },
    methods:{
      /**
       * 网络请求相关方法
       */
      getAllBarInfo(){
        getAllBarInfo().then(res=>{
          this.$store.commit(ADD_ALL_BAR_INFO,res);
          console.log('钢筋信息');
          console.log(this.$store.state.allBarInfo);
        })
      },
      onSubmit() {
        // console.log(this.username);
        // console.log(this.password);
        // console.log(this.select);
        getlogin(this.username,this.password,this.select).then(res => {
          //判断用户名密码是否正确
          if(res===null){
            Toast('用户名或密码错误')
          }
          else if(res){
            console.log(res);
            this.$store.commit(ADDPROFILE,res)
            this.$store.commit('isLog',res)
            this.select=res.lever
            //0登陆员工界面
            if(this.select === 0){
              this.$router.replace('/emplogin');
              console.log('已跳转员工界面');
            }
            this.getAllBarInfo();
            //1登陆管理员界面
            if(this.select === 1){
              this.$router.replace('/admlogin')
              console.log('已跳转管理员界面');
            }
          }
          else{
            console.log(res);
            Toast('登陆失败')
          }
        }).catch(err => {
          console.log(err)
        })

      },


      onConfirm(value, index) {
        this.showPicker=false
        //1是管理员，0是员工
        this.value = value
        this.select = index
        console.log(this.value)
        console.log(this.select)
        Toast.setDefaultOptions({ duration: 1000 });
        Toast(`您已选择：${value}`);
      },
      onCancel() {
        Toast('取消');
      },
      validator(val) {
        return /\w/.test(val);
      },
    }
  }

</script>

<style scoped>
  .login{
    background-color: #fff;
    height: 100vh;
  }
  .icon-box{
    padding-top: 30px;
    padding-bottom: 15px;

  }
  .icon-user{
    margin: 0 auto;
    width: 80px;
    /*height: 100px;*/
  }
</style>
