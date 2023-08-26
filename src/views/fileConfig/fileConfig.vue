<template>
  <div class="fileConfig">
    <div class="breadcrums" v-if="modelTask !== 'true'">
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
      <a>{{ inputName }}</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }" >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >{{ inputName }}</router-link>
    </div>
    <div class="content">
      <div class="fileconfig">
        <h1>Input File Config</h1>
        <div  v-if="modelTask !== 'true'" >
          <router-link :to="{ name: 'fileTableAdd',query:{inputId:inputId} }"><button>create table</button></router-link>
          <router-link :to="{ name: 'fileColumnAdd',query:{inputId:inputId} }"><button>create field</button></router-link>
        </div>
        <div  v-if="modelTask === 'true'" >
          <router-link :to="{ name: 'fileTableAdd',query:{inputId:inputId, modelTask:true} }"><button>create table</button></router-link>
          <router-link :to="{ name: 'fileColumnAdd',query:{inputId:inputId, modelTask:true} }"><button>creat field</button></router-link>
        </div>
        <div class="fileSheet" v-for="sheet in sheetList" :sheet_id="sheet.id">
          <div class="sheetTile">
            <label class="title" >table</label>
              <input class="dsheetid" type="number" :value="sheet.sheet_id" style="width:30px;" >
            <input class="dname" type="text" :value="sheet.name" style="width:220px;" >
            <label>datebase：</label>
            <select class="exec_id">
              <option v-for="execfunc in execList" :value="execfunc.id" :selected="execfunc.id === sheet.exec_id" > {{execfunc.name}}</option>
            </select>
            <button style="margin-left:10px;" @click="ChangeFileSheet" >change</button>
            <button style="margin-left:10px;"  @click="showdetail" >hide/display</button>
            <button style="margin-left:11%;background-color: red;" @click="DelInputSheet(sheet.id)" >delete</button>
          </div>
          <div class="paramDetail_file" >
            <table style="margin-top: 20px;margin-bottom: 20px;" >
              <tbody>
              <tr>
                <th  style="width:150px;" >name</th>
                <th  style="width:150px;" >data type</th>
                <th>change</th>
                <th>delete</th>
              </tr>
              <tr v-for="column in sheet.columns" :column_id="column.id" :sheet_id="sheet.id" >
                <td>
                  <input class="dcolumntitle" style="width:145px;" :colu_id="column.id" type="text" :value="column.name">
                </td>
                <td>
                  <input class="dcolumntype" style="width:145px;" :colu_id="column.id" type="text" :value="column.type">
                </td>
                <td><button @click="ChangeFileColumn">change</button></td>
                <td><button style="background-color: red;" @click="DelInputColumn(column.id)" >delete</button></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <input id="tempsql" type="file" >
        <button @click="DownloadSql" >return sql code</button>
      </div>
    </div>
  </div>
</template>

<script>
    import {querySonVersion, queryFileInput, queryInputDetail, queryExec, updateFileInput, deleteFileInput, deleteFileColumn, updateFileColumn, tempSql, queryTaskDetail} from '../../api/api'
    import { getLocalStore } from '@/utils/storageUtil'
    export default {
        name: "fileConfig",
        data() {
          return{
            username:getLocalStore('name'),
            inputId:"",
            inputName:"",
            taskId:"",
            taskName:"",
            taskVersion:"",
            versionId:"",
            parentId:"",
            parentName:"",
            execList:[],
            sheetList:[],
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
          queryFileInput(this.inputId).then((response) =>{
            this.sheetList = response.data;
          }).catch( function (error) {console.log(error);});
        },
      methods:{
        showdetail(eve) {
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var detail = param.getElementsByClassName("paramDetail_file")[0];
          if(detail.style.display == "none" ){
            detail.style.display = "block";
          }
          else{
            detail.style.display = "none";
          }
        },
        DelInputColumn(inputId) {
          deleteFileColumn(inputId).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        ChangeFileColumn(eve) {
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var column_id = param.attributes.column_id.value;
          var sheet_id = param.attributes.sheet_id.value;
          var params = new URLSearchParams();
          params.append('name',param.getElementsByClassName("dcolumntitle")[0].value);
          params.append('type',param.getElementsByClassName("dcolumntype")[0].value);
          params.append('sheet',sheet_id);
          updateFileColumn(column_id, params).then((response) =>{
          if (response.status == 200) {location.reload();}
          else{console.log(response);}
        }).catch(function (error) {console.log(error);});
        },
        ChangeFileSheet(eve){
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var sheet_id = param.attributes.sheet_id.value;
          var params = new URLSearchParams();
          params.append('name',param.getElementsByClassName("dname")[0].value);
          params.append('sheet_id',param.getElementsByClassName("dsheetid")[0].value);
          params.append('input',this.inputId);
          params.append('exec_id',param.getElementsByClassName("exec_id")[0].value);
          updateFileInput(sheet_id, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        DelInputSheet(sheetId){
          deleteFileInput(sheetId).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        DownloadSql() {
          var fileInput = document.getElementById("tempsql");
          var file = fileInput.files[0];
          var formData = new FormData();
          formData.append('param_file', file);
          tempSql(this.inputId, formData).then((response) => {
            if (response.status == 200) {
              var blob = new Blob([response.data], {type: "text/plain"});
              var objectUrl = URL.createObjectURL(blob);
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              a.href = objectUrl;
              a.download = '临时表sql';
              a.click();
              document.body.removeChild(a);
            }
            else {
              console.log(response);
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    }
</script>

<style>
  .paramDetail_file{
    display: block;
  }
</style>
