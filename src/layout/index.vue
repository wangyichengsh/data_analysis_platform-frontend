<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" >
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  body{
    font-family: "Roboto","Lucida Grande","DejaVu Sans","Bitstream Vera Sans",Verdana,Arial,sans-serif;
    font-size: 14px;
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
    background:#F5F7FA !important;
    padding:10px 40px;
    border:none;
    font-size:14px;
    color:#161ab7;
    text-align:left;
  }
  .breadcrums a{
    color:#161ab7 !important;
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
    text-align:center;
    overflow:hidden;
  }
  .default{
    height:35px;
    line-height:15px;
    padding:10px 15px;
    background: #409EFF;
    color:white;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  input[type=number]{
    width:35px !important;
  }
</style>
