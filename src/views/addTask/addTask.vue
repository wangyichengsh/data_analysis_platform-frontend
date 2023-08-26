<template>
  <div class="addTask">
    <div class="breadcrums">
      <router-link :to="{ name: 'demandDetail',query:{demandId:parentId}}">{{ parentName }}</router-link>&nbsp;›
      <a>Create Task</a>
    </div>
    <div class="content">
      <h1>Create Task</h1>
      <div class="param">
        <label class="paramTitle">Title:</label>
        <input type="text" v-model="taskTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">Priority:</label>
        <select id="priority" v-model="priority" >
          <option value="1">emergency</option>
          <option value="2">normal</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">type:</label>
        <select id="taskType" v-model="taskType" >
          <option value="file">file</option>
          <option value="module">query</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">developer:</label>
        <select id="developer" v-model="developer" >
          <option v-for="user in userList" :value="user.id">{{user.full_name}}</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">description:</label>
        <textarea v-model="desc" ></textarea>
      </div>
      <div class="submit-row">
        <button class="default" @click="create" >Create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryParentDetail, queryUser, createTask, newVersion} from '@/api/api'
  import { getLocalStore, clearLocalStore,setLocalStore } from '@/utils/storageUtil'
    export default {
        name: "add-task",
        data() {
        return{
          username:getLocalStore('name'),
          isStaff:false,
          seq:"",
          parentId:"",
          parentName:"",
          taskTitle:"",
          priority:"",
          taskType:"",
          developer:"",
          desc:"",
          userList:[],
          latest_version:0,
        }
      },
      created() {
        this.parentId = this.$route.query.parentId;
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
        }).catch(function (error) {console.log(error);});
        queryParentDetail(this.parentId).then((response) => {
          this.parentName = response.data.results[0].title;
          this.priority =  response.data.results[0].priority;
          this.seq = response.data.results[0].seq;
          var tl = response.data.results[0].diff_task;
          if(tl.length===0){this.latest_version = 0;}
          else{
            for(var i in tl){
              if(this.latest_version<tl[i].version_id){
                this.latest_version = tl[i].version_id;
              }
            }
          }
        }).catch(function (error) {console.log(error);});
        queryUser({ params: {is_staff:true}} ).then((response) => {
          this.userList = response.data;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
          create(){
            var task_param = {
              'title':this.taskTitle,
              'level':this.priority,
              'type':this.taskType,
              'status':'confirming',
              'desc':this.desc,
              'developer':this.developer,
              'if_valid':true,
            };
            createTask(task_param).then((response) => {
              if (response.status == 200) {
                var status = response.data.status;
                if(status!='success'){console.log( response.data.msg);}
                else {
                  var task_id = response.data.id;
                  console.log(task_id);
                  var version_param = {
                    'parent_name': this.parentName,
                    'son_name': this.taskTitle,
                    'version_id': Number(this.latest_version + 1),
                    'version_num': 1,
                    'demand_seq': this.seq,
                    'if_exec': false,
                    'parent_task': this.parentId,
                    'son_task':task_id
                  };
                  newVersion(version_param).then((response) => {
                    if (response.status == 201) {
                      setTimeout( this.$router.push({ name: 'demandDetail',query:{demandId:this.parentId}}), 1000 );
                    }
                    else{console.log(response);}
                  }).catch(function (error) {console.log(error);});
                }
              }
              else{console.log(response);}
            }).catch(function (error) {console.log(error);});

          }
      }
    }
</script>

<style scoped>

</style>
