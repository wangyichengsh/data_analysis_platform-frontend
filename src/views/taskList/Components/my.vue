<template>
    <div class="my">
      <div class="search" >
        <el-input clearable placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText_my"></el-input>
        <el-button  type="primary" icon="el-icon-search" @click="MysearchTask" >搜索</el-button>
        <router-link :to="{ name: 'addDemand' }"  ><el-button  type="primary"  >创建新需求</el-button></router-link>
      </div>
      <table>
        <tr>
          <th style="width:100px;">ID</th>
          <th style="width:180px;">创建时间</th>
          <th style="width:80px;">需求编号</th>
          <th style="width:330px;">标题</th>
          <th style="width:100px;" >需求类型</th>
          <th style="width:100px;" >优先级</th>
          <th style="width:150px;" >状态</th>
          <th style="width:300px;" >执行页面</th>
          <th style="width:300px;" >开发任务详情</th>
        </tr>
        <tr v-for="task in MyTaskList_son">
          <td>{{task.id}}</td>
          <td>{{formatDate(task.create_time)}}</td>
          <td>{{task.seq}}</td>
          <td>
            <el-badge is-dot  v-if="task.if_feed" >  <router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}"><div :class="{'hurry':task.priority===1}" > {{task.title}}</div></router-link></el-badge>
            <el-badge is-dot  v-if="task.if_feed!==true && task.status==='accepting'" type="primary" >  <router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}"><div :class="{'hurry':task.priority===1}" > {{task.title}}</div></router-link></el-badge>
            <div v-if="task.if_feed!==true && task.status!=='accepting'" > <router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}"><div :class="{'hurry':task.priority===1}" > {{task.title}}</div></router-link></div>
          </td>
          <td>{{task.type}}</td>
          <td><div :class="{'hurry':task.priority===1}" > {{ mapPriority[task.priority] }}</div></td>
          <td>{{DemandstateMap[task.status] }}</td>
          <td>
            <router-link :to="{ name: 'taskExec',query:{taskId:i.task_id} }"  v-for="i in task.latest_task" ><button style="margin:5px;" >{{i.name}}</button></router-link>
          </td>
          <td>
            <router-link :to="{ name: 'taskDetail' ,query:{parentId:i.demand_id,versionId:i.version_id, task:i.task_id}}" v-for="i in task.diff_task" ><button style="margin:5px;" >{{i.name}}</button></router-link>
          </td>
        </tr>
      </table>
      <div class="pageTool">
        <span>每页{{ Mysize_son }}条</span>
        <span>共{{ totalMyRecord_son }}条</span>
        <button @click="myprevPage">上一页</button>
        <button @click="mynextPage">下一页</button>
        <input class="pageC" type="text" name="page" v-model="currentMyPage"><button @click="MypageAny">跳转</button>
      </div>
    </div>
</template>

<script>
  import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority,page_size} from '@/common/common'
  import { queryMyTask } from '@/api/api'
    export default {
        name: "My",
        data() {
          return {
            page_size,
            searchText_my:"",
            DemandstateMap,
            mapPriority,
            MyTaskList_son:[],
            currentMyPage:1,
            totalMyRecord_son:0,
            Mysize_son:0,
            totalMyPage_son:0
          }
        },
      props:["MyTaskList","totalMyRecord","Mysize","totalMyPage","userId"],
      watch:{
        MyTaskList:{
          handler(newVal, OldVal){
            this.MyTaskList_son = newVal;
          },
          immediate:true,
        },
        totalMyRecord:{
          handler(newVal, OldVal){
            this.totalMyRecord_son = newVal;
          },
          immediate:true,
        },
        Mysize:{
          handler(newVal, OldVal){
            this.Mysize_son = newVal;
          },
          immediate:true,
        },
        totalMyPage:{
          handler(newVal, OldVal){
            this.totalMyPage_son = newVal;
          },
          immediate:true,
        }
      },
      cretaed() {

      },
      methods:{
        formatDate,
        mynextPage(){
          if (this.currentMyPage < this.totalMyPage) {
            this.currentMyPage = Number(this.currentMyPage);
            this.currentMyPage += 1;
            queryMyTask(this.currentMyPage, this.searchText_my, '',this.userId).then((response) => {
              this.MyTaskList_son = response.data.results
            }).catch(function (error) {
              console.log(error);
            })
          }
        },
        myprevPage(){
          if (this.currentMyPage > 1) {
            this.currentMyPage = Number(this.currentMyPage);
            this.currentMyPage -= 1;
            queryMyTask(this.currentMyPage, this.searchText_my, '',this.userId).then((response) => {
              this.MyTaskList_son = response.data.results
            }).catch(function (error) {
              console.log(error);
            })
          }
        },
        MypageAny(){
          this.currentMyPage = Number(this.currentMyPage);
          if (this.currentMyPage < 1) {
            this.currentMyPage = 1
          }
          if (this.currentMyPage > this.totalMyPage) {
            this.currentMyPage = this.totalMyPage
          }
          if (this.currentMyPage >= 1 && this.currentMyPage <= this.totalMyPage) {
            queryMyTask(this.currentMyPage, this.searchText_my, '',this.userId).then((response) => {
              this.MyTaskList_son = response.data.results
            }).catch(function (error) {
              console.log(error);
            })
          }
        },
        MysearchTask() {
          queryMyTask(1, this.searchText_my, '',this.userId).then((response) => {
            this.MyTaskList_son = response.data.results;
            this.totalMyRecord_son = Number(response.data.count);
            this.Mysize_son = this.MyTaskList.length;
            this.totalMyPage_son = Math.ceil(this.totalMyRecord_son / this.Mysize_son);
          }).catch(function (error) { console.log(error);});
        },
      }
    }
</script>

<style scoped>
  .hurry{
    color:red;
  }
</style>
