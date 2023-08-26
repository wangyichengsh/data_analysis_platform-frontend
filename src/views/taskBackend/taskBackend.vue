<template>
    <div class="taskBackend"  >
      <!-- 导航栏 -->
      <div class="breadcrums" v-if="modelTask!=='true'" >
        <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
        <router-link :to="{ name: 'taskDetail', query:{parentId:parentId, task:taskId,versionId:versionId} }"> {{ versionId }} </router-link> &nbsp;›
        <a>{{ taskVersion+":"+ taskName }}</a>
      </div>
      <div class="breadcrums" v-if="modelTask==='true'" >
        <a>query</a>&nbsp;›&nbsp;
        <a>{{ taskName }}</a>
      </div>
      <div class="content" v-if="isStaff==true" >
        <div style="position: fixed;margin-left:85%;font-size: 16px;">
          <div><a href="#input_param_m">Input</a></div>
          <div><a href="#output_param_m">Output</a></div>
          <div><a href="#sql_code_m">Code</a></div>
        </div>
        <div >
          <button><a :href="bk_host+'/api/config/'+taskId+'/'">download config xlsx</a></button>
          <button><a :href="bk_host+'/api/configpickle/'+taskId+'/'">download config pickle</a></button>
          <input id="configFile" type="file">
          <button @click="UpdateConfig">incremental update</button>
          <button style="background-color: red;" @click="RenewConfig" >reset&update</button>
          <label>Sql code length is limited when using excel update!Please check sql code.</label>
        </div>
        <hr>
        <!-- 配置 -->
        <div class="paramSet">
          <div>
            <input type="text"  v-model="taskName">
            <button @click="changeTitle" >change name</button>
          </div>
          <el-card style="margin-top: 20px;" shadow="hover" >
            <div slot="header">
              <span>Input</span>
              <router-link style="float: right; padding: 3px 0" v-if="modelTask!=='true'" :to="{ name: 'inputAdd',query:{taskId:taskId} }"><button>create input</button></router-link>
              <router-link style="float: right; padding: 3px 0" v-if="modelTask==='true'" :to="{ name: 'inputAdd',query:{taskId:taskId, modelTask:true} }"><button>create input</button></router-link>

            </div>
          <div id="input_param_m" >
            <div class="param" v-for="input in inputParam" :input_id="input.id" >
              <label class="paramTitle" style="width:100%;margin-bottom: 10px;" >{{input.name}}</label>
              <input class="dinputtitle" type="text" style="float:left;" :value="input.name">
              <div style="float:left;width:50px;margin-left:10px;" >type：</div>
              <div style="float:left;width:75px;">
                <select class="dinputtype">
                  <option value="String" :selected="input.type=='String'">string</option>
                  <option value="Date" :selected="input.type=='Date'">date</option>
                  <option value="DateTime" :selected="input.type=='DateTime'">time</option>
                  <option value="Number" :selected="input.type=='Number'" >number</option>
                  <option value="File" :selected="input.type=='File'" >file</option>
                  <option value="List" :selected="input.type=='List'" >list</option>
                </select>
              </div>
              <div style="float:left;width:50px;margin-left:20px;" >order：</div>
              <div style="float: left;" >
                <input class="dinputidd" style="width:30px;" type="number" :value="input.input_id">
              </div>
              <div style="float: left;margin-left: 10px;" v-if="input.type!=='File' && input.type!=='List'" >
                  <div style="float: left;margin-left: 20px;width:70px;">replace key:</div><div style="float: left;width:200px"><input class="dreplacekey" type="text" input_id="input.id" :value="input.replace_key" ></div>
                  <div style="float: left;margin-left: 20px;width:70px;" >default:</div><div style="float: left;width:200px"><input class="ddefault" type="text" input_id="input.id" :value="input.default_value" ></div>
              </div>
              <div style="float: left;margin-left: 10px;" v-if="input.type==='File'" >
                <div style="float: left;margin-left: 20px;width:70px;">abandoned field:</div><div style="float: left;width:200px"><input class="dreplacekey" type="text" input_id="input.id" :value="input.replace_key" ></div>
                <div style="float: left;margin-left: 20px;width:90px;" >upload sample file prefix:</div><div style="float: left;width:200px"><input class="ddefault" type="text" input_id="input.id" :value="input.default_value" ></div>
                <router-link :to="{ name: 'fileConfig',query:{inputId:input.id, modelTask: modelTask}}">
                  <button style="margin-left: 18px;">configure upload file</button>
                </router-link>
              </div>
              <div style="float: left;margin-left: 10px;" v-if="input.type==='List'" >
                <div style="float: left;margin-left: 20px;width:70px;" >default:</div><div style="float: left;width:200px"><input class="ddefault" type="text" input_id="input.id" :value="input.default_value" ></div>
                <router-link :to="{ name: 'fileConfig',query:{inputId:input.id, modelTask: modelTask}}">
                  <button style="margin-left: 18px;">configure list</button>
                </router-link>
              </div>
              <div style="float:left;margin-left:20px;">
                <button @click="ChangeInput" v-if="input.type!=='List'" >change</button>
                <button @click="ChangeInput_List" v-if="input.type==='List'" >change</button>
                <button style="margin-left: 10px;background-color: red;" @click="DelInput(input.id)">delete</button>
              </div>
              <div style="float:none;margin:10px;">&nbsp</div>
            </div>
          </div>
          </el-card>
          <el-card style="margin-top: 20px;"  shadow="hover" >
            <div slot="header">
              <span>output</span>
                <router-link style="float: right; padding: 3px 2px;" v-if="modelTask!=='true'" :to="{ name: 'outputSheetAdd',query:{taskId:taskId} }"><button>create output table</button></router-link>
                <router-link style="float: right; padding: 3px 2px;" v-if="modelTask==='true'" :to="{ name: 'outputSheetAdd',query:{taskId:taskId, modelTask:true} }"><button>create output table</button></router-link>

                <router-link style="float: right; padding: 3px 2px;" v-if="modelTask!=='true'" :to="{ name: 'outputColumnAdd',query:{taskId:taskId} }"><button>create output field</button></router-link>
                <router-link style="float: right; padding: 3px 2px;" v-if="modelTask==='true'" :to="{ name: 'outputColumnAdd',query:{taskId:taskId, modelTask:true} }"><button>create output field</button></router-link>
            </div>
          <div id="output_param_m" >
            <div  v-for="output in outputSheet" :output_id="output.id">
              <div class="param" >
                <label class="paramTitle" style="width:200px;margin-bottom: 10px;" >{{output.name}}</label>
                <input class="dsheettitle" type="text" style="float:left;" :value="output.name">
                <input class="dsheetid" type="number" style="float:left;width:30px;margin-left: 10px;" :value="output.sheet_output_id">
                <button style="margin-left: 20px;" @click="ChangeOutputSheet" >change table</button>
                <button style="margin-left: 20px;" @click="showdetail($event)" >hide/display</button>
                <router-link :to="{ name: 'outputSheetDetail',query:{taskId:taskId, sheetId:output.id,modelTask:modelTask} }"><button style="margin-left: 20px;"  >edit</button></router-link>
                <button style="margin-left: 21%;background-color: red;" @click="delOutputSheet(output.id)" >delete</button>
                <div style="float:none;">&nbsp</div>
                <div v-if="output.detail.length>0" style="margin:20px;" v-html="formatdetailhtml(output.detail)" ></div>
              </div>
                <div class="paramDetail" >
                  <div class="param" v-for="column in output.columns" :column_id="column.id" >
                  <label class="paramTitle" style="width:100%;margin-bottom: 10px;" >{{column.name}}</label>
                  <input class="dcolumntitle"  type="text" :value="column.name">
                  <label style="margin-left: 10px;" >replace key：</label>
                  <input class="dcolumnreplacekey" type="text" :value="column.replace_key">
                  <label style="margin-left: 10px;" >table：</label>
                  <select class="dsheetid" >
                    <option v-for="id in SheetIdMap" :value="id[0]" :selected="Number(id[0])===Number(column.sheet)">{{ id[1] }}</option>
                  </select>
                  <button style="margin-left: 10px;" @click="ChangeOutputColumn">change</button>
                  <button style="margin-left: 15.5%;background-color: red;" @click="DelOutput(column.id)">delete</button>
                 </div>
                </div>
            </div>
          </div>
          </el-card>

            <div slot="header" style="margin-top: 20px;">
               <span >code</span>
              <button style="float:right;" @click="CreateSql">create code</button>
            </div>
          <div id="sql_code_m" >

            <div class="param" style="margin-top: 10px;" >
              <label>current executed order：</label>
              <select  v-model="currentSql" @change="sqlchange">
                <option v-for="sql_code in sql" :value="sql_code.id"> {{sql_code.sql_id}}</option>
              </select>
              <label>executed order：</label>
              <input id="sql_id" type="number" v-model="currentSqlId" style="width: 30px;">
              <label>database：</label>
              <el-select v-model="exec_id" >
                <el-option v-for="execfunc in execList"  :label="execfunc.name":value="execfunc.id"></el-option>
              </el-select>
              <label>using output as input：</label>
              <el-select v-model="file_type">
                <el-option label="Yes" value="1"  ></el-option>
                <el-option label="No" value="0"  ></el-option>
              </el-select>
              <label>Display：</label>
              <el-select v-model="display">
                <el-option value="0" label="Yes" ></el-option>
                <el-option value="1" label="No" ></el-option>
              </el-select>
              <label>replace style：</label>
              <el-select v-model="replace_style">
                <el-option value="0" label="%(name)s"></el-option>
                <el-option value="1" label="#{name}" ></el-option>
                <el-option value="2" label="&name" ></el-option>
              </el-select>
              <label>copy output to another database：</label>
              <el-select v-model="if_mulit">
                <el-option :value=true label="Yes"></el-option>
                <el-option :value=false label="No" ></el-option>
              </el-select>
            </div>
            <div style="margin:10px;"  id="sql_text">
              <div class="param" style="margin-top: 10px;"  v-if="if_mulit">
                <label>from database：</label>
                <el-select v-model="from_conn" >
                  <el-option v-for="execfunc in execList"  :label="execfunc.name":value="execfunc.id"></el-option>
                </el-select>
                <label>to database：</label>
                <el-select v-model="to_conn" >
                  <el-option v-for="execfunc in execList"  :label="execfunc.name":value="execfunc.id"></el-option>
                </el-select>
                <label>table name：</label>
                <el-input v-model="table_name" ></el-input>
                <label>whether create this table：</label>
                <el-select v-model="if_create">
                  <el-option :value=true label="Yes"></el-option>
                  <el-option :value=false label="No" ></el-option>
                </el-select>
                <label v-if="if_create" >
                  <label>Whether create temporary table：</label>
                  <el-select v-model="if_temp">
                    <el-option :value=true label="Yes"></el-option>
                    <el-option :value=false label="No" ></el-option>
                  </el-select>
                </label>
              </div>
            </div>

            <button @click="changeSql" >change</button>
            <router-link :to="{ name: 'taskExec',query:{taskId:taskId} }"><button>go to query page</button></router-link>
            <button style="margin-left: 80%;background-color: red;" @click="DelSql">delete</button>
          </div>

        </div>
      </div>



      <textarea id="sql" style="width:940px;height:500px;"></textarea>
    </div>
</template>

<script>
    import CodeMirror from 'codemirror/lib/codemirror'
    import 'codemirror/theme/dracula.css'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/mode/sql/sql'
    import {bk_host, queryUser,querySonVersion, queryInput, UpdateInput, DeleteInput, queryOutput, updateOutput, updateOutputColumn, deleteOutput, deleteOutputSheet, querySql, queryExec, ChangeSql, UpdateSql, DeleteSql, UpdateSon, queryTaskDetail} from '../../api/api'
    import { getLocalStore } from '@/utils/storageUtil';
    var conf_update_xhr;
    var conf_renew_xhr;
    function sel(id,value) {
      var selectblock = document.getElementById(id);
      for(let i=0;i<selectblock.options.length;i++)
      {
        if(selectblock[i].value == value)
        {
          selectblock[i].selected=true;
          break;
        }
      }
    }
    function  updateConfig_Change() {
      if (conf_update_xhr.status ==200){
        alert("更新成功");
        conf_update_xhr = null;
        location.reload();
      }
    }
    function  renewConfig_Change() {
      if (conf_renew_xhr.status ==200){
        alert("更新成功");
        conf_renew_xhr = null;
        location.reload();
      }
    }
    export default {
        name: "taskBackend",
        data () {
          return{
            username:getLocalStore('name'),
            isStaff:false,
            bk_host:bk_host,
            taskId:"",
            taskName:"",
            taskVersion:"",
            versionId:"",
            parentId:"",
            parentName:"",
            inputParam:"",
            SheetIdMap:new Map(),
            outputSheet:[],
            sql:[],
            currentSql:"",
            currentSqlId:"",
            editor:"",
            execList: [],
            exec_id:"",
            file_type:"",
            display:"",
            replace_style:"",
            modelTask:false,
            if_mulit:false,
            from_conn:"",
            to_conn:"",
            table_name:"",
            if_create:false,
            if_temp:false
          }
        },
        created() {
          this.taskId = this.$route.query.taskId;
          this.modelTask = String(this.$route.query.modelTask);
          queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
            this.isStaff = response.data[0].is_staff;
          }).catch(function (error) {console.log(error);});
          queryInput(this.taskId).then((response) => {
            this.inputParam = response.data;
          }).catch(function (error) {console.log(error);});
          queryOutput(this.taskId).then((response) => {
            this.outputSheet = response.data;
            for(let index in this.outputSheet){
              this.SheetIdMap.set(Number(this.outputSheet[index].id) , this.outputSheet[index].name );
            }
          }).catch(function (error) {console.log(error);});
          if(this.modelTask === 'true'){
            queryTaskDetail(this.taskId).then((response) => {
              this.taskName = response.data.results[0].title;
          }).catch(function (error) {console.log(error);});
          }
          else{
            querySonVersion(this.taskId).then((response) => {
            this.parentId = response.data[0].parent_task;
            this.parentName = response.data[0].parent_name;
            this.taskVersion = response.data[0].version_num;
            this.taskName = response.data[0].son_name;
            this.versionId = response.data[0].version_id;
          }).catch(function (error) {console.log(error);});
          }
          queryExec().then((response) => {
            this.execList = response.data;
          }).catch(function (error) {console.log(error);});
        },
      mounted() {
        this.initCodeMirror();
      },
      methods:{
        formatdetailhtml(detail){
          return '<p>'+detail.replace(/\n*$/g,'').replace(/\n/g, '</p> <p>')+'</p>'
        },
          initCodeMirror(){
            var dom = document.getElementById("sql");
            console.log(dom);
            this.editor = CodeMirror.fromTextArea(dom,{
              mode:"sql",
              lineNumbers:true,
              theme:"dracula",
            });
            querySql(this.taskId).then((response) =>{
              this.sql = response.data;
              this.editor.setValue(this.sql[0].code);
              this.currentSql = Number(this.sql[0].id);
              this.currentSqlId = this.sql[0].sql_id;
              this.exec_id = this.sql[0].exec_id;
              this.file_type = String(this.sql[0].file_type);
              this.replace_style = String(this.sql[0].replace_style);
              this.display = String(this.sql[0].display);
              this.if_mulit = this.sql[0].if_mulit;
              this.from_conn = this.sql[0].from_conn;
              if(this.from_conn===null){
                this.from_conn = 0;
              }
              this.to_conn = this.sql[0].to_conn;
              if(this.to_conn===null){
                this.to_conn = 0;
              }
              this.table_name = this.sql[0].table_name;
              this.if_create = this.sql[0].if_create;
              this.if_temp = this.sql[0].if_temp
            }).catch(function (error) {console.log(error);});
            this.editor.setSize('100%','600px');
          },
        showdetail(eve) {
            const temp = eve.currentTarget;
            var param = temp.parentElement.parentElement;
            var detail = param.getElementsByClassName("paramDetail")[0];
            if(detail.style.display == "none" || detail.style.display == ""){
              detail.style.display = "block";
            }
            else{
              detail.style.display = "none";
            }
          },
        sqlchange() {
            for(let sql_code in this.sql) {
              if( this.sql[sql_code].id === this.currentSql ) {
                this.editor.setValue("");
                this.editor.setValue( this.sql[sql_code].code);
                this.currentSqlId = this.sql[sql_code].sql_id;
                this.exec_id = this.sql[sql_code].exec_id;
                this.file_type = String(this.sql[sql_code].file_type);
                this.replace_style = String(this.sql[sql_code].replace_style);
                this.display = String(this.sql[sql_code].display);
                this.if_mulit = this.sql[sql_code].if_mulit;
                this.from_conn = this.sql[sql_code].from_conn;
                if(this.from_conn===null){
                  this.from_conn = 0;
                }
                this.to_conn = this.sql[sql_code].to_conn;
                if(this.to_conn===null){
                  this.to_conn = 0;
                }
                this.table_name = this.sql[sql_code].table_name;
                this.if_create = this.sql[sql_code].if_create;
                this.if_temp = this.sql[sql_code].if_temp;
                break;
              }
            }
        },
        UpdateConfig() {
          conf_update_xhr = new XMLHttpRequest();
          var token = getLocalStore('token');
          var formData = new FormData();
          var fileInput = document.getElementById("configFile");
          var file = fileInput.files[0];
          var task_id = this.$route.query.taskId;
          formData.append('config_file',file);
          conf_update_xhr.open("POST",bk_host+'/api/updateconfig/'+task_id+'/',true);
          conf_update_xhr.setRequestHeader('Authorization','Token '+token);
          conf_update_xhr.onload  = updateConfig_Change;
          conf_update_xhr.send(formData);
        },
        RenewConfig() {
          conf_renew_xhr = new XMLHttpRequest();
          var token = getLocalStore('token');
          var formData = new FormData();
          var fileInput = document.getElementById("configFile");
          var file = fileInput.files[0];
          var task_id = this.$route.query.taskId;
          formData.append('config_file',file);
          conf_renew_xhr.open("POST",bk_host+'/api/renewconfig/'+task_id+'/',true);
          conf_renew_xhr.setRequestHeader('Authorization','Token '+token);
          conf_renew_xhr.onload  = renewConfig_Change;
          conf_renew_xhr.send(formData);
        },
        CreateSql() {
          var params = new URLSearchParams();
          params.append( 'sql_id',this.sql.length+1);
          params.append( 'code','');
          params.append( 'file_type',0);
          params.append( 'display',0);
          params.append( 'replace_style',1);
          params.append( 'task',this.$route.query.taskId);
          params.append( 'exec_id',1);
          ChangeSql(params).then((response) =>{
            if (response.status == 201) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        changeSql(){
          var params = new URLSearchParams();
          params.append( 'id',this.currentSql);
          params.append( 'sql_id',this.currentSqlId);
          params.append( 'code',this.editor.getValue());
          params.append( 'file_type',this.file_type);
          params.append( 'display',this.display);
          params.append( 'replace_style',this.replace_style);
          params.append( 'task',this.$route.query.taskId);
          params.append( 'exec_id',this.exec_id);
          params.append( 'if_mulit',this.if_mulit);
          params.append( 'from_conn',this.from_conn);
          params.append( 'to_conn',this.to_conn);
          params.append( 'table_name',this.table_name);
          params.append( 'if_create',this.if_create);
          params.append( 'if_temp',this.if_temp);
          UpdateSql(this.currentSql, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        DelSql(){
          DeleteSql(this.currentSql).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        DelInput(inputId) {
          DeleteInput(inputId).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        DelOutput(outputId) {
          deleteOutput(outputId).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        ChangeInput(eve){
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var input_id = param.attributes.input_id.value;
          var params = new URLSearchParams();
          params.append( 'name',param.getElementsByClassName("dinputtitle")[0].value);
          params.append( 'type',param.getElementsByClassName("dinputtype")[0].value);
          params.append( 'input_id',param.getElementsByClassName("dinputidd")[0].value);
          params.append( 'default_value',param.getElementsByClassName("ddefault")[0].value);
          params.append( 'replace_key',param.getElementsByClassName("dreplacekey")[0].value);
          params.append( 'task',this.$route.query.taskId);
          UpdateInput(input_id, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        ChangeInput_List(eve){
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var input_id = param.attributes.input_id.value;
          var params = new URLSearchParams();
          params.append( 'name',param.getElementsByClassName("dinputtitle")[0].value);
          params.append( 'type',param.getElementsByClassName("dinputtype")[0].value);
          params.append( 'input_id',param.getElementsByClassName("dinputidd")[0].value);
          params.append( 'default_value',param.getElementsByClassName("ddefault")[0].value);
          params.append( 'task',this.$route.query.taskId);
          UpdateInput(input_id, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        ChangeOutputSheet(eve) {
          const temp = eve.currentTarget;
          var param = temp.parentElement.parentElement;
          var output_id = param.attributes.output_id.value;
          var params = new URLSearchParams();
          params.append('sheet_output_id',param.getElementsByClassName("dsheetid")[0].value);
          params.append('name',param.getElementsByClassName("dsheettitle")[0].value);
          params.append( 'task',this.$route.query.taskId);
          updateOutput(output_id, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        delOutputSheet(outputId) {
          deleteOutputSheet(outputId).then((response) =>{
            if (response.status == 204) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        ChangeOutputColumn(eve){
          const temp = eve.currentTarget;
          var param = temp.parentElement;
          var column_id = param.attributes.column_id.value;
          var params = new URLSearchParams();
          params.append('name',param.getElementsByClassName("dcolumntitle")[0].value);
          params.append('replace_key',param.getElementsByClassName("dcolumnreplacekey")[0].value);
          params.append( 'sheet',param.getElementsByClassName("dsheetid")[0].value);
          updateOutputColumn(column_id, params).then((response) =>{
            if (response.status == 200) {location.reload();}
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
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
  .paramSet{
    margin-top: 20px;
  }
  .paramDetail{
    display: none;
  }
  #input_param_m, output_param_m{
    margin-bottom: 30px;
  }
  .el-select{
    width:180px !important;
  }
  .el-input{
    width:180px !important;
  }
</style>
