<template>
  <div class="addModelTask" >
    <div class="breadcrums">
      <a>Query</a>&nbsp;›
      <a>Create Fixed Query</a>
    </div>
    <div class="content">
      <h1>Create Fixed Query</h1>
      <div class="param">
        <label class="paramTitle">Title:</label>
        <input type="text" v-model="taskTitle" >
      </div>
      <div class="param">
        <label class="paramTitle">Priority:</label>
        <el-select id="priority" v-model="priority" >
          <el-option value="1"  label="emergency" disabled ></el-option>
          <el-option value="2" label="normal"></el-option>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle">Type:</label>
        <el-select id="taskType" v-model="taskType" >
          <el-option value="file" label="file" disabled ></el-option>
          <el-option value="module" label="query" ></el-option>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle">Developer:</label>
        <select id="developer" v-model="developer" >
          <option v-for="user in userList" :value="user.id">{{user.full_name}}</option>
        </select>
      </div>
      <div class="param">
        <label class="paramTitle">Description:</label>
        <textarea v-model="desc" ></textarea>
      </div>
      <div class="submit-row">
        <button class="default" @click="createModel">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryUser, createTask} from '../../api/api'
    export default {
        name: "add-model-task",
        data() {
          return {
            taskTitle:"",
            developer:"",
            taskType:"module",
            priority:"2",
            desc:"",
            userList:[]
          }
        },
        created() {
          queryUser({ params: {is_staff:true}} ).then((response) => {
            this.userList = response.data;
          }).catch(function (error) {console.log(error);});
        },
      methods:{
          createModel(){
          let task_param = {
            'title': this.taskTitle,
            'level': this.priority,
            'type': this.taskType,
            'status': 'developing',
            'desc': this.desc,
            'developer': this.developer,
            'if_valid': true,
            'if_model':true
          };
          createTask(task_param).then((response) => {
            if (response.status == 200) {
              this.$router.push({ name: 'modelTaskList'});
            }
            else{console.log(response);}
            }).catch(function (error) {console.log(error);});
        }
      }
    }
</script>

<style scoped>

</style>
