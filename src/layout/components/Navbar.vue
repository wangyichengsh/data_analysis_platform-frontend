<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          Welcome,{{ fullname }}
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!--  <router-link to="/password_change">
            <el-dropdown-item>
              change password
            </el-dropdown-item>
          </router-link> -->
          <router-link to="/logout">
            <el-dropdown-item>
              logout
            </el-dropdown-item>
          </router-link>
          <!--          <router-link >-->
          <!--            <el-dropdown-item divided @click.native="logout">-->
          <!--              <span style="display:block;">退出</span>-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getLocalStore, clearLocalStore,setLocalStore } from '@/utils/storageUtil'
import {queryUser, channel_host} from  '@/api/api'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      fullname: '',
      userId:'',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    const username = getLocalStore('name');
    if(getLocalStore('name')===null){
      this.$router.push({ name: 'login' });
    }
    queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
      this.fullname = response.data[0].full_name;
      this.userId = response.data[0].id;
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
    }).catch(function (error) {
      console.log(error);

    });
    let renew_ws = new WebSocket(channel_host+"/ws/web/all/");
    renew_ws.onopen = function () {
      console.log('刷新信号已开启');
    };
    renew_ws.onmessage = function (evt) {
      var received_msg = evt.data;
      var msg = JSON.parse(received_msg)['message'];
      console.log(msg);
      location.reload();
    };
    renew_ws.onclose = function () {
      // 关闭 websocket
      console.log("刷新信号已关闭");
    };

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // eslint-disable-next-line no-mixed-spaces-and-tabs
	  // 暂不使用该方法
    async logout() {
      console.log(this.$route)
      await this.$store.dispatch('/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
