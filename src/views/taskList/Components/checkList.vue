<template>
  <div class="checkList" >
    <table>
      <tr>
        <th style="width:100px;">ID</th>
        <th style="width:180px;">创建时间</th>
        <th style="width:80px;">需求编号</th>
        <th style="width:330px;">标题</th>
        <th style="width:100px;" >需求类型</th>
        <th style="width:100px;" >优先级</th>
        <th style="width:150px;" >状态</th>
        <th style="width:130px;">提出人</th>
        <th style="width:200px;" >操作</th>
      </tr>
      <tr v-for="task in checkTaskList">
        <td>{{task.id}}</td>
        <td>{{formatDate(task.create_time)}}</td>
        <td>{{task.seq}}</td>
        <td><router-link :to="{ name: 'demandDetail' ,query:{demandId:task.id}}" ><div :class="{'hurry':task.priority===1}" >{{task.title}}</div> </router-link> </td>
        <td>{{task.type}}</td>
        <td><div :class="{'hurry':task.priority===1}"> {{ mapPriority[task.priority] }}</div></td>
        <td>{{DemandstateMap[task.status] }}</td>
        <td>{{usermap[task.create_by]}}</td>
        <td :demand_id="task.id" :seq="task.seq" ><button  style="margin:5px;" @click="checkSucess"  >通过</button><button  style="margin:5px;" @click="checkFailed" >不通过</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { getLocalStore } from '@/utils/storageUtil';
  import { queryUser,markchange, ChgDemandStatus} from '@/api/api'
  import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority} from '@/common/common'
    export default {
        name: "CheckList",
      data(){
          return {
            DemandstateMap,
            stateMap,
            mapPriority,
            usermap:{},
            userId:""
          }
      },
      created () {
        queryUser().then((response) =>{
          for(var user in response.data) {
            this.usermap[response.data[user].id] = response.data[user].full_name;
          }
        }).catch(function (error) {console.log(error);});
        queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
            this.isStaff = response.data[0].is_staff;
            this.userId = response.data[0].id;
        }).catch(function (error) {console.log(error);});
      },
      methods:{
        formatDate,
        checkSucess(eve){
          var temp = eve.explicitOriginalTarget;
          if(typeof(temp)=="undefined"){
            temp = eve.toElement;
          }
          var param = temp.parentElement;
          var demand_id = param.attributes.demand_id.value;
          var seq = param.attributes.seq.value;
          if(getLocalStore('name')===null){
            this.$message({
              type: 'info',
              message: '登入过期'
            });
            this.$router.push({ name: 'login' });
          }
          var param ={
            'status':'wait'
          };
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': seq,
          };
          params['field_name'] = 'status';
          params['old'] = 'check';
          params['new'] = 'wait';
          console.log(params);
          markchange(params).then((response) => {
            if (response.status == 201) {
              this.$message({
                type: 'info',
                message: '记录成功'
              });
            }
            else{console.log(response);}
          }).catch(function (error) {console.log(error);});
          ChgDemandStatus(demand_id, param).then((response) => {
            if (response.status == 200) {
              console.log(response);
              location.reload();}
            else {console.log(response);}
          }).catch(function (error) {console.log(error);});
        },
        checkFailed(eve) {
          var temp = eve.explicitOriginalTarget;
          if (typeof(temp) == "undefined") {
            temp = eve.toElement;
          }
          var param = temp.parentElement;
          var demand_id = param.attributes.demand_id.value;
          var seq = param.attributes.seq.value;
          if (getLocalStore('name') === null) {
            this.$message({
              type: 'info',
              message: '登入过期'
            });
            this.$router.push({name: 'login'});
          }
          var param = {
            'status': 'failed'
          };
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': seq,
          };
          this.$prompt('审核意见：', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '不能为空'
          }).then(({ value }) => {
            let params_a  = {
              'user': this.userId,
              'model_name': 'ParentTask',
              'change_id': seq,
              'field_name':'checkreason',
              'old': 'null',
              'new':value
            };
            console.log(params_a);
            markchange(params_a).then((response) => {
              if (response.status == 201) {console.log(response);}
              else {console.log(response);}
            }).catch(function (error) {console.log(error);});
            params['field_name'] = 'status';
            params['old'] = 'check';
            params['new'] = 'failed';
            markchange(params).then((response) => {
              if (response.status == 201) {
                this.$message({
                  type: 'info',
                  message: '记录成功'
                });
              }
              else {
                console.log(response);
              }
            }).catch(function (error) {
              console.log(error);
            });
            ChgDemandStatus(demand_id, param).then((response) => {
              if (response.status == 200) {
                console.log(response);
                location.reload();
              }
              else {
                console.log(response);
              }
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消更新'
            });
            this.$router.push({ name: 'taskList' ,query:{tabStart:'queue'} });
            location.reload();
          });
        }
      },
      props:['checkTaskList']
    }
</script>

<style scoped>

</style>
