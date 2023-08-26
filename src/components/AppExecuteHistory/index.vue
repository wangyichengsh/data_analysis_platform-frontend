<template>
  <el-table
    v-loading="tableLoading"
    :data="history.data"
    stripe
    border
    size="mini"
    fit
    highlight-current-row
    :height="height"
  >
    <el-table-column prop="user_name" label="username" align="center">
      <template slot-scope="{row}">{{ row.user_name }}</template>
    </el-table-column>
    <el-table-column label="start time" prop="execute_start_time" align="center" :formatter="dateTimeFormat">
    </el-table-column>
    <el-table-column label="finish time" prop="execute_end_time" align="center" :formatter="dateTimeFormat">
    </el-table-column>
    <el-table-column label="consume time" align="center">
      <template slot-scope="{row}">{{ row.execute_end_time - row.execute_start_time }}</template>
    </el-table-column>
    <el-table-column prop="exec_status" label="status" align="center" :formatter="statusLabel">
    </el-table-column>
    <el-table-column label="operation" align="center" label-class-name="td-operator" style="padding:0px;">
      <template slot-scope="{row}">
        <el-button
          v-if = "row.exec_status === 0"
          :loading=true
          type = "primary"
        >executing</el-button>

          <el-button
            v-else-if = "row.exec_status === 1"
            type = "success"
            @click="handleQueryHistory(row)"
          ><el-badge value="New" class="item">result</el-badge>
          </el-button>

        <el-button
          v-else
          type = "danger"
          @click="handleShowlog(row)"
          disabled
        >failed</el-button>
        <span v-else>{{ row[column.name] }}</span>
      </template>
    </el-table-column>


  </el-table>

</template>

<script>
import { executeApp, getAllHistory } from '@/api/component'
import {parseTime} from '@/utils'

export default {
  name: 'AppExecuteHistory',
  props: ['appId', 'parameter', 'height'],
  data() {
    return {
      tableLoading: false,
      history: []
    }
  },
  watch: {
    parameter(val) {
      this.aysnExecute()
    },
    immediate: true
  },
  created() {
    this.queryAllHistory(this.appId)
  },
  methods: {
    queryAllHistory() {
      getAllHistory(this.appId).then((resp) => {
        this.history = resp.data
        console.log(this.history.columns)
      })
    },
    aysnExecute() {
      executeApp(this.appId, this.parameter).then((resp) => {
        this.history = resp.data
      })
    },
    handleQueryHistory(row){
      this.$emit('input', row)
      // setInterval(500,this.tableLoading=true)
      // this.tableLoading = false
      // this.loading = false
    },
    dateTimeFormat(row,column,cellValue){
      if (cellValue !== null){
        return parseTime(cellValue)
      }
      else{
        return cellValue
      }
    },
    statusLabel(row,column,cellValue){
      if(cellValue === -1){
        return 'failed'
      }
      else if (cellValue === 0){
        return 'executing'
      }
      else if (cellValue === 1){
        return 'succeeded'
      }
    }
  }
}

</script>

<style scoped>
  .el-button{
    width: 100px;
    height:30px;
    padding-top:5px;
    padding-bottom:5px;
  }
</style>

