<template>
  <div class="fileTableAdd">
    <div class="breadcrums"  v-if="modelTask !== 'true'" >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <router-link :to="{ name: 'fileConfig',query:{inputId:inputId} }">{{ inputName }}</router-link>&nbsp;›
      <a>Create File Table</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }" >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >{{ inputName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'fileConfig',query:{inputId:inputId,modelTask:true} }">Create File Table</router-link>
    </div>
    <div class="content">
      <h1>Create File Table</h1>
      <div class="param">
        <label class="paramTitle">using database:</label>
        <select v-model="exec_id">
          <option v-for="execfunc in execList" :value="execfunc.id"> {{execfunc.name}}</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">table name:</label>
        <input type="text" v-model="name" >
      </div>
      <div class="param">
        <label class="paramTitle">excel sheet order:</label>
        <input type="number" v-model="sheet_id" >
      </div>
      <div class="submit-row">
        <button class="default" @click="createTable">create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {querySonVersion, queryInputDetail, queryExec, createFileTable, queryTaskDetail} from '../../api/api'
    export default {
        name: "fileTableAdd",
        data() {
          return {
            inputId: "",
            inputName: "",
            taskId: "",
            taskName: "",
            taskVersion: "",
            versionId:"",
            parentId: "",
            parentName: "",
            execList: [],
            exec_id:"",
            name:"",
            sheet_id:"",
            modelTask:false
          }
        },
      created() {
        this.inputId = this.$route.query.inputId;
        this.modelTask = String(this.$route.query.modelTask);
        queryInputDetail(this.inputId).then((response) =>{
          this.taskId = response.data[0].task;
          this.inputName = response.data[0].name;
          if(this.modelTask === 'true'){
            queryTaskDetail(this.taskId).then((response) => {
              this.taskName = response.data.results[0].title;
            }).catch(function (error) {console.log(error);});
          }
          else{
            querySonVersion(this.taskId).then((response) => {
              this.parentId = response.data[0].parent_task;
              this.parentName = response.data[0].parent_name;
              this.versionId = response.data[0].version_id;
              this.taskVersion = response.data[0].version_num;
              this.taskName = response.data[0].son_name;
            }).catch(function (error) {console.log(error);});
          }
        }).catch(function (error) {console.log(error);});
        queryExec().then((response) => {
          this.execList = response.data;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
          createTable() {
            let params = {
              'input':this.inputId,
              'exec_id':this.exec_id,
              'name':this.name,
              'sheet_id':this.sheet_id
              };
            createFileTable(params).then((response) =>{
              if (response.status == 201) {
                if(this.modelTask!=="true") {
                  setTimeout( this.$router.push({ name: 'fileConfig',query:{inputId:this.inputId} }), 1000 );
                }
                else{
                  setTimeout( this.$router.push({ name: 'fileConfig',query:{inputId:this.inputId, modelTask:true} }), 1000 );
                }
              }
              else{console.log(response);}
            }).catch(function (error) {console.log(error);});
          }
      }
    }
</script>

<style>

</style>
