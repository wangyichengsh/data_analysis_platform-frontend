<template>
  <div class="all">
    <div class="search">
      <el-input
        placeholder="title"
        clearable
        prefix-icon="el-icon-search"
        v-model="searchText_all"
        @keypress.enter.native="searchTask_one"
      ></el-input>
      <el-select
        v-model="searchProiority"
        placeholder="proiority"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="priority in demandPriority"
          :label="priority.value"
          :value="priority.key"
        />
      </el-select>
      <el-select
        v-model="searchStatus"
        placeholder="status"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="status in demandStatus"
          :label="status.value"
          :value="status.key"
        />
      </el-select>
      <!--<el-select v-if="postStatus==='all'" v-model="Searchcreator" placeholder="创建者" clearable >-->
      <!--<el-option v-for="(user,index) in userList" :value="user.id" :label="user.full_name" />-->
      <!--</el-select>-->
      <el-autocomplete
        v-if="postStatus==='all'"
        v-model="Searchcreator_un"
        :fetch-suggestions="querySearchUser"
        placeholder="creator"
        @select="handleSelect"
        clearable
      ></el-autocomplete>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="searchTask_one"
      >search</el-button>
      <router-link :to="{ name: 'addDemand' }">
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
        >create</el-button>
      </router-link>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="parentTaskList_son"
      stripe
      border
      size="medium"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortList"
      max-height="700px"
    >
      <el-table-column
        label="ID"
        prop="seq"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.seq }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="create time"
        prop="create_time"
        sortable="custom"
        width="160px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ formatDate(row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="title"
        prop="title"
        sortable="custom"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <router-link :to="{ name: 'demandDetail' ,query:{demandId:row.id}}">
            <span :class="{'hurry':row.priority===1}">{{row.title}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="priority"
        prop="priority"
        sortable="custom"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span :class="{'hurry':row.priority===1}">{{ mapPriority[row.priority]  }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="creator"
        prop="create_by"
        sortable="custom"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ usermap[row.create_by] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="type"
        prop="type"
        sortable="custom"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="status"
        prop="status"
        sortable="custom"
        width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ DemandstateMap[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="query page"
        width="300px"
        align="center"
      >
        <template slot-scope="{row}">
          <router-link
            :to="{ name: 'taskExec',query:{taskId:i.task_id} }"
            v-for="i in row.latest_task"
          >
            <div>{{i.name}}</div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="task detail"
        width="300px"
        align="center"
      >
        <template slot-scope="{row}">
          <router-link
            :to="{ name: 'taskDetail' ,query:{parentId:i.demand_id,versionId:i.version_id, task:i.task_id}}"
            v-for="i in row.diff_task"
          >
            <div>{{i.name}}</div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="operation"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <!--          关闭任务-->
          <el-tooltip
            class="item"
            effect="dark"
            content="close"
            :hide-after="500"
            placement="bottom"
          >
            <div
              style="float:left;margin-left: 20px;"
              v-if="row.create_by.toString() === String(userId) && row.status==='accepting' "
            >
              <el-button
                class="btn_action"
                icon="el-icon-check"
                type="success"
                @click="finishedDemand(row.seq,row.id,row.status)"
              />
            </div>
            <div
              style="float:left;margin-left: 20px;"
              v-else
            >
              <el-button
                class="btn_action"
                disabled
                icon="el-icon-check"
                type="success"
              />
            </div>
          </el-tooltip>
          <!--          取消任务-->
          <el-tooltip
            class="item"
            effect="dark"
            content="cancel"
            :hide-after="500"
            placement="bottom"
          >
            <div
              style="float:left;margin-left: 15px;"
              v-if="row.create_by.toString() === String(userId) && row.status!=='cancel'"
            >
              <el-button
                class="btn_action"
                icon="el-icon-delete"
                type="danger"
                @click="cancelDemand(row.seq,row.id,row.status)"
              />
            </div>
            <div
              style="float:left;margin-left: 15px;"
              v-else
            >
              <el-button
                class="btn_action"
                disabled
                icon="el-icon-delete"
                type="danger"
              />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="totalRecord_son>0"
      :total="totalRecord_son"
      :page.sync="currentPage"
      @pagination="searchTask_all"
    />
  </div>
</template>

<script>
import { DemandstateMap, formatDate, typeMap, stateMap, mapPriority, demandPriority, demandStatus, page_size } from '@/common/common'
import { getLocalStore } from '@/utils/storageUtil';
import { queryTaskList, queryDemand, markchange, ChgDemandStatus, queryMyDemand, queryDemand_order, queryMyDemand_order, queryUser } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: "All",
  components: { Pagination },
  data () {
    return {
      page_size,
      searchText_all: "",
      searchProiority: "",
      searchStatus: "",
      DemandstateMap,
      mapPriority,
      demandPriority,
      demandStatus,
      parentTaskList_son: [],
      totalRecord_son: 0,
      size_son: 0,
      totalPage_son: 0,
      currentPage: 1,
      tableKey: 0,
      listLoading: false,
      pageSzie: 20,
      ordering: "",
      Searchcreator: "",
      Searchcreator_un: "",
      userList: []
    }
  },
  props: ["parentTaskList", "totalRecord", "size", "totalPage", "usermap", "userId", "postStatus"],
  watch: {
    parentTaskList: {
      handler (newVal, OldVal) {
        this.parentTaskList_son = newVal;
      },
      immediate: true,
    },
    totalRecord: {
      handler (newVal, OldVal) {
        this.totalRecord_son = newVal;
      },
      immediate: true,
    },
    size: {
      handler (newVal, OldVal) {
        this.size_son = newVal;
      },
      immediate: true,
    },
    totalPage: {
      handler (newVal, OldVal) {
        this.totalPage_son = newVal;
      },
      immediate: true,
    },
  },
  created () {
    queryUser().then((response) => {
      this.userList = response.data;
    }).catch(function (error) { console.log(error); });
  },
  methods: {
    formatDate,
    searchTask_all () {
      this.listLoading = true;
      if (this.postStatus === 'my') {
        queryMyDemand_order(this.currentPage, this.searchText_all, this.searchStatus, this.searchProiority, this.userId, this.ordering, true).then((response) => {
          this.parentTaskList_son = response.data.results;
          this.totalRecord_son = Number(response.data.count);
          this.size_son = this.parentTaskList.length;
          this.totalPage_son = Math.ceil(this.totalRecord / this.size);
          this.listLoading = false;
        }).catch(function (error) { console.log(error); });
      } else {
        if (this.Searchcreator.length === 0 || typeof (this.Searchcreator) === 'undefined') {
          queryDemand_order(this.currentPage, this.searchText_all, this.searchStatus, this.searchProiority, this.ordering, false).then((response) => {
            this.parentTaskList_son = response.data.results;
            this.totalRecord_son = Number(response.data.count);
            this.size_son = this.parentTaskList.length;
            this.totalPage_son = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          queryMyDemand_order(this.currentPage, this.searchText_all, this.searchStatus, this.searchProiority, this.Searchcreator, this.ordering, false).then((response) => {
            this.parentTaskList_son = response.data.results;
            this.totalRecord_son = Number(response.data.count);
            this.size_son = this.parentTaskList.length;
            this.totalPage_son = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) { console.log(error); });
        }
      }
    },
    searchTask_one () {
      this.currentPage = 1;
      this.searchTask_all();
    },
    finishedDemand (seq, demandId, rawstatus) {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      this.$confirm('该需求已完成?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '并没有',
        type: 'warning'
      }).then(() => {
        let d = new Date();
        let param = {
          'status': 'finished',
          'closed_time': d.toJSON(),
        };
        if ('finished' !== rawstatus) {
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': seq,
          };
          params['field_name'] = 'status';
          params['old'] = rawstatus;
          params['new'] = 'finished';
          markchange(params).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          ChgDemandStatus(demandId, param).then((response) => {
            if (response.status == 200) { location.reload(); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未完成'
        });
      });
    },
    cancelDemand (seq, demandId, rawstatus) {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      this.$confirm('取消该需求?', '提示', {
        confirmButtonText: '确认取消',
        cancelButtonText: '不要取消',
        type: 'warning'
      }).then(() => {
        var d = new Date();
        var param = {
          'status': 'cancel',
          'canceled_time': d.toJSON(),
          'canceled_by': this.userId
        };
        if ('cancel' !== rawstatus) {
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': seq,
          };
          params['field_name'] = 'status';
          params['old'] = rawstatus;
          params['new'] = 'cancel';
          markchange(params).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          ChgDemandStatus(demandId, param).then((response) => {
            if (response.status == 200) { location.reload(); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未取消'
        });
      });
    },
    sortList (data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.ordering = prop
      } else {
        this.ordering = '-' + prop
      }
      this.searchTask_one()
    },
    querySearchUser (queryString, cb) {
      var userList = this.userList;
      var results_all = queryString ? userList.filter(this.createFilter(queryString)) : userList;
      // 调用 callback 返回建议列表的数据
      let results = [];
      for (let i in results_all) {
        results.push({ 'value': results_all[i].full_name, 'id': results_all[i].id });
      }
      this.Searchcreator = "";
      cb(results);
    },
    createFilter (queryString) {
      return (userList) => {
        return (userList.full_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      this.Searchcreator = item.id;
    }
  }
}
</script>

<style scoped>
.btn_action {
  padding: 8px 8px;
  border-radius: 20px;
  margin-left: 0px;
}
</style>
