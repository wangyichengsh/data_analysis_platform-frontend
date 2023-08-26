<template>
  <div>
    <div id="header">
      <div id="branding">
        <router-link :to="{ name: 'taskList'}"><h1 class="site-name">驻场服务站</h1></router-link>
      </div>
      <div id="user-tools">
        欢迎，
        <strong>{{ fullName }}</strong>
        <router-link :to="{ name: 'history' }">历史记录</router-link>
        /
        <router-link :to="{ name: 'password_change' }">修改密码</router-link>
        /
        <router-link :to="{ name: 'login' }">注销</router-link>
      </div>
    </div>
    <el-menu
      class="main-mena"
      mode="horizontal"
      :default-active="menuSelect"
      @select="handleSelect"
      background-color="#5393a5"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1" style="margin-left: 35px;font-size: 17px;height:51px;" ><router-link :to="{ name: 'taskList'}" >需求管理</router-link></el-menu-item>
      <el-menu-item index="2" style="font-size: 17px;margin-left:2%;height:51px;"> <router-link :to="{ name: 'modelTaskList'}" >已固化需求</router-link> </el-menu-item>
      <el-menu-item index="3" style="font-size: 17px;margin-left:2%;height:51px;" disabled >专项任务</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
    import cookie from '../../static/js/cookie';
    import {bk_host,file_host,channel_host,queryUser} from  '../../api/api'
    export default {
        name: "header",
        data(){
            return{
              username:cookie.getCookie('name'),
              userId:"",
              isStaff:"",
              menuSelect:"1",
              fullName:""
            }
        },
      created() {
        const username = cookie.getCookie('name');
        if(cookie.getCookie('name')===null){
          this.$router.push({ name: 'login' });
        }
        let modelTask = this.$route.query.modelTask;
        console.log(modelTask);
        if (modelTask === "true"){
          this.menuSelect = "2";
        };
        queryUser({ params: {username:cookie.getCookie('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
          this.userId = response.data[0].id;
          this.fullName = response.data[0].full_name;
          let ws = new WebSocket(channel_host+"/ws/web/"+String(this.userId)+"/");
          ws.onopen = function () {
            console.log('任务完成提醒已开启');
          };
          ws.onmessage = function (evt) {
            var received_msg = evt.data;
            var msg = JSON.parse(received_msg)['message'];
            console.log(msg);
            alert(msg);
          };
          ws.onclose = function () {
            // 关闭 websocket
            console.log("任务完成提醒已关闭");
          };
        }).catch(function (error) {console.log(error);});
      },
      methods:{
        handleSelect() {}
      }
    }
</script>

<style>
  #header{
    width:auto;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 40px;
    background:#417690;
    color:#ffc;
    overflow: hidden;
  }
  #header a{
    color:#fff;
  }
  #user-tools a{
    border-bottom: 1px solid rgba(255,255,255,0.25);
  }
  a:link{
    text-decoration: none;
  }
  .site-name{
    font-size: 24px;
    color:#f5dd5d;
    text-decoration:none;
    font-weight:300;
    padding:0;
    margin:0 20px 0 0;
  }
  div.menu{
    display: flex;
    background: #5393a5;
    padding:10px 40px;
    border:none;
    font-size:14px;
    color:white;
    text-align:left;
  }
  .main-mena{
    font-size: 18px;
    color: #f2fffc;
    text-decoration:none;
    font-weight:300;
    padding:0;
    border-bottom: none !important;
    height:53px;
  }
</style>
