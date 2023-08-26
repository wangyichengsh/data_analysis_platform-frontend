<template>
    <div class="finished">
      <div class="search" >
        <el-input clearable placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText_fin"></el-input>
        <el-button v-waves type="primary" icon="el-icon-search" @click="searchTask_fin" >搜索</el-button>
      </div>

      <table>
        <tr>
          <th style="width:100px;">需求编号</th>
          <th style="width:330px;">标题</th>
          <th style="width:100px;" >需求类型</th>
          <th style="width:100px;" >需求详情</th>
          <th style="width:300px;" >执行页面</th>
          <th style="width:300px;" >开发任务详情</th>
        </tr>
        <tr v-for="task in parentTaskDoneList_son">
          <td>{{task.seq}}</td>
          <td><router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}" >{{task.title}}</router-link></td>
          <td>{{task.type}}</td>
          <td><router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}" ><button style="margin:5px;" >需求详情</button></router-link></td>
          <td>
            <router-link :to="{ name: 'taskExec',query:{taskId:i.task_id} }"  v-for="i in task.latest_task"><button style="margin:5px;" >{{i.name}}</button></router-link>
          </td>
          <td>
            <router-link :to="{ name: 'taskDetail' ,query:{parentId:i.demand_id,versionId:i.version_id, task:i.task_id}}" v-for="i in task.diff_task" ><button style="margin:5px;" >{{i.name}}</button></router-link>
          </td>
        </tr>
      </table>
      <div class="pageTool">
        <span>每页{{ Donesize_son }}条</span>
        <span>共{{ totalDoneRecord_son }}条</span>
        <button @click="prevPage_fin">上一页</button>
        <button @click="nextPage_fin">下一页</button>
        <input class="pageC" type="text" name="page" v-model="currentDonePage"><button @click="pageAny_fin">跳转</button>
      </div>
    </div>
</template>

<script>
  import { queryTaskList } from '@/api/api'
    export default {
        name: "Finished",
        data(){
          return {
            parentTaskDoneList_son:[],
            currentDonePage:1,
            searchText_fin:"",
            totalDoneRecord_son:0,
            Donesize_son:0,
            totalDonePage_son:0
          }
        },
      props:["parentTaskDoneList","totalDoneRecord","Donesize","totalDonePage","postStatus"],
      watch:{
        parentTaskDoneList:{
          handler(newVal, OldVal){
            this.parentTaskDoneList_son = newVal;
          },
          immediate:true,
        },
        totalDoneRecord:{
          handler(newVal, OldVal){
            this.totalDoneRecord_son = newVal;
          },
          immediate:true,
        },
        Donesize:{
          handler(newVal, OldVal){
            this.Donesize_son = newVal;
          },
          immediate:true,
        },
        totalDonePage:{
          handler(newVal, OldVal){
            this.totalDonePage_son = newVal;
          },
          immediate:true,
        }
      },
      methods:{
        searchTask_fin() {
        queryTaskList(1, this.searchText_fin, this.postStatus).then((response) => {
          this.parentTaskDoneList_son = response.data.results;
          this.totalDoneRecord_son = Number(response.data.count);
          this.Donesize_son = this.parentTaskDoneList_son.length;
          this.totalDonePage_son = Math.ceil(this.totalDoneRecord_son / this.Donesize);
        }).catch(function (error) { console.log(error);})
    },
        nextPage_fin(){
            if (this.currentDonePage < this.totalDonePage) {
              this.currentDonePage = Number(this.currentDonePage);
              this.currentDonePage += 1;
              queryTaskList(this.currentDonePage, this.searchText_fin, this.postStatus).then((response) => {
                this.parentTaskDoneList_son = response.data.results
              }).catch(function (error) {
                console.log(error);
              })
            }
        },
        prevPage_fin(){
            if (this.currentDonePage > 1) {
              this.currentDonePage = Number(this.currentDonePage);
              this.currentDonePage -= 1;
              queryTaskList(this.currentDonePage, this.searchText_fin, this.postStatus).then((response) => {
                this.parentTaskDoneList_son = response.data.results
              }).catch(function (error) {
                console.log(error);
              })
            }
        },
        pageAny_fin(){
            this.currentDonePage = Number(this.currentDonePage);
            if (this.currentDonePage < 1) {
              this.currentDonePage = 1
            }
            if (this.currentDonePage > this.totalDonePage_son) {
              this.currentDonePage = this.totalDonePage_son
            }
            if (this.currentDonePage >= 1 && this.currentDonePage <= this.totalDonePage_son) {
              queryTaskList(this.currentDonePage, this.searchText_fin, this.postStatus).then((response) => {
                this.parentTaskDoneList_son = response.data.results
              }).catch(function (error) {console.log(error);})
            }
        },
      }
    }
</script>

<style scoped>

</style>
