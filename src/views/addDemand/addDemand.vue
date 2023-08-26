<template>
  <div class="addDemand">
    <a id="downloadFile"></a>
    <div class="breadcrums">
      <a>Create Requirement</a>
    </div>
    <div class="content">
      <h1>Create Requirement</h1>
      <div class="param" style="height:60px;">
        <label class="paramTitle"><span style="color:red;"> * </span>Title:</label>
        <el-input class="temp1" type="text" v-model="title" ></el-input>
      </div>
      <div class="param">
        <label class="paramTitle"><span style="color:red;"> * </span>Type:</label>
        <el-select v-model="type" >
          <el-option-group label="query" key="query" >
            <el-option  label="research" value="research"></el-option>
            <el-option  label="routine" value="routine"></el-option>
          </el-option-group>
          <el-option-group label="file" key="file" >
            <el-option  label="inquiry" value="inquiry"></el-option>
            <el-option  label="measure" value="measure"></el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle"><span style="color:red;"> * </span>Priority:</label>
        <el-select v-model="priority" >
          <el-option v-for="i in demandPriority" :label="i.value" :value="i.key"></el-option>
          <!--<el-option label="两会专用" value="0"></el-option>-->
          <!--<el-option  label="特急" value="1"></el-option>-->
          <!--<el-option  label="一般" value="2"></el-option>-->
        </el-select>
        <div>
          <span style="color:red;" v-if="priority==='1'" >It will be confirmed by the tech department</span>
        </div>
      </div>
      <div class="param">
        <label class="paramTitle"><span style="color:red;"> * </span>Description:</label>
        <el-input type="textarea" row="1" v-model="desc" ></el-input>
      </div>
      <div class="param">
        <label class="paramTitle">Accessory:</label>
        <el-upload
          class="demandfile"
          ref="demandfile"
          :data="demandType"
          :action="bk_host+'/api/fileupload/'"
          :on-remove="handleRemove"
          multiple
          :auto-upload="true"
          :on-success="addDemandFile"
          :on-preview="showfile"
          :file-list="demandFileList">
          <el-button  size="small" type="primary">choose file</el-button>
        </el-upload>
      </div>
      <div class="param">
        <label class="paramTitle"><span style="color:red;"> * </span>Accordance:</label>
        <el-input type="textarea" row="1" v-model="reason" ></el-input>
      </div>
      <div class="param">
        <label class="paramTitle">Accordance Accessory:</label>
        <el-upload
          class="reasonfile"
          ref="reasonfile"
          :data="reasonType"
          :action="bk_host+'/api/fileupload/'"
          :on-remove="handleRemove"
          multiple
          :auto-upload="true"
          :on-success="addReasonFile"
          :on-preview="showfile"
          :file-list="reasonFileList">
          <el-button  size="small" type="primary">choose file</el-button>
        </el-upload>
      </div>
      <div class="param" v-if="priority==='1' || priority==='0'" >
        <label class="paramTitle">Deadline:</label>
        <el-date-picker type="date" v-model="deadline"></el-date-picker>
      </div>
      <div class="submit-row">
        <el-button class="default" @click="addDemand" >Create</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {bk_host,file_host,createDemand} from '../../api/api'
  import {demandPriority} from '@/common/common'
    export default {
      name: "add-demand",
        data() {
          return {
            bk_host,
            title:"",
            type:"",
            priority:"",
            desc:"",
            reason:"",
            deadline:"",
            demandType:{'type':'req_file'},
            reasonType:{'type':'req_reason_file'},
            demandFileList:[],
            demandPostList:[],
            reasonFileList:[],
            reasonPostList:[],
            demandPriority
          }
        },
      mounted () {
        let d = new Date();
        d.setTime(d.getTime() + 7*24*60*60*1000);
        this.deadline = d;
      },
      methods:{
        addDemand() {
          if (this.desc.toString().length === 0) {
            alert('vacant description');
            return;
          }
          if (this.reason.toString().length === 0) {
            alert('vacant accordance');
            return;
          }
          var c_params = {
            'title': this.title,
            'type': this.type,
            'priority': this.priority,
            'desc': this.desc,
            'requirment_files': this.demandPostList,
            'reason': this.reason,
            'reason_file': this.reasonPostList,
          };
          if (this.priority === '1') {
            c_params['deadline'] = this.deadline.toISOString().substring(0, 10);
            console.log(c_params['deadline']);
            c_params['status'] = "check";
            this.$confirm('It is a emergency requirement.Please connect the tech department.Thanks！', 'Tip', {
              confirmButtonText: 'confirm',
              cancelButtonText: 'do not create',
              type: 'warning'
            }).then(() => {
              createDemand(c_params).then((response) => {
                var status = response.data.status;
                if (status != 'success') {
                  alert(response.data.msg);
                }
                else {
                  // this.$router.push({ name: 'taskList' ,query:{tabStart:'queue'} });
                  this.$router.push({name: 'taskList'});
                }
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'created failed'
              });
            });
          }
          else {
            createDemand(c_params).then((response) => {
              var status = response.data.status;
              if (status != 'success') {
                alert(response.data.msg);
              }
              else {
                // this.$router.push({ name: 'taskList' ,query:{tabStart:'queue'} });
                this.$router.push({name: 'taskList'});
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        },
        handleRemove(file, fileList){
          console.log(file);
          if(file.hasOwnProperty('id')){
            console.log('已有文件');
            console.log(file);
          }
          else{
            console.log('新上传文件');
            console.log(file);
          }
        },
        addDemandFile(response, file, fileList) {
          this.demandPostList.push(response.id);
        },
        addReasonFile(response, file, fileList) {
          this.reasonPostList.push(response.id);
        },
        showfile(file){
          var downloadFile = document.getElementById('downloadFile');
          if(file.hasOwnProperty('response')){
            downloadFile.setAttribute('href',file_host+'/'+file.response.path);
            downloadFile.setAttribute('download',file.response.raw_name);
            downloadFile.click()
          }
          if(file.hasOwnProperty('url')){
            downloadFile.setAttribute('href',file_host+'/'+file.url);
            downloadFile.setAttribute('download',file.name);
            downloadFile.click()
          }
        }
      }
    }
</script>

<style>
  .el-input--suffix {

  }
  .temp1{
    height:25px;
  }
  .el-textarea{
    width:50% !important;
  }
</style>
