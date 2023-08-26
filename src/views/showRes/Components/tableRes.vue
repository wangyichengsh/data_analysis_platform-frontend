<template>
  <div class="tableRes">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      stripe
      border
      size="medium"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortList"
      max-height="900px"
    >
      <el-table-column :label="getTitle(title)" :prop="title" sortable="custom" align="center" v-for="title in title_sql" >
      </el-table-column>
    </el-table>
    <pagination
      v-show="totalRecord>0"
      :total="totalRecord"
      :page.sync="currentPage"
      @pagination="showTableData"
      :limit.sync="size"
    />
  </div>
</template>

<script>
  import {queryResults} from '@/api/api'
  import Pagination from './Pagination'
    export default {
        name: "tableRes",
        props:["sheetNum","jobId","output"],
      components: { Pagination },
      data() {
          return{
            tableData:[],
            totalRecord:0,
            size:100,
            totalPage:0,
            currentPage: 1,
            tableKey:0,
            listLoading:false,
            ordering:"",
            title_sql:[],
            title_name:{}
          }
      },
      created (){
        this.listLoading=true;
        queryResults({'job_id':this.jobId,'sheet_nu':this.sheetNum,'size':this.size,'page':this.currentPage,'order':this.ordering}).then((response) => {
          this.tableData = response.data.results;
          this.totalRecord = Number(response.data.count);
          this.totalPage = Math.ceil(this.totalRecord / this.size);
          this.listLoading = false;
          for(let i in this.tableData[0]){this.title_sql.push(i);};
        }).catch(function (error) { console.log(error);});
        for(let i in this.output['columns']){
          this.title_name[this.output['columns'][i]['replace_key']] = this.output['columns'][i]['name'];
        };
      },
      methods:{
        showTableData(){
          this.listLoading = true;
          queryResults({'job_id':this.jobId,'sheet_nu':this.sheetNum,'size':this.size,'page':this.currentPage,'order':this.ordering}).then((response) => {
            this.tableData = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.totalPage = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) { console.log(error);});
        },
        sortList(data){
          const { prop, order } = data
          if (order === 'ascending') {
            this.ordering = '+' + prop
          } else {
            this.ordering = '-' + prop
          }
          this.currentPage = 1;
          this.showTableData()
        },
        getTitle(title){
          if(this.title_name.hasOwnProperty(title)){
            return this.title_name[title]
          }
          return title
        }
      }
    }
</script>

<style scoped>

</style>
