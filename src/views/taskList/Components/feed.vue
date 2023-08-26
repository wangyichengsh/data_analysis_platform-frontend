<template>
    <div class="feed">
      <div class="search" >
        <el-input clearable placeholder="Please enter context" prefix-icon="el-icon-search" v-model="searchText_feed"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="feedsearch_one" >search</el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="Feed_list"
        stripe
        border
        size="medium"
        fit
        highlight-current-row
        style="width: 100%;"
        max-height="700px"
      >
        <el-table-column label="ID" prop="id"  align="center" width="80">
        </el-table-column>
        <el-table-column label="create time" prop="create_time"  width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ formatDate(row.feedto_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="requirement id" prop="demind_seq" width="110px" align="center">
        </el-table-column>
        <el-table-column label="title" prop="title"  min-width="100px">
          <template slot-scope="{row}">
            <router-link :to="{ name: 'demandDetail' ,query:{demandId:row.demind_id}}" >
              <div v-if="row.model_name==='ParentTask'">
                <span >{{row.model_title}}</span>
              </div>
              <div v-if="row.model_name==='OutputColumn'">
                <span >{{row.task_name}}</span>
              </div>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="table" prop="table_name"  width="200px" align="center">
        </el-table-column>
        <el-table-column label="field" prop="model_title"  width="200px" align="center">
          <template slot-scope="{row}">
            <span v-if="row.model_name==='OutputColumn'" >{{ row.model_title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="question" prop="feedto" min-width="150px" align="left">
        </el-table-column>
        <el-table-column label="response" prop="feedback" min-width="150px" align="left">
        </el-table-column>
        <el-table-column label="question creator" prop="feedto_user"  width="80px" align="center">
          <template slot-scope="{row}">
            <span >{{ usermap[row.feedto_user] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="requirement creator" prop="demand_user"  width="80px" align="center">
          <template slot-scope="{row}">
            <span >{{ usermap[row.demand_user] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="whether response" prop="if_feed"  width="80px" align="center">
          <template slot-scope="{row}">
            <span v-if="row.if_feed">Yes</span> <span v-if="row.if_feed!==true">No</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalFeed_son>0"
        :total="totalFeed_son"
        :page.sync="currentFeedPage"
        @pagination="feedsearch"
      />
    </div>
</template>

<script>
  import {DemandstateMap,formatDate,typeMap,stateMap,mapPriority} from '@/common/common'
  import { queryFeedList } from '@/api/api'
  import Pagination from '@/components/Pagination'
    export default {
        name: "FeedList",
      components: { Pagination },
        data(){
            return{
              tableKey:1,
              searchText_feed:"",
              Feed_list:[],
              currentFeedPage:1,
              totalFeed_son:0,
              Feedsize_son:0,
              totalFeedPage_son:0,
              listLoading:false
            }
         },
        props:['Feed','totalFeed','Feedsize','totalFeedPage','usermap'],
        created (){
        },
        watch:{
        Feed:{
            handler(newVal, OldVal){
              this.Feed_list = newVal;
            },
            immediate:true,
          },
          totalFeed:{
            handler(newVal, OldVal){
              this.totalFeed_son = newVal;
            },
            immediate:true,
          },
          Feedsize:{
            handler(newVal, OldVal){
              this.Feedsize_son = newVal;
            },
            immediate:true,
          },
          totalFeedPage:{
            handler(newVal, OldVal){
              this.totalFeedPage_son = newVal;
            },
            immediate:true,
          },
      },
        methods:{
          formatDate,
          feedsearch() {
            this.listLoading = true;
            queryFeedList(this.currentFeedPage, this.searchText_feed,).then((response) => {
              this.Feed_list = response.data.results;
              this.totalFeed_son = Number(response.data.count);
              this.Feedsize_son = this.Feed_list.length;
              this.totalFeedPage_son = Math.ceil(this.totalFeed_son / this.Feedsize_son);
              this.listLoading = false;
            }).catch(function (error) { console.log(error);});
          },
          feedsearch_one() {
            this.currentFeedPage = 1;
            this.feedsearch();
          }
        }
    }
</script>

<style scoped>

</style>
