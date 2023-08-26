<template>
  <div class="fileColumnAdd">
    <div class="breadcrums" v-if="modelTask !== 'true'">
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <router-link :to="{ name: 'fileConfig',query:{inputId:inputId} }">{{ inputName }}</router-link>&nbsp;›
      <a>Create File Field</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }" >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >{{ inputName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'fileConfig',query:{inputId:inputId,modelTask:true} }">Create File Field</router-link>
    </div>
    <div class="content">
      <h1>Create File Field</h1>
      <div class="param">
        <label class="paramTitle">table name:</label>
        <el-select v-model="sheet">
          <el-option v-for="table in sheetList" :value="table.id" :label="table.name" ></el-option>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle">field name:</label>
        <input type="text" v-model="name" >
      </div>
      <div class="param">
        <label class="paramTitle">data type:</label>
        <input type="text" v-model="type" >
      </div>
      <div class="submit-row">
        <button class="default" @click="createColumn">create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {querySonVersion, queryInputDetail, queryFileSimple, createFileColumn, queryTaskDetail} from '../../api/api'
    export default {
        name: "fileColumnAdd",
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
          sheetList:[],
          sheet:"",
          name:"",
          type:"",
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
        queryFileSimple(this.inputId).then((response) =>{
          this.sheetList = response.data;
        }).catch( function (error) {console.log(error);});
      },
      methods:{
          createColumn() {
            var params = new URLSearchParams();
            params.append( 'sheet',this.sheet);
            params.append( 'name',this.name);
            params.append( 'type',this.type);
            createFileColumn(params).then((response) =>{
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
