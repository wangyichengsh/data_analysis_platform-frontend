<template>
    <div class="queue">
      <div style="margin-left: 20px; margin-bottom: 15px; " >
        <!--<el-select v-model="dqtype" >-->
          <!--<el-option  label="需求" value="ParentTask"></el-option>-->
          <!--<el-option  label="开发任务" value="Task"></el-option>-->
        <!--</el-select>-->
        <el-button type="primary"  @click="delmodity" style="margin-left: 70%;" v-if="isStaff===true" >remove order modify</el-button>
      </div>
      <!--任务列表可调整顺序-->
      <div v-if="dqtype === 'Task' && isStaff===true">
        <div v-for="(item,i) in deve_task"
             draggable
             @dragstart="handleDragStart($event, item)"
             @dragover.prevent="handleDragOver($event, item)"
             @dragenter="handleDragEnterT($event, item)"
             @dragend="handleDragEndT($event, item)"
        >
          <div style="margin: 5px;" >
            <el-card :class="{'mydemand':userId===item.developer}" >
              <div slot="header" style="font-size: 20px;" >{{i+1}}, <router-link :to="{ name: 'taskDetail' ,query:{task:item.id, parentId:item.demand_id[0], versionId:item.version_id[0]}}" >{{item.title}}</router-link> <span v-if="item.level===1" style="color:red;"> emergency </span><span v-if="item.if_modity" style="color:green;"> modifed </span></div>
              <div>
                <div class="cardParam"> <label class="cardParamTitle">task id：</label>{{item.id}}</div>
                <div class="cardParam"> <label class="cardParamTitle">type：</label>{{typeMap[item.type]}}</div>
                <div class="cardParam"> <label class="cardParamTitle">status：</label>{{stateMap[item.status]}}</div>
                <div class="cardParam"  v-if="item.priority===1" ><label class="cardParamTitle">deadline：</label>{{item.deadline}}</div>
                <div class="cardParam"><label class="cardParamTitle">creator：</label>{{usermap[item.creater]}}</div>
                <div class="cardParam"><label class="cardParamTitle">developer：</label>{{usermap[item.developer]}}</div>
                <div class="cardParam"  v-if="item.if_modity" ><label class="cardParamTitle">modify reason：</label>{{item.reason}}</div>
                <div class="cardParam"><label class="cardParamTitle">description：</label>{{item.desc}}</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!--任务列表不可调整顺序-->
      <div v-if="dqtype === 'Task' && isStaff !== true">
        <div v-for="(item,i) in deve_task">
          <div style="margin: 5px;" >
            <el-card :class="{'mydemand':userId===item.developer}" >
              <div slot="header" style="font-size: 20px;" >{{i+1}}, <router-link :to="{ name: 'taskDetail' ,query:{task:item.id, parentId:item.demand_id[0], versionId:item.version_id[0]}}" >{{item.title}}</router-link> <span v-if="item.level===1" style="color:red;"> emergency </span><span v-if="item.if_modity" style="color:green;"> modified </span></div>
              <div>
                <div class="cardParam"> <label class="cardParamTitle">task id：</label>{{item.id}}</div>
                <div class="cardParam"> <label class="cardParamTitle">type：</label>{{typeMap[item.type]}}</div>
                <div class="cardParam"> <label class="cardParamTitle">status：</label>{{stateMap[item.status]}}</div>
                <div class="cardParam"  v-if="item.priority===1" ><label class="cardParamTitle">deadline：</label>{{item.deadline}}</div>
                <div class="cardParam"><label class="cardParamTitle">creator：</label>{{usermap[item.creater]}}</div>
                <div class="cardParam"><label class="cardParamTitle">developer：</label>{{usermap[item.developer]}}</div>
                <div class="cardParam"  v-if="item.if_modity" ><label class="cardParamTitle">modify reason：</label>{{item.reason}}</div>
                <div class="cardParam"><label class="cardParamTitle">description：</label>{{item.desc}}</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!--需求列表可调整顺序-->
      <div v-if="dqtype === 'ParentTask' && isStaff===true">
        <div v-for="(item,i) in deve_tl"
             draggable
             @dragstart="handleDragStart($event, item)"
             @dragover.prevent="handleDragOver($event, item)"
             @dragenter="handleDragEnterP($event, item)"
             @dragend="handleDragEndP($event, item)"
        >
          <div style="margin: 5px;" >
            <el-card :class="{'confirmed':item.status==='conformed'}" >
              <div  slot="header" style="font-size: 20px;" >{{i+1}},<router-link :to="{ name: 'demandDetail' ,query:{demandId:item.id}}" >{{item.title}}</router-link> <span v-if="item.priority===0" style="color:red;"> two sessions </span> <span v-if="item.priority===1" style="color:red;"> emergency </span><span v-if="item.if_modity" style="color:green;"> modified </span> </div>
              <div>
                <div class="cardParam"> <label class="cardParamTitle">requiremend id：</label>{{item.seq}}</div>
                <div class="cardParam"> <label class="cardParamTitle">status：</label>{{DemandstateMap[item.status]}}</div>
                <div class="cardParam"  v-if="item.priority===1" ><label class="cardParamTitle">deadline：</label>{{item.deadline}}</div>
                <div class="cardParam"><label class="cardParamTitle">creator：</label>{{usermap[item.create_by]}}</div>
                <div class="cardParam"><label class="cardParamTitle">create time：</label>{{formatDate(item.create_time)}}</div>
                <div class="cardParam"  v-if="item.if_modity" ><label class="cardParamTitle">modify reason：</label>{{item.reason}}</div>
                <div class="cardParam"><label class="cardParamTitle">description：</label>{{item.desc}}</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!--需求列表不可调整顺序-->
      <div v-if="dqtype === 'ParentTask' && isStaff!==true">
        <div v-for="(item,i) in deve_tl">
          <div style="margin: 5px;" >
            <el-card :class="{'mydemand':userId===item.create_by}" >
              <div  slot="header" style="font-size: 20px;" >{{i+1}},<router-link :to="{ name: 'demandDetail' ,query:{demandId:item.id}}" >{{item.title}}</router-link> <span v-if="item.priority===0" style="color:red;"> two sessions </span> <span v-if="item.priority===1" style="color:red;"> emergency </span><span v-if="item.if_modity" style="color:green;"> modified </span> </div>
              <div>
                <div class="cardParam"> <label class="cardParamTitle">requirement id：</label>{{item.seq}}</div>
                <div class="cardParam"> <label class="cardParamTitle">status：</label>{{DemandstateMap[item.status]}}</div>
                <div class="cardParam"  v-if="item.priority===1" ><label class="cardParamTitle">deadline：</label>{{item.deadline}}</div>
                <div class="cardParam"><label class="cardParamTitle">creator：</label>{{usermap[item.create_by]}}</div>
                <div class="cardParam"><label class="cardParamTitle">create time：</label>{{formatDate(item.create_time)}}</div>
                <div class="cardParam"  v-if="item.if_modity" ><label class="cardParamTitle">modify reason：</label>{{item.reason}}</div>
                <div class="cardParam"><label class="cardParamTitle">description：</label>{{item.desc}}</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { getLocalStore } from '@/utils/storageUtil';
  import { queryUser ,addDeveQueue_ParentTask} from '@/api/api'
  import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority} from '@/common/common'
    export default {
        name: "Queue",
        data(){
          return {
            dqtype:"ParentTask",
            DemandstateMap,
            stateMap,
            typeMap,
            deve_tl:[],
            dragfrom:null,
            dragto:null,
            pre_id:"",
          }
        },
      props:['deve_parenttask','deve_task','usermap','userId','isStaff'],
      cretaed () {
      },
      watch:{
        deve_parenttask:{
          handler(newVal, OldVal){
            this.deve_tl = newVal;
          },
          immediate:true,
        }
      },
      methods:{
        formatDate,
        delmodity(){
          this.$confirm('该操作会删除所有的优先级调整?（不可恢复）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '不要重置',
            type: 'warning'
          }).then(() => {
            delDeveQueue(this.dqtype).then((response) => {
              if(response.data.status === 'success'){
                this.$message('删除成功!');
                location.reload();
              }else{
                alert('删除失败：'+response.data.msg);
              }
            }).catch(function (error) {});
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '未删除'
            });
          });
        },
        handleDragStart(e, item){
          this.dragfrom = item;
        },
        handleDragEnterP(e, item){
          e.dataTransfer.effectAllowed = "move";
          if(item === this.dragfrom){
            return
          }
          else{
            this.dragto = item;
          }
          const newItems = [...this.deve_tl];
          const src = newItems.indexOf(this.dragfrom);
          const dst = newItems.indexOf(item);
          if(dst === 0 ){
            this.pre_id = -1;
          }
          else{
            if(dst<src) {
              this.pre_id = this.deve_tl[dst - 1].id;
            }
            else{
              this.pre_id = this.deve_tl[dst].id;
            }
          }
          newItems.splice(dst, 0, ...newItems.splice(src, 1));

          this.deve_tl = newItems
        },
        handleDragEnterT(e, item){
          e.dataTransfer.effectAllowed = "move";
          if(item === this.dragfrom){
            return
          }
          else{
            this.dragto = item;
          }
          const newItems = [...this.deve_task];
          const src = newItems.indexOf(this.dragfrom);
          const dst = newItems.indexOf(item);
          if(dst === 0 ){
            this.pre_id = -1;
          }
          else{
            if(dst<src) {
              this.pre_id = this.deve_task[dst - 1].id;
            }else{
              this.pre_id = this.deve_tl[dst].id;
            }
          }
          newItems.splice(dst, 0, ...newItems.splice(src, 1));

          this.deve_task = newItems
        },
        handleDragOver(e, item){
          e.dataTransfer.dropEffect = "move";
        },
        mkmodify(model_name, value){
          if(this.dragfrom === this.dragto){
            this.dragfrom = null;
            this.dragto = null;
            this.pre_id = null;
            return
          }
          else {
            if (model_name === 'ParentTask') {
              var ind = this.deve_tl.indexOf(this.dragto);
              if (ind === -1) {
                return
              }
              if (this.dragfrom.id===this.pre_id){
                this.dragfrom = null;
                this.dragto = null;
                this.pre_id = null;
                return
              }
              var params = {'model_name': 'ParentTask', 'this_item': this.dragfrom.id, 'pre_item': this.pre_id, 'change_reason':value};
              addDeveQueue_ParentTask(params).then((response) => {
                console.log(response);
                if (response.data.status === 'success') {
                  this.$message('更新成功!');
                  location.reload();
                } else {
                  alert('更新失败：' + response.data.msg);
                }
              }).catch(function (error) {
              });
            } else{
              var ind = this.deve_task.indexOf(this.dragto);
              if (ind === -1) {
                return
              }
              if (this.dragfrom.id===this.pre_id){
                this.dragfrom = null;
                this.dragto = null;
                this.pre_id = null;
                return
              }
              var params = {'model_name':'Task','this_item':this.dragfrom.id,'pre_item':this.pre_id, 'change_reason':value};
              addDeveQueue_Task(params).then((response) => {
                console.log(response);
                if(response.data.status === 'success'){
                  this.$message('更新成功!');
                  location.reload();
                }else{
                  alert('更新失败：'+response.data.msg);
                }
              }).catch(function (error) {});
            }
            this.dragfrom = null;
            this.dragto = null;
            this.pre_id = null;
          }
        },
        handleDragEndP(e, item){
          this.$prompt('调整原因：', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '不能为空'
          }).then(({ value }) => {
            this.mkmodify('ParentTask',value);
            this.$message({
              type: 'success',
              message:value
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消更新'
            });
            this.$router.push({ name: 'taskList' ,query:{tabStart:'queue'} });
            location.reload();
          });
          //this.mkmodify('ParentTask')
        },
        handleDragEndT(e, item){
          this.$prompt('modify reason：', 'tip', {
            confirmButtonText: 'confirm',
            cancelButtonText: 'cancel',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: 'vacant'
          }).then(({ value }) => {
            this.mkmodify('Task',value);
            this.$message({
              type: 'success',
              message:value
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'modify failed'
            });
            this.$router.push({ name: 'taskList' ,query:{tabStart:'queue'} });
            location.reload();
          });
          //this.mkmodify('Task')
        }
      }
    }
</script>

<style scoped>
  .cardParamTitle{
    width: 200px;
    display: block;
    padding: 4px 10px 0 0;
    float: left;
    font-weight: 700;
  }
  .cardParam{
    height:25px;
  }
  .mydemand{
    background-color: #fdff87 !important;
  }
  .confirmed{
    background-color: #6eff60 !important;
  }
</style>
