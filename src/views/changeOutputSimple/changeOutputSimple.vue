<template>
  <div class="changeOutputSimple" >
    <div class="breadcrums">
      <router-link :to="{ name: 'demandDetail' ,query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail',query: {parentId:parentId, task:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <a>Edit Output</a>
    </div>
    <div class="content">
      <h1>Edit output</h1>
      <div class="param">
        <label class="paramTitle">name:</label>
        <input type="text" v-model="outputTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">description:</label>
        <textarea v-model="outputDetail" cols="40" rows="10"></textarea>
      </div>
      <div class="param">
        <label class="paramTitle">table:</label>
        <el-select v-model="outputSheetId">
          <el-option v-for="sheet in outputSheetList" :value="sheet.id" :label="sheet.name"></el-option>
        </el-select>
      </div>
      <div class="submit-row">
        <button class="default" @click="changeOutput" >edit</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {bk_host,file_host, querySonVersion, queryOutputColumn, queryOutputSimple, changeOutputColumn} from '../../api/api';
  import { getLocalStore, clearLocalStore,setLocalStore } from '@/utils/storageUtil';
  export default {
        name: "change-output-simple",
        data() {
          return {
            username:getLocalStore('name'),
            taskId:"",
            taskName:"",
            taskVersion:"",
            parentId:"",
            parentName:"",
            outputId:"",
            outputTitle:"",
            outputDetail:"",
            outputSheetId:"",
            outputSheetList:[]
          }
        },
        created() {
          this.outputId = this.$route.query.outputId;
          this.taskId = this.$route.query.taskId;
          queryOutputColumn(this.outputId).then((response) =>{
            this.outputTitle = response.data[0].name;
            this.outputDetail = response.data[0].detail;
            this.outputSheetId = response.data[0].sheet;
            querySonVersion(this.taskId).then((response) => {
              this.parentId = response.data[0].parent_task;
              this.parentName = response.data[0].parent_name;
              this.taskVersion = response.data[0].version_num;
              this.taskName = response.data[0].son_name;
            }).catch(function (error) {console.log(error);});
            queryOutputSimple(this.taskId).then((response => {
              this.outputSheetList = response.data;
            })).catch(function (error) {console.log(error);});
          }).catch(function (error) {console.log(error);});
        },
        methods:{
          changeOutput() {
            var param ={
              'name':this.outputTitle,
              'detail':this.outputDetail,
              'sheet':this.outputSheetId
            };
            if (this.outputDetail.length===0){
              this.$message({
                type: 'info',
                message: '"输出字段描述"为空'
              });
              return
            }
            changeOutputColumn(this.outputId, param).then((response) =>{
              if (response.status == 200) {this.$router.push({ name: 'taskDetail',query:{task:this.taskId,parentId:this.parentId} });}
              else{
                console.log(response);
                this.$message({
                  type: 'info',
                  message: 'error'
                });
              }
            }).catch(function (error) {console.log(error);});
          }
        }
    }
</script>

<style scoped>

</style>
