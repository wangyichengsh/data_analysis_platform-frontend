<template>
  <div class="outputColumnAdd">
    <div class="breadcrums" v-if="modelTask !== 'true'" >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }">{{ taskVersion+":"+ taskName }}&nbsp;›</router-link>
      <a>Create Output Field</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true} }"  >{{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }"  >Create Output Field</router-link>
    </div>
    <div class="content">
      <div class="param">
        <label class="paramTitle" >table：</label>
        <el-select v-model="sheet">
          <el-option v-for="table in outputSheet" :value="table.id" :label="table.name"></el-option>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle" >name:</label>
        <input type="text" v-model="name">
      </div>
      <div class="param">
        <label class="paramTitle" >description:</label>
        <textarea v-mode="detail"></textarea>
      </div>
      <div class="param">
        <label class="paramTitle" >replace original field:</label>
        <input v-model="replace_key">
      </div>
      <div class="submit-row">
        <button class="default" @click="CreateColumn">create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {querySonVersion, queryOutputSimple, createOutputColumn, queryTaskDetail} from '../../api/api'
    export default {
        name: "outputColumnAdd",
        data() {
          return {
            taskId:"",
            taskName:"",
            taskVersion:"",
            parentId:"",
            parentName:"",
            versionId:"",
            outputSheet:[],
            sheet:"",
            name:"",
            detail:"",
            replace_key:"",
            modelTask:false
          }
        },
      created() {
        this.taskId = this.$route.query.taskId;
        this.modelTask = String(this.$route.query.modelTask);
        queryOutputSimple(this.taskId).then((response) => {
          this.outputSheet = response.data;
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

      },
      methods:{
        CreateColumn() {
          var params = new URLSearchParams();
          params.append( 'sheet',this.sheet);
          params.append( 'name',this.name);
          params.append( 'detail',this.detail);
          params.append( 'replace_key',this.replace_key);
          createOutputColumn(params).then((response) =>{
            if (response.status == 201) {
              if(this.modelTask!=="true") {
                setTimeout(this.$router.push({name: 'taskBackend', query: {taskId: this.taskId}}), 1000);
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

<style >

</style>
