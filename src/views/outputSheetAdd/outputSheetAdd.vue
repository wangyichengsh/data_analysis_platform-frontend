<template>
  <div class="outputSheetAdd">
    <div class="breadcrums"  v-if="modelTask !== 'true'" >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <a>Create Output Table</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }"  >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >Creat Output Table</router-link>
    </div>
    <div class="content">
      <h1>Create Output Table</h1>
      <div class="param">
        <label class="paramTitle">name:</label>
        <input type="text" v-model="outputTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">order:</label>
        <input type="number" v-model="outputId" >
      </div>

      <div class="param">
        <label class="paramTitle">detail:</label>
        <el-input type="textarea" row="2" v-model="outputDetail" ></el-input>
      </div>
      <div class="submit-row">
        <button class="default" @click="CreateSheet" >Create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {querySonVersion, createOutputSheet,queryTaskDetail} from '../../api/api'
    export default {
      name: "outputSheetAdd",
      data() {
        return {
          taskId:"",
          taskName:"",
          taskVersion:"",
          versionId:"",
          parentId:"",
          parentName:"",
          outputTitle:"",
          outputId:"",
          outputDetail:"",
          modelTask:false
        }
      },
      created() {
        this.taskId = this.$route.query.taskId;
        this.modelTask = String(this.$route.query.modelTask);
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
      },
      methods:{
        CreateSheet() {
          var params = new URLSearchParams();
          params.append( 'task',this.taskId);
          params.append( 'name',this.outputTitle);
          params.append( 'sheet_output_id',this.outputId);
          params.append( 'detail',this.outputDetail);
          createOutputSheet(params).then((response) =>{
            if (response.status == 201) {
              if(this.modelTask!=="true") {
              setTimeout( this.$router.push({ name: 'taskBackend',query:{taskId:this.taskId} }), 1000 );
              }
              else{
                setTimeout(this.$router.push({ name: 'modelTaskDetail', query:{task:this.taskId, modelTask:true}}), 1000);
              }
            }
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style>
  .el-textarea{
    width:50% !important;
  }
</style>
