<template>
    <div class="deve">
      <div class="search" >
        <el-input clearable placeholder="Please enter context" prefix-icon="el-icon-search" v-model="searchText_deve" @keypress.enter.native="searchTask_deve_one" ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTask_deve_one" >search</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="TaskInDeve_son"
        stripe
        border
        size="medium"
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change=""
        max-height="700px"
      >
        <el-table-column label="ID" prop="seq"  align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.seq }}</span>
          </template>
        </el-table-column>
        <el-table-column label="create time" prop="create_time"  width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ formatDate(row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="title" prop="title"  min-width="150px">
          <template slot-scope="{row}">
            <router-link :to="{ name: 'demandDetail' ,query:{demandId:row.id}}" >
              <span :class="{'hurry':row.priority===1}" >{{row.title}}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="priority" width="100px" align="center">
          <template slot-scope="{row}">
            <span :class="{'hurry':row.priority===1}" >{{ mapPriority[row.priority]  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="creator" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ usermap[row.create_by] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="type" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="status" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ DemandstateMap[row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="task detail" width="300px" align="center">
          <template slot-scope="{row}">
            <router-link :to="{ name: 'taskDetail' ,query:{parentId:i.demand_id,versionId:i.version_id, task:i.task_id}}" v-for="i in row.diff_task" ><div>{{i.name}}</div></router-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalDeveRecord_son>0"
        :total="totalDeveRecord_son"
        :page.sync="currentDevPage"
        @pagination="searchTask_deve"
      />
    </div>
</template>

<script>
  import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority,page_size} from '@/common/common'
  import { queryTaskDeve,queryUnDemand } from '@/api/api'
  import Pagination from '@/components/Pagination'
    export default {
        name: "Deve",
      components: { Pagination },
        data() {
          return {
            tableKey:1,
            page_size,
            typeMap,
            stateMap,
            DemandstateMap,
            mapPriority,
            currentDevPage:1,
            TaskInDeve_son:[],
            totalDeveRecord_son:0,
            Devesize_son:0,
            totalDevePage_son:0,
            searchText_deve:"",
            deveStatus:"",
            listLoading:false
          }
        },
        props:["TaskInDeve","totalDeveRecord","Devesize","totalDevePage","usermap"],
        watch:{
          TaskInDeve:{
            handler(newVal, OldVal){
              this.TaskInDeve_son = newVal;
            },
            immediate:true,
          },
          totalDeveRecord:{
            handler(newVal, OldVal){
              this.totalDeveRecord_son = newVal;
            },
            immediate:true,
          },
          Devesize:{
            handler(newVal, OldVal){
              this.Devesize_son = newVal;
            },
            immediate:true,
          },
          totalDevePage:{
            handler(newVal, OldVal){
              this.totalDevePage_son = newVal;
            },
            immediate:true,
          }
        },
        methods:{
          formatDate,
          searchTask_deve() {
            this.listLoading = true;
            queryUnDemand(this.currentDevPage, this.searchText_deve ).then((response) =>{
                this.TaskInDeve_son = response.data.results;
                this.totalDeveRecord_son = Number(response.data.count);
                this.Devesize_son = this.TaskInDeve.length;
                this.totalDevePage_son = Math.ceil(this.totalDeveRecord_son/this.Devesize_son);
              this.listLoading = false;
              }).catch(function (error) {console.log(error);})
          },
          searchTask_deve_one(){
            this.currentDevPage = 1;
            this.searchTask_deve();
          }
        }
    }
</script>

<style scoped>

</style>
