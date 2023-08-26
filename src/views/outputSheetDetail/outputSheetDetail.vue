<template>
  <div class="outputSheetDeatil">
    <div class="breadcrums"  v-if="modelTask !== 'true'" >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <a>Edit Output Table</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }"  >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >Edit Output Table</router-link>
    </div>
    <div class="content">
      <h1>Edit Output Table</h1>
      <div class="param">
        <label class="paramTitle">name:</label>
        <input type="text" v-model="outputTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">order:</label>
        <input type="number" v-model="outputId" >
      </div>

      <div class="param">
        <label class="paramTitle">Description:</label>
        <el-input type="textarea" row="2" v-model="outputDetail" ></el-input>
      </div>
      <div class="submit-row">
        <button class="default" @click="CreateSheet" >Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {querySonVersion, updateOutput,queryTaskDetail, queryOutputSheet} from '../../api/api'
    export default {
        name: "outputSheetDetail",
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
        this.sheetId = this.$route.query.sheetId;
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
        queryOutputSheet(this.sheetId).then((response) => {
          this.outputTitle = response.data[0].name;
          this.outputId = response.data[0].sheet_output_id;
          this.outputDetail = response.data[0].detail;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
        CreateSheet() {
          var params = new URLSearchParams();
          params.append( 'task',this.taskId);
          params.append( 'name',this.outputTitle);
          params.append( 'sheet_output_id',this.outputId);
          params.append( 'detail',this.outputDetail);
          updateOutput( this.sheetId, params).then((response) =>{
            if (response.status == 200) {
              if(this.modelTask!=="true") {
                setTimeout( this.$router.push({ name: 'taskBackend',query:{taskId:this.taskId} }), 1000 );
              }
              else{
                setTimeout(this.$router.push({ name: 'taskBackend', query:{taskId:this.taskId, modelTask:true}}), 1000);
              }
            }
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style scoped>
  .el-textarea{
    width:50% !important;
  }
</style>
