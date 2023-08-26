<template>
    <div class="changeInputSimple" >
      <div class="breadcrums">
        <router-link :to="{ name: 'demandDetail' ,query:{demandId:parentId} }">{{ parentName }}</router-link> &nbsp;›
        <router-link :to="{ name: 'taskDetail',query: {parentId:parentId, task:taskId} }">{{ taskVersion+":"+ taskName }}</router-link>&nbsp;›
        <a>Edit Input</a>
      </div>
      <div class="content">
        <h1>Edit Input</h1>
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
          </select>
        </div>
        <div class="param">
          <label class="paramTitle">description:</label>
          <textarea v-model="inputDetail" cols="40" rows="10"></textarea>
        </div>
        <div class="submit-row">
          <button class="default" @click="ChangeInput" >edit</button>
        </div>
      </div>
    </div>
</template>

<script>
  import { getLocalStore, clearLocalStore,setLocalStore } from '@/utils/storageUtil';
    import {querySonVersion, queryInputDetail, UpdateInput} from '../../api/api'
    export default {
        name: "change-input-simple",
        data() {
          return {
            username:getLocalStore('name'),
            taskId:"",
            taskName:"",
            taskVersion:"",
            parentId:"",
            parentName:"",
            inputId:"",
            inputTitle:"",
            inputType:"",
            inputDetail:""
          }
        },
        created() {
          this.inputId = this.$route.query.inputId;
          queryInputDetail(this.inputId).then((response) =>{
            this.taskId = response.data[0].task;
            this.inputTitle = response.data[0].name;
            this.inputType = response.data[0].type;
            this.inputDetail = response.data[0].detail;
            querySonVersion(this.taskId).then((response) => {
              this.parentId = response.data[0].parent_task;
              this.parentName = response.data[0].parent_name;
              this.taskVersion = response.data[0].version_num;
              this.taskName = response.data[0].son_name;
            }).catch(function (error) {console.log(error);});
          }).catch(function (error) {console.log(error);});
        },
        methods:{
          ChangeInput(){
            var params = new URLSearchParams();
            params.append( 'task',this.taskId);
            params.append( 'name',this.inputTitle);
            params.append( 'type',this.inputType);
            params.append( 'detail',this.inputDetail);
            UpdateInput(this.inputId, params).then((response) =>{
              if (response.status == 200) {
                alert('成功！');
                location.reload();}
              else{console.log(response);}
            }).catch(function (error) {console.log(error);});
          }
        }
    }
</script>

<style scoped>

</style>
