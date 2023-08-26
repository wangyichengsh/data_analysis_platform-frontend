<template>
    <div class="modelTaskList">
      <div class="content">
        <div style=" margin-bottom: 15px;" >
          <div>
           <el-input clearable placeholder="Please enter context" prefix-icon="el-icon-search" v-model="searchText" @keypress.enter.native="search_one" ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search_one"   >search</el-button>
            <router-link :to="{ name: 'addModelTask'}" v-if="isStaff" ><el-button icon="el-icon-circle-plus-outline" type="primary" >create</el-button></router-link>
          </div>
        </div>
        <div style="clear:both;height:10px;" v-if="isStaff===false" ></div>
        <div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data=" modelTaskList"
            stripe
            border
            size="medium"
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change=""
            max-height="700px"
          >
            <el-table-column label="create time" prop="create_time"  align="center" width="180">
              <template slot-scope="{row}">
                {{ formatDate(row.create_time) }}
              </template>
            </el-table-column>
            <el-table-column label="title" prop="title"  align="left" min-width="100">
              <template slot-scope="{row}">
                <router-link :to="{ name: 'modelTaskDetail' ,query:{task:row.id, modelTask:true}}" >{{ row.title }}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="developer" prop="developer_name"  align="center" width="150">
            </el-table-column>
            <el-table-column label="status" prop="status"  align="center" width="150">
              <template slot-scope="{row}">
                <label v-if="row.status==='finished'" style="color:green;" > {{stateMap[row.status]}}</label><label v-if="row.status!=='finished'" style="color:red;" > {{stateMap[row.status]}}</label>
              </template>
            </el-table-column>
            <el-table-column label="query page" prop="status"  align="center" width="300">
              <template slot-scope="{row}">
                <router-link :to="{ name: 'taskExec',query:{taskId:row.id, modelTask:true} }" ><button >query page</button></router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="totalRecord>0"
          :total="totalRecord"
          :page.sync="currentPage"
          @pagination="search"
        />
      </div>
    </div>
</template>

<script>
  import {queryModelTaskList, queryUser} from '../../api/api'
  import { getLocalStore } from '@/utils/storageUtil';
  import ElButton from "element-ui/packages/button/src/button";
  import { stateMap,formatDate,page_size } from '@/common/common';
  import Pagination from '@/components/Pagination';
  export default {
    components: {ElButton},
    name: "model-task-list",
    components: { Pagination },
         data()
          {
            return {
              tableKey:1,
              page_size,
              userId:"",
              usermap:{},
              modelTaskList:[],
              searchText:"",
              totalPage:1,
              currentPage: 1,
              size:0,
              totalRecord:0,
              isStaff:"",
              stateMap,
              listLoading:false
            }
          },
        created (){
          this.listLoading = true;
          queryUser({ params: {is_staff:true}}).then((response) =>{
            for(var user in response.data) {
              this.usermap[response.data[user].id] = response.data[user].full_name;
            }
          }).catch(function (error) {console.log(error);});
          queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
            this.isStaff = response.data[0].is_staff;
            this.userId = response.data[0].id;
          }).catch(function (error) {console.log(error);});
          queryModelTaskList(1,this.searchText).then((response) => {
            this.modelTaskList = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.size = this.modelTaskList.length;
            this.totalPage = Math.ceil(this.totalRecord/this.size);
            this.listLoading = false;
          }).catch(function (error) {console.log(error);});
        },
      methods:{
        formatDate,
        search() {
          this.listLoading = true;
          queryModelTaskList(this.currentPage, this.searchText,).then((response) => {
            this.modelTaskList = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.size = this.modelTaskList.length;
            this.totalPage = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) { console.log(error);});
        },
        search_one() {
          this.currentPage = 1;
          this.search();
        }
      }
    }
</script>

<style scoped>
  .pageTool{
    margin-top: 10px;
    padding-left: 42%;

  }
  .pageC{
    width:30px;
    height:22px;
    margin-right: 10px;
  }
  .el-input{
    width:200px !important;
  }
  .el-input__inner{
    height:30px !important;
  }
  .el-input__icon{
    line-height:30px !important;
  }
</style>
