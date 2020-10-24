//删除相同元素
export function  delCom(array){
  var n = [array[0]]; //结果数组
  //从第二项开始遍历
  for(var i = 1; i < array.length; i++) {
    //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
    //那么表示第i项是重复的，忽略掉。否则存入结果数组
    if (array.indexOf(array[i]) == i) n.push(array[i]);
  }
  return n;
}

//根据empName找empId/通过value获取key
export function findKey (obj,value, compare = (a, b) => a === b) {
  return Object.keys(obj).find(k => compare(obj[k], value));
}
//this.findKey(this.$store.state.emps,value);

//根据empId找empName/通过key获取value
export function findValue (obj,key) {
  return eval("obj."+key);
}

//根据钢筋id找钢筋name
export function getBarName(obj,id) {
  for(let i = 0; i<obj.length;i++){
    if(obj[i].id === id){
      return obj[i].barName;
    }
  }
}
//this.findKey(this.$store.state.emps,key);

//获取时间
export function  getTime(time){
  let date = new Date(time);
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
  time = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
  return time;
}
