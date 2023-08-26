<template>
    <div id="taskDetail">
      <a id="downloadFile"></a>
      <div class="breadcrums">
        <router-link :to="{ name: 'demandDetail',query:{demandId:parentId}}">{{ parentName }}</router-link>&nbsp;›
        <a>{{ versionId}}</a>&nbsp;›
        <a>{{ sonTaskName }}</a>
      </div>
      <div class = "content">
        <el-steps :active="stateStep" simple>
          <el-step title="confirming"></el-step>
          <el-step title="in queue"></el-step>
          <el-step title="developing"></el-step>
          <el-step title="finished"  v-if="stateStep!=='repairing'" ></el-step>
          <el-step title="fixing bug" v-if="stateStep==='repairing'" ></el-step>
        </el-steps>
        <div class="param">
          <router-link v-if="sonTaskType==='module'"  style="margin-left: 3px;" :to="{ name: 'taskExec',query:{taskId:currentTask} }"><button>query page</button></router-link>
          <router-link :to="{ name: 'taskBackend',query:{taskId:currentTask}}"  v-if="isStaff===true"><button>config page</button></router-link>
        </div>
        <div class="param">
          <label class="paramTitle" >requirement title:</label>
          <label>{{parentName}}</label>
          <input v-if="currentTaskState === 1" id="parentName" type="text" name="demandName" v-model="parentName" >
          <button style="margin-left: 10px;" v-if="currentTaskState === 1" @click="changeParentTitle" > change title </button>
        </div>
        <div class="param">
          <label class="paramTitle" >version:</label>
          <select id="version" v-model="currentTask" @change="showIOput">
            <option v-for="version in versionList" :value="version.son_task">{{ version.version_num }}</option>
          </select>
          <!-- <router-link v-if="sonTaskType==='module'"  style="margin-left: 3px;" :to="{ name: 'taskExec',query:{taskId:currentTask} }"><button>query page</button></router-link>
          <router-link :to="{ name: 'taskBackend',query:{taskId:currentTask}}"  v-if="isStaff===true"><button>config page</button></router-link> -->
          <div style="margin-top: 20px;margin-left: 11.5%;" v-if="isStaff===true">
            <button @click="changeVersion" >change</button>
            <router-link :to="{ name: 'addVersion',query:{parentId:parentId,versionId:versionId}}" ><button>create new version</button></router-link>
            <button @click="deletedetail" style="margin-left:40%;background-color: red;" >delete version</button>
          </div>
          </div>
        <div class="param">
          <label class="paramTitle" >task name:</label>
          <input type="text" v-model="sonTaskName">
        </div>
        <div class="param">
          <label class="paramTitle" >status:</label>
          <select id="state">
            <option v-for="(state,index) in stateMap" :value="index" :selected="currentTaskState==index">{{ state }}</option>
          </select>
        </div>
        <div class="param" v-if="isStaff===true" >
          <label class="paramTitle" >type:</label>
          <el-select id="type" v-model="sonTaskType" >
            <el-option  label="file" value="file"></el-option>
            <el-option  label="query" value="module"></el-option>
          </el-select>
          <button @click="changeType" >change type</button>
        </div>
        <div class="param" v-if="isStaff!=true" >
          <label class="paramTitle" >type:</label>
          <span v-if="sonTaskType==='file'" >file</span>
          <span v-if="sonTaskType==='module'" >query</span>
        </div>
        <div class="param">
          <label class="paramTitle" >detail:</label>
          <textarea v-model="versionDetail" style="width:900px;height:100px;" ></textarea>
        </div>
        <div class="param">
          <label class="paramTitle">developer:</label>
          <select id="developer" v-model="developer" >
            <option v-for="user in userList" :value="user.id">{{user.full_name}}</option>
          </select>
        </div>
        <div class="submit-row"  v-if="currentTaskState==='confirmingi'" >
          <button class="default" @click="confirmTask" >confirm</button>
        </div>
        <el-card class="box-card" style="margin-top: 20px;" shadow="hover" v-if="sonTaskType!=='file'" >
          <div slot="header" class="clearfix" >
            <span >input</span>
            <router-link  style="float: right; padding: 3px 0" v-if="currentTaskState === 'confirming' || isStaff===true" :to="{ name: 'inputAdd',query:{taskId:currentTask} }"><button >create input</button></router-link>
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
              <el-table-column  label="operation" width="110" v-if="currentTaskState === 'confirming' || isStaff===true" >
                <template slot-scope="scope" >
                  <el-button size="mini"><router-link :to="{ name: 'changeInputSimple',query:{inputId:scope.row.id}}">edit</router-link></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;" shadow="hover" v-if="sonTaskType!=='file'" >
          <div slot="header">
            <span>output</span>
            <div  v-if="currentTaskState == 'confirming' || isStaff===true" style="float: right; padding: 3px 0"  >
              <input type="file" id="outputFile" ><button @click="changeOutput">upload fild excel</button>
            </div>
          </div>
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item v-for="(outputSheet,index) in outputParam" :title="outputSheet.name" :name="outputSheet.sheet_output_id">

                <div v-if="outputSheet.detail.length>0" style="margin:10px;" v-html="formatdetailhtml(outputSheet.detail)" ></div>

                <el-table
                  :data="outputSheet.columns"
                  style="width: 100%">

                  <el-table-column type="expand" v-if="OutputFeed_all.length>0" >
                    <template slot-scope="props">
                         <el-card class="box-card" shadow="hover" v-for="feed in OutputFeed_map[props.row.id]" v-if="OutputFeed_all.indexOf(props.row.id)!==-1" style="width:30%;float:left;margin:5px 10px 5px 10px" >
                            <div slot="header" class="clearfix" style="height:auto;" >
                              <span >{{feed.feedto}}</span>
                              <router-link style="float:right;" :to="{ name: 'outputFeed',query:{feedId:feed.id, demandId:parentId}}">edit feedback</router-link>
                            </div>
                            <div style="height:70px;">
                              <span>{{ feed.feedback }}</span>
                            </div>
                          </el-card>
                    </template>
                  </el-table-column>


                  <el-table-column
                    prop="name"
                    label="name"
                    width="400">
                    <template slot-scope="scope" >
                        <span v-if="OutputFeed_un.indexOf(scope.row.id)!==-1" style="color:red;" >{{scope.row.name}}</span>
                        <span v-if="OutputFeed_un.indexOf(scope.row.id)===-1 && OutputFeed_all.indexOf(scope.row.id)!==-1" style="font-weight:bold;" >{{scope.row.name}}</span>
                        <span v-if="OutputFeed_un.indexOf(scope.row.id)===-1 && OutputFeed_all.indexOf(scope.row.id)===-1" >{{scope.row.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="detail"
                    label="detail">
                  </el-table-column>
                  <el-table-column  label="operation" width="200" v-if="currentTaskState === 'confirming' || isStaff===true" >
                    <template slot-scope="scope" >
                      <el-button size="mini"><router-link :to="{ name: 'changeOutputSimple',query:{outputId:scope.row.id, taskId:currentTask}}">edit</router-link></el-button>
                      <el-button size="mini" v-if="isStaff===true" ><router-link :to="{ name: 'outputFeed',query:{demandId:parentId, taskId:currentTask, outputId:scope.row.id}}" >add question</router-link></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;" shadow="hover" v-if="sonTaskType==='file'">
          <div slot="header">
            <span>result file</span>
          </div>
          <el-upload
            class="demandfile"
            ref="resfile"
            :data="{'type':'res_file','task':currentTask}"
            :action="bk_host+'/api/fileupload/'"
            :on-remove="handleResRemove"
            multiple
            :auto-upload="true"
            :on-preview="showfile"
            :file-list="resFileList">
            <el-button  size="small" type="primary">choose file</el-button>
          </el-upload>
        </el-card>
      </div>
    </div>
</template>

<script>
    import {bk_host,file_host, queryUser, deleteResFile, queryResFile, queryParentDetail, queryParentVersion, queryInput, queryOutput, renewVersion, deleteVersion, queryTaskDetail ,renewOutput, UpdateParent, queryVersionId, UpdateSon, querySonVersion, UpdateVersion, queryVersionSeq, hasNewFeedTask, getOutputFeed} from '../../api/api';
    import { getLocalStore } from '@/utils/storageUtil';
    import ElBadge from "element-ui/packages/badge/src/main";
    import { stateMap } from '@/common/common'
    export default {
      components: {ElBadge},
      name: "taskDetail",
        data(){
          return {
            bk_host,
            file_host,
            username:getLocalStore('name'),
            userList:[],
            isStaff:false,
            versionId:"",
            parentId:"",
            parentName:"",
            sonTaskName:"",
            sonTaskType:"",
            seq:"",
            developer:"",
            versionList:[],
            currentTask:0,
            currentTaskState:"",
            stateStep:0,
            currentTaskVersion:0,
            stateMap,
            versionDetail:"",
            inputParam:[],
            outputParam:[],
            version2task:new Map(),
            activeName: undefined,
            resFileList:[],
            OutputFeed:[],
            OutputFeed_map:{},
            OutputFeed_un:[],
            OutputFeed_all:[]
          }
        },
      created () {
        this.versionId = this.$route.query.versionId;
        this.parentId = this.$route.query.parentId;
        this.task = this.$route.query.task;
        this.activeName = this.$route.query.activeName;
        if(this.activeName===-1){
          this.$message({
            type: 'info',
            message: 'Table or field does not exist'
          })
        }
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
        }).catch(function (error) {console.log(error);});
        queryUser({ params: {is_staff:true}} ).then((response) => {
          this.userList = response.data;
        }).catch(function (error) {console.log(error);});
        queryParentDetail(this.parentId).then((response) => {
          this.parentName = response.data.results[0].title;
          this.seq = response.data.results[0].seq;
          getOutputFeed(this.seq).then((response) => {
            this.OutputFeed = response.data;
            for(let i in this.OutputFeed){
              if(this.OutputFeed[i].if_feed===false){
                this.OutputFeed_un.push(this.OutputFeed[i].model_id)
              }
              this.OutputFeed_all.push(this.OutputFeed[i].model_id)
              if( this.OutputFeed_map.hasOwnProperty(this.OutputFeed[i].model_id)){
                this.OutputFeed_map[this.OutputFeed[i].model_id].push(this.OutputFeed[i]);
              }
              else{ this.OutputFeed_map[this.OutputFeed[i].model_id] = [this.OutputFeed[i]];}
            }
            console.log(this.OutputFeed_map);
          }).catch(function (error) {console.log(error);});
          queryVersionSeq(this.seq, this.versionId).then((response) => {
            this.versionList = response.data;
            for(let i in this.versionList){
              this.version2task.set(Number(this.versionList[i].son_task) , i );
            }
            // 获取最新子任务id
            if (response.data.length>0) {
              let version = response.data[0];
              if(typeof(this.task)!== "undefined"){
                this.currentTask = this.task;
              }else {
                this.currentTask = version.son_task;
              }
            }
            //获取子任务id后 渲染输入输出页面
            this.showIOput(this.currentTask);

            // eslint-disable-next-line handle-callback-err
          }).catch(function (error) {console.log(error);});
        }).catch(function (error) {console.log(error);});
      },
      methods:{
          formatdetailhtml(detail){
            return '<p>'+detail.replace(/\n*$/g,'').replace(/\n/g, '</p> <p>')+'</p>'
          },
          getStatusCode(stat){
            if(stat==='confirming'){
              return 0;
            }
            else if(stat==='ranking'){
              return 1;
            }
            else if(stat==='developing'){
              return 2;
            }
            else if(stat==='finished'){
              return 3;
            }
            else if(stat==='repairing'){
              return 3;
            }
          },
        confirmTask(){
          hasNewFeedTask(this.task).then((response) =>{
            if(response.data['newfeed']){
              this.$confirm('There are output feedbacks waiting for response!', 'Tip', {
                confirmButtonText: 'confirm',
                type: 'warning'
              })
            }else{
              this.$confirm('Whether Inputs, Outputs and Feedbacks have been confirmed?', 'Tip', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
              }).then(() => {
                var params = {
                  'status': 'ranking',
                };
                UpdateSon(this.currentTask, params).then((response) =>{
                  if (response.status == 200) {location.reload();}
                  else{console.log(response);}
                }).catch(function (error) {console.log(error);});
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: 'unconfirmed'
                });
              });
            }
          }).catch(function (error) {console.log(error);});
        },
        changeType(){
          var param = {
            'type':this.sonTaskType
          };
          UpdateSon(this.currentTask, param).then((response) =>{
            if (response.status == 200) {location.reload();
            }
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        showfile(file){
          var downloadFile = document.getElementById('downloadFile');
          if(file.hasOwnProperty('response')){
            downloadFile.setAttribute('href',file_host+'/'+file.response.path);
            downloadFile.setAttribute('download',file.response.raw_name);
            downloadFile.click()
          }
          if(file.hasOwnProperty('url')){
            downloadFile.setAttribute('href',file.url);
            downloadFile.setAttribute('download',file.name);
            downloadFile.click()
          }
        },
        handleResRemove(file, fileList){
          if(file.hasOwnProperty('id')){
            var id = file.id;
          }
          else{
            var id = file.response.id;
          }
          deleteResFile(id).then((response) => {
            status = response.data.status;
            if (status != 'success') {
              console.log(response.data.msg);
            } else {
              alert('delete successfully');
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
        showIOput() {
          var taskID = this.currentTask;
          this.versionDetail = this.versionList[this.version2task.get(Number(this.currentTask))].version_detail;
          queryInput(taskID).then((response) => {
            this.inputParam = response.data;
          }).catch(function (error) {console.log(error);});
          queryOutput(taskID).then((response) => {
            this.outputParam = response.data;
            if(this.outputParam.length>0 && typeof(this.activeName)==="undefined"){
              this.activeName = this.outputParam[0].sheet_output_id;
            }
          }).catch(function (error) {console.log(error);});
          queryTaskDetail(taskID).then((response) => {
            this.currentTaskState = response.data.results[0].status;
            this.stateStep = this.getStatusCode(this.currentTaskState);
            this.versionDetail = response.data.results[0].desc;
            this.sonTaskName = response.data.results[0].title;
            this.sonTaskType =  response.data.results[0].type;
            this.developer = response.data.results[0].developer;
          }).catch(function (error) {console.log(error);});
          this.resFileList = [];
          queryResFile(this.currentTask).then((response) =>{
            var filelist = response.data;
            for (var i in filelist) {
              this.resFileList.push({
                'id': filelist[i].id,
                'url': file_host + '/' + filelist[i].file_path,
                'name': filelist[i].file_name
              });
            };
          }).catch(function (error) {console.log(error);});
        },
        showdetail(eve) {
          var temp = eve.explicitOriginalTarget;
          if(typeof(temp)=="undefined"){
            temp = eve.toElement;
          }
          var param = temp.parentElement.parentElement;
          var detail = param.getElementsByClassName("outputSheetDetail")[0];
          if(detail.style.display == "none" || detail.style.display == ""){
            detail.style.display = "block";
          }
          else{
            detail.style.display = "none";
          }
        },
        changeVersion() {
          var state = document.getElementById('state').value;
          let param ={
            'status':state,
            'desc':this.versionDetail,
            'title':this.sonTaskName,
            'developer':this.developer
          };
          if(this.versionDetail.length===0){
            this.$message({
              type: 'info',
              message: 'vacant detail'
            });
            return
          }
          UpdateSon(this.currentTask, param).then((response) =>{
                if (response.status == 200) {
                  this.$message({
                    type: 'info',
                    message: 'edit successfully'
                  });
                }
                else{
                  console.log(response);
                  this.$message({
                    type: 'info',
                    message: 'edit failed'
                  });
                }
              }).catch(function (error) {console.log(error);});
          if(this.sonTaskType ==="module" && state==="finished"){
            var version_id_id = undefined;
            querySonVersion(this.currentTask).then((response) => {
              console.log(response.data);
              var version_id_id = response.data[0].id;
              if(typeof(version_id_id)==="undefined"){
                this.$message({
                  type: 'info',
                  message: 'Edit version table failed!Please edit it at django management page!'
                });
              }
              else {
                var param = {
                  "if_exec": true
                };
                UpdateVersion(version_id_id, param).then((response) => {
                  if (response.status == 200) {
                    location.reload();
                    this.$message({
                      type: 'info',
                      message: 'edit successfully'
                    });
                  }
                  else {
                    console.log(response);
                    this.$message({
                      type: 'info',
                      message: 'edit failed'
                    });
                  }
                }).catch(function (error) {
                  console.log(error);
                  this.$message({
                    type: 'info',
                    message: 'edit failed'
                  });
                });
              }
            }).catch(function (error) {console.log(error);});
          }
          else if(this.sonTaskType ==="module" && state!="finished"){
            var version_id_id = undefined;
            querySonVersion(this.currentTask).then((response) => {
              console.log(response.data);
              var version_id_id = response.data[0].id;
              if(typeof(version_id_id)==="undefined"){
                this.$message({
                  type: 'info',
                  message: 'Edit version table failed!Pleause edit it at django management page!'
                });
              }
              else {
                var param = {
                  "if_exec": false
                };
                UpdateVersion(version_id_id, param).then((response) => {
                  if (response.status == 200) {
                    location.reload();
                    this.$message({
                      type: 'info',
                      message: 'edit successfully'
                    });
                  }
                  else {
                    console.log(response);
                    this.$message({
                      type: 'info',
                      message: 'edit failed'
                    });
                  }
                }).catch(function (error) {
                  console.log(error);
                  this.$message({
                    type: 'info',
                    message: 'edit failed'
                  });
                });
              }
            }).catch(function (error) {
              console.log(error);
              this.$message({
                type: 'info',
                message: 'edit failed'
              });
            });
          }
        },
        deletedetail() {
          var params = {'task_id':this.currentTask};
          deleteVersion(params).then((response) => {
            status = response.data.status;
            if (status != 'success') {
              console.log(response.data.msg);
            } else {
              alert('delete successfully');
              location.reload();
            }
          }).catch(function (error) {console.log(error);});
        },
        changeOutput() {
          var fileInput = document.getElementById("outputFile");
          var file = fileInput.files[0];
          if(typeof(file)==='undefined'){
            this.$message({
              type: 'info',
              message: 'vacant upload file'
            });
            return
          }
          var task_id = this.currentTask;
          var formData = new FormData();
          formData.append('config_file',file);
          console.log(formData);
          this.$confirm('This operation will overwright all the output config(can not recover)', 'Tip', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Not',
            type: 'warning'
          }).then(() => {
            renewOutput(task_id, formData).then((response) =>{
              if (response.status == 200) {location.reload();}
              else{console.log(response);
              this.$confirm('error:+String(response)', 'Tip', {
                confirmButtonText: 'Confirm',
                type: 'warning'
              });
              }
            }).catch(function (error) {console.log(error);});
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'change failed'
            });
          });
        },
        changeParentTitle() {
          var params = {'title':this.parentName};
          UpdateParent(this.parentId, params).then((response) =>{
        if (response.status == 200) {location.reload();}
        else{console.log(response);}
      }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style>
  .outputSheetDetail{
    display: none;
    margin-bottom: 20px;
  }
  .inputSet{
    margin: 5px;
    padding: 5px;
  }
  .outputSet{
    margin: 5px;
    padding: 5px;
  }
  .title-row{
    margin-left: 43%;
    margin-bottom: 10px;
    font-size:16px;
  }
  .outputSheet{
    margin: 5px;
  }
  .title{
    font-size: 15px;
  }
  .el-collapse-item__header{
    font-weight: bold;
  }
  .el-collapse-item__header is-active{

  }
</style>
