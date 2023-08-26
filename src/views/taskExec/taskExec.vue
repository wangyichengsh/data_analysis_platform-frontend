<template>
  <div id="taskExec">
    <div class="breadcrums" v-if="modelTask!=='true'" >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail', query:{parentId:parentId, task:taskId,versionId:versionId} }"> {{ versionId }} </router-link> &nbsp;›
      <a>{{ taskVersion+":"+ taskName }}</a>
    </div>
    <div class="breadcrums" v-if="modelTask==='true'" >
      <a>Query Page</a>&nbsp;›&nbsp;
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId, modelTask:true} }" >{{ taskName }}</router-link>
    </div>
    <div class="content">
      <div class="inputParam" style="margin-bottom: 10px;height:15px;">
        <div class="inputTitle" >{{ taskName }}</div>
      </div>
      <el-card style="margin-top: 20px;" >
        <div slot="header">
          <span>Input</span>
          <a class="jump" href="#submit_m"><button>query page</button></a>
        </div>
      <div id="param_set">
        <div v-for="(input,index) in inputParams">
          <div class="inputParam" v-if="input.type==='Date'">
            <div class="inputTitle" style="margin-top:15px;" >{{ input.name }}:</div>
            <div class="param_tab">
              <el-date-picker :id="input.id" type="date" v-model="input.null" placeholder="select date"  ></el-date-picker>
              <!--<input :id="input.id" type="date" name="date" :value="input.default_value">-->
            </div>
          </div>
          <div class="inputParam" v-if="input.type==='DateTime'">
            <div class="inputTitle">{{ input.name }}:</div>
            <div class="param_tab">
              <input :id="input.id" type="datetime-local" name="datetime" v-model="input.default_value">
            </div>
          </div>
          <div class="inputParam" v-if="input.type==='List'">
            <div class="inputTitle">{{ input.name }}:</div>
            <div class="param_tab">
              <textarea :id="input.id"  class="mytextarea"  v-model="input.default_value" ></textarea>
            </div>
          </div>
          <div class="inputParam" v-if="input.type==='File'">
            <div class="inputTitle">{{ input.name }}:</div>
            <div class="param_tab">
              <div class="Sample">
                <a class="fileSample" :href="file_host+'/static/sample/'+input.default_value+'.xlsx'" :download="taskName+'_sample.xlsx'"><button>download sample</button></a>
              </div>
              <input class="fileInput" :id="input.id" type=file name="file">
            </div>
          </div>
          <div class="inputParam" v-if="input.type==='String' || input.type==='Number'">
            <div class="inputTitle">{{ input.name }}:</div>
            <div class="param_tab">
              <input :id="input.id" type="text" name="other" v-model="input.default_value">
            </div>
          </div>
        </div>
      </div>
        <div class="execButton">
          <button name="submit_m" id="submit_m" @click="execSQL" >execute</button>
          <button v-if="isStaff" @click="execTest" >return sql code</button>
        </div>
      </el-card>

      <div id="execInfo"></div>
    </div>
  </div>
</template>

<script>
    import {bk_host,file_host,queryTaskDetail,queryInput,querySonVersion, UpdateSon, execSqlTest,queryUser} from '../../api/api'
    import { getLocalStore } from '@/utils/storageUtil';
    var conf_file_xhr;
    function  state_Change() {
      var res = document.getElementById("execInfo");
      if(conf_file_xhr.readyState == 1){
        res.innerHTML = "Loading...."
      }
      if(conf_file_xhr.readyState == 4){
        if(conf_file_xhr.status == 200){
          res.innerHTML = "Please check the execution process at Query History Page"
          alert('Start Executing');
          location.reload();
        }
      }
    }
    export default {
        name: "taskExec",
        data(){
          return {
            bk_host,
            file_host,
            isStaff:false,
            taskId:"",
            taskName: "",
            versionId:"",
            parentName:"",
            parentId:"",
            taskVersion: "",
            inputParams:[],
            username:getLocalStore('name'),
            modelTask:false
          }
        },
      created () {
        this.taskId = this.$route.query.taskId;
        this.modelTask = String(this.$route.query.modelTask);
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
            this.isStaff = response.data[0].is_staff;
        }).catch(function (error) {console.log(error);});
        querySonVersion(this.taskId).then((response) => {
          this.parentName = response.data[0].parent_name;
          this.parentId = response.data[0].parent_task;
          this.taskVersion = response.data[0].version_num;
          this.versionId = response.data[0].version_id;
        }).catch(function (error) {console.log(error);});
        queryTaskDetail(this.taskId).then((response) => {
          this.taskName = response.data.results[0].title;
          // eslint-disable-next-line handle-callback-err
        }).catch(function (error) {console.log(error);});
        queryInput(this.taskId).then((response) => {
          this.inputParams = response.data;
          // eslint-disable-next-line handle-callback-err
        }).catch(function (error) {console.log(error);});
      },
      methods:{
          execSQL () {
            conf_file_xhr = new XMLHttpRequest();
            var formData = new FormData();
            var task_id = this.$route.query.taskId;
            var token = getLocalStore('token');
            var name = getLocalStore('name');
            var param_tab = document.getElementsByClassName('param_tab');
            for(let i=0;i<param_tab.length;i ++){
              var inputDom = param_tab[i].getElementsByTagName("input")[0];
              if(typeof(inputDom)==='undefined'){
                var inputDom = param_tab[i].getElementsByTagName("textarea")[0];
              }
              var key = inputDom.id;
              if (inputDom.type=="file"){
                var val = inputDom.files[0];
              }else {
                var val = inputDom.value;
              }
              formData.append(key,val);
              // console.log(key);
              // console.log(val);
            }
            // console.log(formData);
            conf_file_xhr.open("POST",bk_host+'/api/exectask/'+task_id+'/',true);
            conf_file_xhr.setRequestHeader('Authorization','Token '+token);
            conf_file_xhr.onload  = state_Change;
            conf_file_xhr.send(formData);
          },
        execTest () {
          conf_file_xhr = new XMLHttpRequest();
          var formData = new FormData();
          var task_id = this.$route.query.taskId;
          var token = getLocalStore('token');
          var name = getLocalStore('name');
          var param_tab = document.getElementsByClassName('param_tab');
          for(let i=0;i<param_tab.length;i ++){
            var inputDom = param_tab[i].getElementsByTagName("input")[0];
            if(typeof(inputDom)==='undefined'){
              var inputDom = param_tab[i].getElementsByTagName("textarea")[0];
            }
            var key = inputDom.id;
            if (inputDom.type=="file"){
              var val = inputDom.files[0];
            }else {
              var val = inputDom.value;
            }
            formData.append(key,val);
          }
          execSqlTest(task_id, formData).then((response) => {
            if (response.status == 200) {
              var blob = new Blob([response.data], {type: "text/plain"});
              var objectUrl = URL.createObjectURL(blob);
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              a.href = objectUrl;
              a.download = 'allsql';
              a.click();
              document.body.removeChild(a);
            }
            else {
              console.log(response);
            }
          }).catch(function (error) {
            console.log(error);
          });
        },
        changeTitle(){
            var param = {'title':this.taskName};
          UpdateSon(this.taskId,param).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style>
  #param_set h1{
    float: left;
  }
  .jump{
    float:right;
    margin-left: 85%;
    position: fixed;
  }
  .inputParam{
    width:100%;
    border-bottom:1px solid #eee;
    padding: 10px;
    font-size:13px;
  }
  .inputTitle{
    width:300px;
    float:left;
    font-weight:bold;
  }
  .param_tab{
  }
  .Sample{
    float: left;
    width:140px;
  }
  .fileSample{
  }
  .fileInput{
  }
  .execButton{
    width:100%;
    height:30px;
    padding:0px 20px;
  }
  #submit_m{
    margin:10px;
  }
  #execInfo{
    margin: 10px;
  }
  .mytextarea{
    height:200px;

  }
</style>
