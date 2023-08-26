<template>
  <div class="content">
    <div class="search">
      <el-date-picker
        type="date"
        v-model="history_start"
        placeholder="Start Date"
      ></el-date-picker>
      <el-date-picker
        type="date"
        v-model="history_end"
        placeholder="End Date"
      ></el-date-picker>
      <!--<el-select v-if="isStaff" v-model="Searchuser" placeholder="创建者" clearable >-->
      <!--<el-option v-for="(user,index) in userList" :value="user.id" :label="user.full_name" />-->
      <!--</el-select>-->
      <el-autocomplete
        v-if="isStaff"
        v-model="Searchuser_un"
        :fetch-suggestions="querySearchUser"
        placeholder="User"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="pageOne"
      >Search</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data=" history.results"
      stripe
      border
      size="medium"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change=""
      max-height="700px"
    >
      <el-table-column
        label="User"
        prop="user_name"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="Task"
        prop="task_name"
        align="center"
        width="180"
      >
        <template slot-scope="{row}">
          <router-link :to="{ name: 'taskExec', query:{taskId:row.task}}">{{ row.task_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="Quert Time"
        prop="create_time_mod"
        align="center"
        width="185"
      >
      </el-table-column>
      <el-table-column
        label="Input(first four)"
        prop="input_param"
        align="center"
        min-width="125"
      >
      </el-table-column>
      <el-table-column
        label="Input File"
        prop="input_file_json"
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <a
            :href="file_host+'/static/input_file/'+ input"
            v-for="input in row.input_file_json"
          ><button>download</button></a>
        </template>
      </el-table-column>
      <el-table-column
        label="Process"
        prop="sql_done"
        align="center"
        width="85"
      >
        <template slot-scope="{row}">
          {{ row.sql_done }}/{{ row.sql_all }}
        </template>
      </el-table-column>
      <el-table-column
        label="Consume Time"
        prop="use_time"
        align="center"
        width="85"
      >
        <template slot-scope="{row}">
          {{ row.use_time }}s
        </template>
      </el-table-column>
      <el-table-column
        label="status"
        prop="exec_status_zh"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="Result File"
        prop="res_file_json"
        align="center"
        width="110"
      >
        <template slot-scope="{row}">
          <a
            :href="file_host+'/static/output_file/'+ res"
            :download="row.task_name+'.'+res.split('.')[1]"
            v-for="res in row.res_file_json"
          >
            <button
              style="margin:5px;"
              v-if="res.endsWith('xlsx')"
            >download</button>
            <button
              style="margin:5px;"
              v-if="res.endsWith('csv')"
            >csv</button>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="Display"
        align="center"
        width="85"
      >
        <template slot-scope="{row}">
          <router-link :to="{ name: 'showRes', query:{jobId:row.id}}"><button>display</button></router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="totalRecord>0"
      :total="totalRecord"
      :page.sync="currentPage"
      @pagination="pageAny"
    />
  </div>
</template>

<script>
import { file_host, queryHistory, first_record, queryUserHistory, queryUser } from '@/api/api'
import { page_size } from '@/common/common'
import Pagination from '@/components/Pagination'
import ElButton from "element-ui/packages/button/src/button";
import { getLocalStore } from '@/utils/storageUtil';
export default {
  data () {
    return {
      page_size,
      history: {
        results: []
      },
      file_host: file_host,
      tableKey: 1,
      currentPage: 1,
      totalPage: 1,
      totalRecord: 0,
      size: 0,
      ListLoading: false,
      listLoading: false,
      history_start: "",
      history_end: "",
      ordering: "",
      first_record,
      Searchuser: "",
      Searchuser_un: "",
      userList: [],
      userId: getLocalStore('userId'),
      isStaff: false
    }
  },
  components: {
    ElButton,
    Pagination
  },
  created () {
    this.listLoading = true;
    queryHistory(1, this.history_start, this.history_end).then((response) => {
      this.history.results = response.data.results;
      // eslint-disable-next-line handle-callback-err
      this.totalRecord = Number(response.data.count);
      this.size = this.history.results.length;
      this.totalPage = Math.ceil(this.totalRecord / this.size);
      this.listLoading = false;
    }).catch(function (error) {
      console.log(error);
    })
    queryUser().then((response) => {
      this.userList = response.data;
    }).catch(function (error) { console.log(error); });
    queryUser({ params: { username: getLocalStore('name') } }).then((response) => {
      this.isStaff = response.data[0].is_staff;
    }).catch(function (error) { console.log(error); });
  },
  methods: {
    pageAny () {
      this.listLoading = true;
      this.currentPage = Number(this.currentPage);
      if (this.currentPage < 1) {
        this.currentPage = 1
      }
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage
      }
      if (this.currentPage >= 1 && this.currentPage <= this.totalPage) {
        if (this.Searchuser.length === 0 || typeof (this.Searchuser) === 'undefined') {
          queryHistory(this.currentPage, this.history_start, this.history_end).then((response) => {
            this.history.results = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.size = this.history.results.length;
            this.totalPage = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) {
            console.log(error);
          })
        } else {
          queryUserHistory(this.currentPage, this.history_start, this.history_end, this.Searchuser).then((response) => {
            this.history.results = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.size = this.history.results.length;
            this.totalPage = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) {
            console.log(error);
          })
        }
      }
    },
    pageOne () {
      this.listLoading = true;
      this.currentPage = 1;
      if (this.Searchuser.length === 0 || typeof (this.Searchuser) === 'undefined') {
        queryHistory(this.currentPage, this.history_start, this.history_end).then((response) => {
          this.history.results = response.data.results;
          this.totalRecord = Number(response.data.count);
          this.size = this.history.results.length;
          this.totalPage = Math.ceil(this.totalRecord / this.size);
          this.listLoading = false;
        }).catch(function (error) {
          console.log(error);
        })
      } else {
        queryUserHistory(this.currentPage, this.history_start, this.history_end, this.Searchuser).then((response) => {
          this.history.results = response.data.results;
          this.totalRecord = Number(response.data.count);
          this.size = this.history.results.length;
          this.totalPage = Math.ceil(this.totalRecord / this.size);
          this.listLoading = false;
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    querySearchUser (queryString, cb) {
      var userList = this.userList;
      var results_all = queryString ? userList.filter(this.createFilter(queryString)) : userList;
      // 调用 callback 返回建议列表的数据
      let results = [];
      for (let i in results_all) {
        results.push({ 'value': results_all[i].full_name, 'id': results_all[i].id });
      }
      this.Searchuser = ""
      cb(results);
    },
    createFilter (queryString) {
      return (userList) => {
        return (userList.full_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      this.Searchuser = item.id;
    }
  }
}
</script>

<style>
#pageTool {
  margin-top: 10px;
  padding-left: 42%;
}
#pageC {
  width: 30px;
  height: 22px;
  margin-right: 10px;
}
.tablevalue {
  max-height: 100px;
  overflow: hidden;
}
</style>
