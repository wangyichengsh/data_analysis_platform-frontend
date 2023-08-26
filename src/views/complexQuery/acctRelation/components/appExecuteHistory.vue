<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="history.data"
      border
      size="medium"
      fit
      highlight-current-row
      header-cell-class-name="table-header-cell"
      row-class-name="row-history"
      :height="height"
    >
      <el-table-column
        prop="user_name"
        label="用户名"
        align="center"
      />
      <el-table-column
        prop="execute_start_time"
        label="开始时间"
        align="center"
        :formatter="dateTimeFormat"
      />
      <el-table-column
        prop="execute_end_time"
        label="完成时间"
        align="center"
        sortable
        :formatter="dateTimeFormat"
      />
      <el-table-column
        prop="use_time"
        label="耗时"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        class-name="col-operation"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.exec_status === 0"
            class="btn-loading"
            type="text"
            @click="handleQueryHistory(row)"
          >查询数据中，请稍后</el-button>
          <el-button
            v-else-if="row.exec_status === 1"
            type="text"
            class="btn-success"
            @click="handleQueryHistory(row)"
          >查看结果
          </el-button>
          <el-button
            v-else
            type="text"
            class="btn-failed"
            @click="handleQueryHistory(row)"
          >查询数据失败</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="left"
        class-name="col-remark"
        min-width="200px"
      >
        <template slot-scope="{row}">

          <div v-if="row.user_id.toString() === userId.toString()">
            <div v-if="row.edit">
              <el-input
                class="input-remark"
                size="small"
                v-model="row.remark"
                v-on:keyup.enter="handleSaveRemark(row)"
                v-on:keyup.esc="handleCancelRemark(row)"
              ></el-input>
              <el-button
                class="btn-remark"
                type="text"
                size="small"
                circle
                @click="handleSaveRemark(row)"
              >保存</el-button>
              <el-button
                class="btn-remark"
                type="text"
                size="small"
                circle
                @click="handleCancelRemark(row)"
              >取消</el-button>
            </div>
            <div v-else>
              <span>{{ row.remark }}</span>
              <el-button
                class="btn-remark"
                type="text"
                size="mini"
                circle
                @click="handleEditRemark(row)"
              >编辑</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      id="pagination"
      small
      :page-sizes="[15,20,30,50,100]"
      :total="total"
      :page.sync="page"
      :limit.sync="page_size"
      @pagination="queryAllHistory()"
    />
  </div>
</template>

<script>
import { executeApp, getHistory, putHasViewedTrue, patchHistoryRemark } from '@/api/component'
import { parseTime } from '@/utils'
import { getLocalStore } from '@/utils/storageUtil'
import Pagination from '@/components/Pagination'
export default {
  name: 'AppExecuteHistory',
  components: { Pagination },
  props: ['appId', 'parameter', 'execute', 'remark'],
  data () {
    return {
      tableLoading: false,
      history: [],
      // 历史程序是否已执行完成
      historyCompleted: true,
      // 计时器，若历史程序未完成，则定时更新历史程序状态
      timer: '',
      total: 0,
      page: 1,
      page_size: 15,
      order_by: '',
      height: '585px',
      userId: ''
    }
  },
  watch: {
    execute (val) {
      if (val === true) {
        this.aysnExecute()
      }
      this.$emit('executed')
    },
    // 若历史程序未完成，则定时更新历史程序状态
    historyCompleted (val) {
      if (val === false) {
        this.timer = setInterval(this.queryAllHistory, 30000)
      }
      else {
        window.clearInterval(this.timer)
      }
    },
    immediate: true
  },
  created () {
    this.queryAllHistory(this.appId)
    this.userId = getLocalStore('userId')
  },
  methods: {
    // 查询历史程序状态，尚未分页
    queryAllHistory () {
      getHistory(this.appId, this.page_size, this.page, this.order_by).then((resp) => {
        this.history = resp.data.results
        const items = resp.data.results.data
        this.history.data = items.map(v => {
          // 用于设置是否可编辑
          this.$set(v, 'edit', false)
          // 用于取消按钮恢复数据
          v.originalRemark = v.remark
          return v
        })
        this.total = resp.data.count
        var exec_status = 0
        var historyCompleted = true
        for (var i in this.history.data) {
          exec_status = this.history.data[i].exec_status
          if (exec_status === 0) {
            historyCompleted = false
            break
          }
          else {
            historyCompleted = true
          }
        }
        this.historyCompleted = historyCompleted
      })
    },
    // 执行程序
    aysnExecute () {
      executeApp(this.appId, this.parameter, this.remark).then((resp) => {
        this.history = resp.data
        const items = resp.data.data
        this.history.data = items.map(v => {
          // 用于设置是否可编辑
          this.$set(v, 'edit', false)
          // 用于取消按钮恢复数据
          v.originalRemark = v.remark
          return v
        })
        this.remark = ''
      })
      this.historyCompleted = false
    },
    // 将查看记录的参数返回给父组件
    handleQueryHistory (row) {
      this.$emit('input', row)
    },
    // 查看日志
    handleQueryLog (row) {
      // this.$emit('input', row)
    },
    // 日期显示格式
    dateTimeFormat (row, col, cellValue) {
      if (cellValue === null) {
        return cellValue
      } else {
        return parseTime(cellValue)
      }
    },
    // 编辑备注
    handleEditRemark (row) {
      row.originalRemark = row.remark
      row.edit = true
    },
    // 保存备注
    handleSaveRemark (row) {
      row.edit = false
      row.originalRemark = row.remark
      patchHistoryRemark(row.id, row.remark)
    },
    // 取消编辑备注
    handleCancelRemark (row) {
      row.edit = false
      row.remark = row.originalRemark
    },
    // 排序
    sortList (data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.order_by = prop
      } else {
        this.order_by = '-' + prop
      }
      this.queryAllHistory()
    }
  }
}

</script>

<style>
.btn-success {
  width: 100px;
  height: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #1b64ff;
  text-align: left;
}
.btn-failed {
  width: 100px;
  height: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #e43636;
  text-align: left;
}
.btn-loading {
  width: 100px;
  height: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #09ca3d;
  text-align: left;
}
.table-header-cell {
  background-color: #f1f3f8 !important;
}
.row-history > td {
  padding-top: 2px;
  padding-bottom: 2px;
}
#pagination {
  padding-top: 10px;
  padding-bottom: 5px;
}
.input-remark {
  width: 85% !important;
}
.btn-remark {
  padding: 1px !important;
  margin: 1px !important;
}
</style>

