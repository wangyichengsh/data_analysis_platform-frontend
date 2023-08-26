<template>
  <div class="taskList">
    <div>
      <el-tabs v-model="tabStart" type="border-card" @tab-click="handletabchange" style="margin-top: 15px;" >

        <el-tab-pane  label="unfinished" v-if="isStaff===true" name="deve" >
          <Deve :TaskInDeve="TaskInDeve" :totalDeveRecord="totalDeveRecord" :Devesize="Devesize" :totalDevePage="totalDevePage"  :usermap="usermap" ></Deve>
        </el-tab-pane>


        <!--<el-tab-pane label="已完成" name="finished">-->
          <!--<Finished :parentTaskDoneList="parentTaskDoneList" :totalDoneRecord="totalDoneRecord" :Donesize="Donesize" :totalDonePage="totalDonePage" :postStatus="postStatus" ></Finished>-->
        <!--</el-tab-pane>-->

        <el-tab-pane label="my requirement" name="my" >
          <!--<My :MyTaskList="MyTaskList" :totalMyRecord="totalMyRecord" :Mysize="Mysize" :totalMyPage="totalMyPage" :userId="userId"></My>-->
          <All :parentTaskList="MyTaskList" :totalRecord="totalMyRecord" :size="Mysize" :totalPage="totalMyPage" :usermap="usermap" :userId="userId" postStatus="my" ></All>
        </el-tab-pane>


        <el-tab-pane label="all" name="all">
          <All :parentTaskList="parentTaskList" :totalRecord="totalRecord" :size="size" :totalPage="totalPage" :usermap="usermap" :userId="userId" postStatus="all" ></All>
        </el-tab-pane>

        <el-tab-pane label="queue" name="queue" >
          <Queue :deve_parenttask="deve_parenttask" :deve_task="deve_task" :usermap="usermap" :isStaff="isStaff" :userId="userId" ></Queue>
        </el-tab-pane>

        <!--反馈列表 -->
        <el-tab-pane label="feedback" name="feed">
          <FeedList :Feed="Feed" :totalFeed="totalFeed" :Feedsize='Feedsize' :totalFeedPage="totalFeedPage" :usermap="usermap" ></FeedList>
        </el-tab-pane>

        <el-tab-pane label="审核列表" name="checklist" v-if="userId===17 || userId===11 " >
          <CheckList :checkTaskList="checkTaskList"></CheckList>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
    import {queryTaskList, queryUser, queryTaskDeve, queryMyTask, getDeveQueue_Task, getDeveQueue_ParentTask, addDeveQueue_Task, addDeveQueue_ParentTask, delDeveQueue, queryFeedList, markchange, ChgDemandStatus, queryUnDemand, queryDemand_order} from '../../api/api'
    import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority} from '@/common/common'
    import { getLocalStore } from '@/utils/storageUtil';
    import ElBadge from "element-ui/packages/badge/src/main";
    import CheckList from "./Components/checkList"
    import Queue from "./Components/queue"
    import FeedList from "./Components/feed"
    import All from "./Components/all"
    import My from "./Components/my"
    import Finished from "./Components/finished"
    import Deve from "./Components/deve"
    export default {
      components: {ElBadge,CheckList,Queue,FeedList,All,My,Finished,Deve},
      name: "taskList",
        data(){
          return {
            userId:"",
            tabActive:"my",
            tabStart:"my",
            isStaff:false,
            MyTaskList:[],
            parentTaskList: [],
            parentTaskDoneList:[],
            TaskInDeve:[],
            Feed:[],
            totalMyPage:1,
            totalPage:1,
            totalDonePage:1,
            totalDevePage:1,
            totalFeedPage:1,
            totalMyRecord:0,
            totalRecord:0,
            totalDoneRecord:0,
            totalDeveRecord:0,
            totalFeed:0,
            Mysize:0,
            size:0,
            Donesize:0,
            Devesize:0,
            Feedsize:0,
            searchText:"",
            postStatus:"",
            usermap:{},
            deve_task: [],
            deve_parenttask:[],
            dragfrom:null,
            dragto:null,
            pre_id:"",
            checkTaskList:[]
          }
        },
      watch: {
        tabStart(val) {
          this.$router.push(`${this.$route.path}?tabStart=${val}`)
          if(val==='all'){
            this.postStatus = '';
            queryDemand_order(1,this.searchText, this.postStatus, '', '', false).then((response) => {
              this.parentTaskList = response.data.results;
              this.totalRecord = Number(response.data.count);
              this.size = this.parentTaskList.length;
              this.totalPage = Math.ceil(this.totalRecord/this.size);
            }).catch(function (error) {console.log(error);});
          }
          else if(val==='queue'){
            getDeveQueue_Task().then((response) => {
              this.deve_task = response.data;
            }).catch(function (error) {console.log(error);});
            getDeveQueue_ParentTask().then((response) => {
              this.deve_parenttask = response.data;
            }).catch(function (error) {console.log(error);});
          }
          else if(val==='deve'){
            queryUnDemand(1,this.searchText).then((response) =>{
              this.TaskInDeve = response.data.results;
              this.totalDeveRecord = Number(response.data.count);
              this.Devesize = this.TaskInDeve.length;
              this.totalDevePage = Math.ceil(this.totalDeveRecord/this.Devesize);
            }).catch(function (error) {console.log(error);})
          }
          else if(val==='feed'){
            queryFeedList(1,this.searchText).then((response) => {
              this.Feed = response.data.results;
              this.totalFeed = Number(response.data.count);
              this.Feedsize = this.Feed.length;
              this.totalFeedPage = Math.ceil(this.totalFeed/this.Feedsize);
            }).catch(function (error) {});
          }
          else if(val==='checklist'){
            queryTaskList(1,'', 'check').then((response) => {
              this.checkTaskList = response.data.results;
            }).catch(function (error) {console.log(error);});
          }
          else{
            // my
            if(getLocalStore('userId')!==null) {
              queryMyTask(1, this.searchText, '', getLocalStore('userId')).then((response) => {
                this.MyTaskList = response.data.results;
                this.totalMyRecord = Number(response.data.count);
                this.Mysize = this.MyTaskList.length;
                this.totalMyPage = Math.ceil(this.totalMyRecord / this.Mysize);
              }).catch(function (error) {
                console.log(error);
              });
            }
          }
        }
      },
      created () {
        this.tabStart = this.$route.query.tabStart;
        console.log(this.tabStart);
        if(typeof(this.tabStart)==='undefined' || String(this.tabStart)==='0'){
          this.tabStart = 'all';
        }
        queryUser().then((response) =>{
          for(var user in response.data) {
            this.usermap[response.data[user].id] = response.data[user].full_name;
          }
        }).catch(function (error) {console.log(error);});
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
          this.userId = response.data[0].id;
          if(this.isStaff===true){
            queryUnDemand(1,this.searchText).then((response) =>{
              this.TaskInDeve = response.data.results;
              this.totalDeveRecord = Number(response.data.count);
              this.Devesize = this.TaskInDeve.length;
              this.totalDevePage = Math.ceil(this.totalDeveRecord/this.Devesize);
            }).catch(function (error) {console.log(error);})
          }
        }).catch(function (error) {console.log(error);});

        if(getLocalStore('userId')!==null) {
          queryMyTask(1, this.searchText, '', getLocalStore('userId')).then((response) => {
            this.MyTaskList = response.data.results;
            this.totalMyRecord = Number(response.data.count);
            this.Mysize = this.MyTaskList.length;
            this.totalMyPage = Math.ceil(this.totalMyRecord / this.Mysize);
          }).catch(function (error) {
            console.log(error);
          });
        }
        else{
          setTimeout(this.getMyTask, 1000);
        }
        getDeveQueue_ParentTask().then((response) => {
          this.deve_parenttask = response.data;
        }).catch(function (error) {console.log(error);});

        queryFeedList(1,this.searchText).then((response) => {
          this.Feed = response.data.results;
          this.totalFeed = Number(response.data.count);
          this.Feedsize = this.Feed.length;
          this.totalFeedPage = Math.ceil(this.totalFeed/this.Feedsize);
        }).catch(function (error) {});
        if(getLocalStore('name')==null){
          this.$router.push({ name:'login'})
        }
        queryTaskList(1,'', 'check').then((response) => {
          this.checkTaskList = response.data.results;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
        handletabchange(tab, event){
          if(tab.label==='已完成'){
            this.postStatus = 'finished';
            queryTaskList(1,this.searchText, 'finished').then((response) => {
              this.parentTaskDoneList = response.data.results;
              this.totalDoneRecord = Number(response.data.count);
              this.Donesize = this.parentTaskDoneList.length;
              this.totalDonePage = Math.ceil(this.totalDoneRecord/this.Donesize);
            }).catch(function (error) {});
          }
          else if(tab.label==='全部'){
            this.postStatus = '';
            queryTaskList(1,this.searchText, this.postStatus).then((response) => {
              this.parentTaskList = response.data.results;
              this.totalRecord = Number(response.data.count);
              this.size = this.parentTaskList.length;
              this.totalPage = Math.ceil(this.totalRecord/this.size);
            }).catch(function (error) {console.log(error);});
          }
          else if(tab.label==='需求队列'){
            getDeveQueue_Task().then((response) => {
              this.deve_task = response.data;
            }).catch(function (error) {console.log(error);});
            getDeveQueue_ParentTask().then((response) => {
              this.deve_parenttask = response.data;
            }).catch(function (error) {console.log(error);});
          }
          else if(tab.label==='开发任务'){
            queryUnDemand(1,this.searchText).then((response) =>{
              this.TaskInDeve = response.data.results;
              this.totalDeveRecord = Number(response.data.count);
              this.Devesize = this.TaskInDeve.length;
              this.totalDevePage = Math.ceil(this.totalDeveRecord/this.Devesize);
            }).catch(function (error) {console.log(error);})
          }
          else if(tab.label==='反馈列表'){
            queryFeedList(1,this.searchText).then((response) => {
              this.Feed = response.data.results;
              this.totalFeed = Number(response.data.count);
              this.Feedsize = this.Feed.length;
              this.totalFeedPage = Math.ceil(this.totalFeed/this.Feedsize);
            }).catch(function (error) {});
          }
          else if(tab.label==='审核列表'){
            queryTaskList(1,'', 'check').then((response) => {
              this.checkTaskList = response.data.results;
            }).catch(function (error) {console.log(error);});
          }
          else if(tab.label==='我的需求'){
            if(getLocalStore('userId')!==null) {
              queryMyTask(1, this.searchText, '', getLocalStore('userId')).then((response) => {
                this.MyTaskList = response.data.results;
                this.totalMyRecord = Number(response.data.count);
                this.Mysize = this.MyTaskList.length;
                this.totalMyPage = Math.ceil(this.totalMyRecord / this.Mysize);
              }).catch(function (error) {
                console.log(error);
              });
            }
            else{
              setTimeout(this.getMyTask, 1000);
            }
          }
        },
        mapPriority(priority){
          if(priority===1 || priority==='1'){
            return '特急'
          }
          else if(priority===2 || priority==='2'){
            return '一般'
          }
        },
        mapStatus(status){
          if(status==='wait'){
            return '待技术人员评估'
          }
          else if(status==='conforming'){
            return '待业务人员确认'
          }
          else if(status==='conformed'){
            return '已确认'
          }
          else if(status==='developing'){
            return '开发中'
          }
          else if(status==='accepting'){
            return '验收中'
          }
          else if(status==='finished'){
            return '已完成'
          }
          else if(status==='cancel'){
            return '已取消'
          }
          else if(status==='check'){
            return '审核中'
          }
          else if(status==='failed'){
            return '审核不通过'
          }
        },
        getMyTask() {
          queryMyTask(1, this.searchText, '', getLocalStore('userId')).then((response) => {
            this.MyTaskList = response.data.results;
            this.totalMyRecord = Number(response.data.count);
            this.Mysize = this.MyTaskList.length;
            this.totalMyPage = Math.ceil(this.totalMyRecord / this.Mysize);
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
</script>

<style>
  .pageTool{
    margin-top: 10px;
    padding-left: 42%;

  }
  .pagePN{
    border-radius: 2px 0 0 2px;
    margin-left: 0 !important;
    text-decoration: none;
    display: inline-block;
    vertical-align: middle;
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    margin: 0 -1px 5px 0;
    background-color: #fff;
    color: #333;
    font-size: 12px;
    border: 1px solid #e2e2e2;
    box-sizing: content-box;
  }
  .pageC{
    width:30px;
    height:22px;
    margin-right: 10px;
  }
  .search{
    padding-bottom: 15px;
  }
  .taskcard{
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
</style>
