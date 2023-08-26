<template>
    <div class="showRes">
      <div class="breadcrums"  >
        <router-link :to="{ name: 'taskExec', query:{taskId:taskId} }"> {{ taskName }} </router-link>
      </div>
      <div v-if="String(exec_user)===String(user)||String(user)==='58'" style="margin:5px;" >
        <a :href="file_host+'/static/output_file/'+ res"  v-for="res in res_file">
          <button style="margin:5px;" v-if="res.endsWith('xlsx')" >download excel</button>
          <button style="margin:5px;" v-if="res.endsWith('csv')" >download csv</button>
        </a>
      </div>
      <div v-if="String(exec_user)===String(user)||String(user)==='58'" style="margin:5px;" >
        <el-tabs  type="border-card" style="margin-top: 15px;" >
          <el-tab-pane  :label="output.name" v-for="(output,id) in outputParam" >
            <tableRes :sheetNum="id" :jobId="jobId" :output="output" ></tableRes>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
  import {file_host, queryResults, queryOneHistory, queryOutput} from '@/api/api'
  import { getLocalStore } from '@/utils/storageUtil';
  import tableRes from "./Components/tableRes"
    export default {
        name: "showRes",
        components: {tableRes},
        data(){
          return {
            jobId:"",
            res_file:[],
            exec_user:"",
            user:getLocalStore('userId'),
            file_host:file_host,
            taskId:"",
            taskName:"",
            outputParam:[]
          }
        },
        created () {
          this.jobId = this.$route.query.jobId;
          queryOneHistory(this.jobId).then((response) =>{
            this.res_file = response.data.results[0]['res_file_json'];
            this.exec_user = response.data.results[0]['user'];
            this.taskId =  response.data.results[0]['task'];
            this.taskName =  response.data.results[0]['task_name'];
            queryOutput(this.taskId).then((response) => {
              this.outputParam = response.data;
            }).catch(function (error) {console.log(error);});
          }).catch(function (error) {console.log(error);});
        }
    }
</script>

<style scoped>

</style>
