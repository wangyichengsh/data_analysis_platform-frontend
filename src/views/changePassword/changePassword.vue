<template>
  <div id="changePassword">
    <div class="breadcrums">
      <a>首页</a> &nbsp;›
      <a>密码修改</a>
    </div>
    <div class="content">
      <h1>密码修改</h1>
      <div id="content-main">
        <p>请输入你的旧密码，为了安全起见，接着要输入两遍新密码。以便我们校验你的输入是否正确</p>
        <div class="passParam">
          <div class="tip">{{ tip1 }}</div>
          <label class="passwdtTitle">旧密码:</label>
            <input type="password" name="old_password"  v-model:value="old_password">
        </div>
        <div class="passParam">
          <label class="passwdtTitle">新密码:</label>
          <input type="password" name="new_password"  v-model:value="new_password">
        </div>
        <div class="passParam">
          <div class="tip">{{ tip2 }}</div>
          <label class="passwdtTitle">新密码确认:</label>
          <input type="password" name="new_password_confirm" v-model:value="new_password_confirm" >
        </div>
      </div>
      <div class="submit-row">
        <button class="default"  @click="changePassword" >修改我的密码</button>
      </div>
      </div>
    </div>
</template>

<script>
    import {bk_host,passwdchg} from '../../api/api'
    export default {
        name: "changePassword",
        data() {
          return {
            old_password:"",
            new_password:"",
            new_password_confirm:"",
            tip1:"",
            tip2:""
          }
        },
      methods:{
        changePassword() {
          this.tip2 = "";
          if(this.new_password != this.new_password_confirm){
            this.tip2 ="两个密码字段不一致";
          }
          passwdchg({
            old_password:this.old_password,
            new_password:this.new_password
          }).then((response)=> {
            if (response.data.status == "sucess") {
              this.$router.push({ name: 'password_done'})
            }else{
              this.tip1 = response.data.msg;
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
</script>

<style>
  .passParam{
    width:100%;
    border-bottom:1px solid #eee;
    padding: 10px;
    font-size:13px;
  }
  .passwdtTitle{
    width:200px;
    display:block;
    padding: 4px 10px 0 0;
    float:left;
    word-wrap:break-word;
    font-weight:bold;
  }
  input[type="password"]{
    padding: 5px 6px;
  }
  .tip{
    color:#ba2121;
    padding: 1px 0;
    line-height: 20px;
    display:block;
    margin-bottom:4px;
  }
</style>
