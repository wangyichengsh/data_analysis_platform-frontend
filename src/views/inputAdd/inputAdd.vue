<template>
  <div class="inputAdd">
    <div class="breadcrums" v-if="modelTask !== 'true'"  >
      <router-link :to="{ name: 'demandDetail', query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
      <router-link :to="{ name: 'taskDetail' ,query:{parentId:parentId, task:taskId ,versionId:versionId} }">{{ versionId }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId} }" v-if="isStaff === true" >{{ taskVersion+":"+ taskName }}&nbsp;›</router-link>
      <a>create input</a>
    </div>
    <div class="breadcrums" v-if="modelTask === 'true'"  >
      <router-link :to="{ name: 'modelTaskDetail' ,query:{task:taskId,  modelTask:true}}"> {{ taskName }}&nbsp;›</router-link>
      <router-link :to="{ name: 'taskBackend',query:{taskId:taskId, modelTask:true} }" v-if="isStaff === true" > create input</router-link>
      <a v-if="isStaff !== true" >create input</a>
    </div>
    <div class="content">
      <h1>create input</h1>
      <div class="param">
        <label class="paramTitle">name:</label>
        <input type="text" v-model="inputTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">type:</label>
        <select v-model="inputType" >
          <option value="String" >string</option>
          <option value="Date" >date</option>
          <option value="DateTime" >time</option>
          <option value="Number" >number</option>
          <option value="File" >file</option>
          <option value="List" >list</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">description:</label>
        <textarea v-model="inputDetail" cols="40" rows="10"></textarea>
      </div>
      <div class="param">
        <label class="paramTitle">order:</label>
        <input type="number" v-model="input_id"></input>
      </div>
      <div class="param" v-if="isStaff ===true" >
        <label class="paramTitle">default:</label>
        <input type="text" v-model="default_value" >
      </div>
      <div class="param" v-if="isStaff === true" >
        <label class="paramTitle">replace key:</label>
        <input type="text" v-model="replace_key" >
      </div>
      <div class="submit-row">
        <button class="default" @click="CreateInput" >create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getLocalStore } from '@/utils/storageUtil';
    import {querySonVersion, createInput, queryUser, queryTaskDetail} from '../../api/api'
    export default {
        name: "inputAdd",
        data() {
          return {
            username:getLocalStore('name'),
            isStaff:false,
            taskId:"",
            taskName:"",
            taskVersion:"",
            versionId:"",
            parentId:"",
            parentName:"",
            inputTitle:"",
            inputType:"",
            input_id:0,
            inputDetail:"",
            default_value:"",
            replace_key:"",
            modelTask:false
          }
        },
      created() {
        this.taskId = this.$route.query.taskId;
        this.modelTask = String(this.$route.query.modelTask);
        console.log(this.modelTask );
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
          this.isStaff = response.data[0].is_staff;
        }).catch(function (error) {console.log(error);});
        if(this.modelTask === "true"){
          queryTaskDetail(this.taskId).then((response) => {
            this.taskName = response.data.results[0].title;
          }).catch(function (error) {console.log(error);});
        }
        else {
          querySonVersion(this.taskId).then((response) => {
            this.parentId = response.data[0].parent_task;
            this.parentName = response.data[0].parent_name;
            this.taskVersion = response.data[0].version_num;
            this.versionId = response.data[0].version_id;
            this.taskName = response.data[0].son_name;
          }).catch(function (error) {
            console.log(error);
          });
        }
      },
      methods: {
        CreateInput() {
          var params = new URLSearchParams();
          params.append( 'task',this.taskId);
          params.append( 'name',this.inputTitle);
          params.append( 'type',this.inputType);
          params.append( 'detail',this.inputDetail);
          params.append( 'default_value',this.default_value);
          params.append( 'replace_key',this.replace_key);
          params.append( 'input_id',this.input_id);
          createInput(params).then((response) =>{
            if (response.status == 201) {
              if(this.isStaff === true) {
                setTimeout(this.$router.push({name: 'taskBackend', query: {taskId: this.taskId}}), 1000);
              }
              else{
                if(this.modelTask!=="true"){
                  setTimeout(this.$router.push({ name: 'taskDetail', query:{parentId:this.parentId, task:this.taskId}}), 1000);
                }
                else{
                  setTimeout(this.$router.push({ name: 'modelTaskDetail', query:{task:this.taskId, modelTask:true}}), 1000);
                }
              }
            }
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style scoped>

</style>
