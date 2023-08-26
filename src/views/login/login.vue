<template>
    <div class="login-container">
      <el-form class="login-form">
        <div class="title-container">
          <h3 class="title">Data Analysis Platform</h3>
        </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          id="id_username"
          type="text"
          name="username"
          placeholder="Please enter username"
          v-model="userName"
          autofocus=""
          required=""
          @keypress.enter.native="Login" />
      </el-form-item>
        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input
            id="id_password"
            :type="passwordType"
            name="password"
            v-model="passWord"
            placeholder="Please enter password"
            required=""
            @keypress.enter.native="Login" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
        <el-button  type="primary" style="width:100%;margin-bottom:30px;"  @click="Login" >Login</el-button>
      </el-form>
    </div>
</template>

<script>
    import { getLocalStore, clearLocalStore,setLocalStore } from '@/utils/storageUtil'
    import { login, queryToken2Token, queryUser} from '../../api/api';
    export default {
        name: "login",
        data(){
          return{
            userName:'',
            passWord:'',
            userId:'',
            passwordType: 'password',
            redirect:undefined,
            repath:undefined,
            tryTime:0
          }
        },
      watch: {
        $route: {
          handler: function(route) {
            this.redirect = route.query;
          },
          immediate: true
        }
      },
        methods:{
          Login(){
            clearLocalStore();
            login({
              username:this.userName,
              password:this.passWord
            })
            .then((response)=> {
              //本地存储用户信息
              if(typeof(response.data.msg)!=="undefined"){
                alert('Account has been locked,please connect wangyichengsh@outlook.com to unlock,Thanks!');
                return
              }
              setLocalStore('token',response.data.token);
              setLocalStore('name',this.userName);
              queryUser({ params: {username:this.userName}} ).then((response) =>{
                this.userId = response.data[0].id;
                setLocalStore('userId',this.userId);
              }).catch(function (error) {console.log(error);});
              this.$store.commit('setInfo');
              //跳转到首页页面
              if(this.repath) {
                setTimeout(this.$router.push({ path: this.repath ,query:this.redirect }), 1000 );
              }
              else {
                setTimeout( this.$router.push({ name: 'taskList',query:{'tabStart':'my'} }), 1000 );
              }

            })
            .catch(function (error) {
              alert('Login failed');
              console.log(error);
            });
          },
          showPwd() {
            if (this.passwordType === 'password') {
              this.passwordType = ''
            } else {
              this.passwordType = 'password'
            }
            this.$nextTick(() => {
              this.$refs.password.focus()
            })
          },
        },
      created(){
        clearLocalStore();
        var pd = this.$route.query.password;
        var un = this.$route.query.username;
        if (pd){
              this.passWord=pd;
        }
        if (un){
              this.userName=un;
        }
        var ngsp_token = this.$route.query.token;
        // 从新监察token获取用户名并对应到服务站的token
        this.repath = this.redirect['redirect'];
        if (ngsp_token){
          queryToken2Token(ngsp_token).then((response) => {
            var token = response.data.token;
            var name = response.data.name;
            if(name) {
              setLocalStore('ngsp_token',ngsp_token);
              setLocalStore('token',token);
              setLocalStore('name',name);
              queryUser({ params: {username:name}} ).then((response) =>{
                this.userId = response.data[0].id;
                setLocalStore('userId',this.userId);
              }).catch(function (error) {console.log(error);});
              if(this.repath) {
                setTimeout(this.$router.push({ path: this.repath ,query:this.redirect }), 1000 );
              }
              else {
                setTimeout( this.$router.push({ name: 'taskList',query:{'tabStart':'my'} }), 1000 );
              }
            }
          }).catch(function (error) {console.log(error);});
        }
      },
      mounted() {
      }
    }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
