<template>

  <div>
    <router-view name="header"></router-view>
    <div>
      <router-view name="content"></router-view>
    </div>
    <router-view name="footer"></router-view>
  </div>

</template>
<script>

</script>
<style>
  body{
    font-family: "Roboto","Lucida Grande","DejaVu Sans","Bitstream Vera Sans",Verdana,Arial,sans-serif;
    font-size: 14px;
  }
  table
  {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
  }
  table td, table th
  {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
  }
  table th
  {
    background-color: #CCE8EB;
  }
  table tr:nth-child(odd)
  {
    background: #fff;
  }
  table tr:nth-child(even)
  {
    background: #F5FAFA;
  }
  input[type=text], input[type=password], input[type=email], input[type=url],
  input[type=number], input[type=tel], textarea, select, .vTextField {
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: "Roboto","Lucida Grande","DejaVu Sans","Bitstream Vera Sans",Verdana,Arial,sans-serif;
    padding: 2px 5px;
    margin-top: 0;
  }
  .vTextField, .vUUIDField {
    width: 20em;
  }
  button, input[type="submit"], input[type="button"], .submit-row input, a.button {
    background: #409EFF;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
  h1{
    margin:0 0 20px;
    font-weight:300;
    font-size:20px;
    color:#666;
  }
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
  .content{
    padding:20px 40px;
  }
  .param{
    width:100%;
    border-bottom:1px solid #eee;
    padding: 10px;
    font-size:13px;
  }
  .paramTitle{
    width:200px;
    display:block;
    padding: 4px 10px 0 0;
    float:left;
    word-wrap:break-word;
    font-weight:bold;
    font-size: 14px;
  }
  .sheetTile{
    width:100%;
    border-bottom:1px solid black;
    padding: 15px;
    font-size:16px;
  }
  .submit-row{
    padding: 12px 14px;
    margin: 20px 0 20px;
    background: #f8f8f8;
    border:1px solid #eee;
    border-radius:4px;
    text-align:right;
    overflow:hidden;
  }
  .default{
    height:35px;
    line-height:15px;
    padding:10px 15px;
    background: #417690;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
