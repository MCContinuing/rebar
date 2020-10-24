import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
import qs from 'qs'

import FastClick from 'fastclick'
FastClick.attach(document.body)
import "font-awesome/css/font-awesome.css"

// vant UI
// 文件上传组件
import {Uploader} from 'vant'
import {Button} from 'vant'
import {Notify} from 'vant'
import {Tab, Tabs} from 'vant'
import { Image } from 'vant';
import { ImagePreview } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Icon } from 'vant';
import { Popup } from 'vant';
import { Calendar } from 'vant';
import { Field } from 'vant';
import { Picker } from 'vant';
import { Stepper } from 'vant';
import { Dialog } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { PullRefresh } from 'vant';
import { SwipeCell } from 'vant';
import { Toast } from 'vant';
import { Circle } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import { NoticeBar } from 'vant';
import { Panel } from 'vant';
import { Form } from 'vant';
import { Lazyload } from 'vant';
import { Col, Row } from 'vant';
import { Divider } from 'vant';
import { Card } from 'vant';
import { Tag } from 'vant';
import { NumberKeyboard } from 'vant';
import { Switch } from 'vant';
import { Sticky } from 'vant';
import {ADD_ALL_BAR_INFO, ADDPROFILE} from "./store/mutations-types";

Vue.use(Sticky);
Vue.use(Switch);
Vue.use(NumberKeyboard);
Vue.use(Tag);
Vue.use(Card);
Vue.use(Divider);
Vue.use(Col);
Vue.use(Row);
Vue.use(Lazyload);
Vue.use(Form);
Vue.use(SwipeItem);
Vue.use(Panel);
Vue.use(NoticeBar);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Circle);
Vue.use(Toast);
Vue.use(SwipeCell);
Vue.use(PullRefresh);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);
Vue.use(Stepper);
Vue.use(Picker);
Vue.use(Field);
Vue.use(Calendar);
Vue.use(Popup);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Button);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(ImagePreview);
Vue.use(Image);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Button);
Vue.use(Uploader);
Vue.use(Notify);

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App),

  created(){

    //第一次登陆
    let lever ;
    if(qs.parse(localStorage.getItem("isLogin")).lever){
      this.$store.commit(ADDPROFILE,qs.parse(localStorage.getItem("isLogin")));
      lever=qs.parse(localStorage.getItem("isLogin")).lever;
      if(lever==="1"){
        this.$router.replace('/admlogin')
        console.log('已跳转管理员界面');
      }
      if(lever==="0"){
        this.$router.replace('/emplogin');
        console.log('已跳转员工界面');
      }
    }
  }
}).$mount('#app')
