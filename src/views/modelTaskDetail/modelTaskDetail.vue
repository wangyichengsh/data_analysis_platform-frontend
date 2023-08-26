<template>
  <div class="modelTaskDetail">
    <div class="breadcrums" >
      <a>query&nbsp;›</a>&nbsp;
      <a>{{ TaskName }}</a>
    </div>
    <el-card class="box-card" style="margin-top: 20px;" shadow="hover">
    <div class="param">
      <label class="paramTitle" >title:</label>
      <el-input type="text" v-model="TaskName" style="width:500px;"></el-input>
    </div>
    <div class="param" v-if="isStaff" >
      <label class="paramTitle" >status:</label>
      <el-select id="state" v-model="TaskState" >
        <el-option  value="confirming" label="confirming" disabled ></el-option>
        <el-option  value="ranking" label="in queue" disabled ></el-option>
        <el-option  value="developing" label="developing"></el-option>
        <el-option  value="finished" label="finished"></el-option>
        <el-option  value="repairing" label="fixing bug"></el-option>
      </el-select>
    </div>
    <div class="param" v-if="isStaff===true" >
      <label class="paramTitle" >type:</label>
      <el-select id="type" v-model="TaskType" >
        <el-option  label="file" value="file" disabled ></el-option>
        <el-option  label="query" value="module"></el-option>
      </el-select>
      <button >change type</button>
    </div>
    <div class="param" v-if="isStaff!=true" >
      <label class="paramTitle" >type:</label>
      <span v-if="TaskType==='file'" >file</span>
      <span v-if="TaskType==='module'" >query</span>
    </div>
    <div class="param">
      <label class="paramTitle" >detail:</label>
      <textarea v-model="Detail"></textarea>
    </div>
    <div class="param">
      <label class="paramTitle">developer:</label>
      <select id="developer" v-model="developer" >
        <option v-for="user in userList" :value="user.id">{{user.full_name}}</option>
      </select>
    </div>
      <div class="submit-row">
        <button class="default" v-if="isStaff" @click="changeModel" >change</button>
        <router-link :to="{ name: 'taskBackend',query:{taskId:task, modelTask:true}}"><button class="default" v-if="isStaff">configure query</button></router-link>
        <router-link :to="{ name: 'taskExec',query:{taskId:task, modelTask:true} }" ><button class="default" >query page</button></router-link>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;" shadow="hover" >
      <div slot="header" class="clearfix" >
        <span >input</span>
        <router-link  style="float: right; padding: 3px 0" v-if="isStaff===true" :to="{ name: 'inputAdd',query:{taskId:task, modelTask:true} }"><button >create input</button></router-link>
      </div>
      <div>
        <el-table
          :data="inputParam"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="name"
            width="300">
          </el-table-column>
          <el-table-column
            prop="type"
            label="type"
            :formatter="InputTypeFormat"
            width="200">
          </el-table-column>
          <el-table-column
            prop="detail"
            label="detail">
          </el-table-column>
          <el-table-column  label="operation" width="110" v-if="isStaff===true" >
            <template slot-scope="scope" >
              <el-button size="mini"><router-link :to="{ name: 'changeInputSimple',query:{inputId:scope.row.id}}">edit</router-link></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;" shadow="hover" >
      <div slot="header">
        <span>output</span>
        <div  v-if="isStaff===true" style="float: right; padding: 3px 0"  >
          <input type="file" id="outputFile" ><button @click="changeOutput">upload field excel</button>
        </div>
      </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="(outputSheet,index) in outputParam" :title="outputSheet.name" :name="outputSheet.sheet_output_id">

          <div v-if="outputSheet.detail.length>0" style="margin:10px;" v-html="formatdetailhtml(outputSheet.detail)" ></div>

          <el-table
            :data="outputSheet.columns"
            style="width: 100%">

            <el-table-column
              prop="name"
              label="name"
              width="400">
            </el-table-column>
            <el-table-column
              prop="detail"
              label="detail">
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
  import {queryUser, queryInput, queryOutput, queryTaskDetail, renewOutput, UpdateSon} from '../../api/api'
  import { getLocalStore } from '@/utils/storageUtil';
  import { stateMap } from '@/common/common'
    export default {
        name: "model-task-detail",
      data (){
          return {
            task:"",
            username:getLocalStore('name'),
            userList:[],
            isStaff:false,
            TaskName:"",
            developer:"",
            Detail:"",
            inputParam:[],
            outputParam:[],
            TaskState:"",
            stateMap,
            stateStep:"",
            activeName:undefined,
            TaskType:"",
          }
      },
      created (){
        this.task = this.$route.query.task;
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
        }).catch(function (error) {console.log(error);});
        queryUser({ params: {is_staff:true}} ).then((response) => {
          this.userList = response.data;
        }).catch(function (error) {console.log(error);});
        queryInput(this.task).then((response) => {
          this.inputParam = response.data;
        }).catch(function (error) {console.log(error);});
        queryOutput(this.task).then((response) => {
          this.outputParam = response.data;
          if(this.outputParam.length>0 && typeof(this.activeName)==="undefined"){
            this.activeName = this.outputParam[0].sheet_output_id;
          }
        }).catch(function (error) {console.log(error);});
          queryTaskDetail(this.task).then((response) => {
          this.TaskState = response.data.results[0].status;
          this.Detail = response.data.results[0].desc;
          this.TaskName = response.data.results[0].title;
          this.TaskType =  response.data.results[0].type;
          this.developer = response.data.results[0].developer;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
        formatdetailhtml(detail){
          return '<p>'+detail.replace(/\n*$/g,'').replace(/\n/g, '</p> <p>')+'</p>'
        },
        changeOutput() {
          var fileInput = document.getElementById("outputFile");
          var file = fileInput.files[0];
          var task_id = this.task;
          var formData = new FormData();
          formData.append('config_file',file);
          console.log(formData);
          renewOutput(task_id, formData).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);
              this.$confirm('error:+String(response)', 'tip', {
                confirmButtonText: 'confirm',
                type: 'warning'
              });
            }
          }).catch(function (error) {console.log(error);});
        },
        InputTypeFormat(row, column, cellValue, index){
          if(cellValue=='Date'){
            return 'date';
          }
          else if(cellValue=='DateTime'){
            return 'time';
          }
          else if(cellValue=='File'){
            return 'file';
          }
          else if(cellValue=='String'){
            return 'string'
          }
          else if(cellValue=='Number'){
            return 'number'
          }
          else if(cellValue=='List'){
            return 'list'
          }
        },
        changeModel() {
          let param ={
            'status':this.TaskState,
            'desc':this.Detail,
            'title':this.TaskName,
            'developer':this.developer,
            'type':this.TaskType
          };
          if(this.Detail.length===0){
            this.$message({
              type: 'info',
              message: 'vacant detail'
            });
            return
          }
          UpdateSon(this.task, param).then((response) =>{
            if (response.status == 200) {
              this.$message({
              type: 'info',
              message: 'change successfully'
              });
            }
            else{console.log(response);}
          }).catch(function (error) {
            console.log(error);
            this.$message({
              type: 'info',
              message: 'change failed'
            });
          });
        }
      }
    }
</script>

<style scoped>

</style>
