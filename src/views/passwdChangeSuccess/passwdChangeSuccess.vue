<template>
  <div id="changePassword">
    <div class="breadcrums">
      <a>首页</a> &nbsp;›
      <a>密码修改</a>
    </div>
    <div class="content">
      <h1>密码更改成功</h1>
      <p>你的密码已修改</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "passwdChangeSuccess"
    }
</script>

<style>
  div.breadcrums{
    display: flex;
    background:#79aec8;
    padding:10px 40px;
    border:none;
    font-size:14px;
    color:#c4dce8;
    text-align:left;
  }
  .breadcrums a{
    color:#fff;
  }
</style>
