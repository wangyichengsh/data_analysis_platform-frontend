<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-form ref="form" :model="form" label-width="80px">-->
      起始月份：
      <el-select
        v-model="start_month"
        placeholder="请选择月份"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in monthOptions"
          :key="item.month"
          :label="item.month_show"
          :value="item.month"
        />
      </el-select>

      截止月份：
      <el-select
        v-model="end_month"
        placeholder="请选择月份"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in monthOptions"
          :key="item.month"
          :label="item.month_show"
          :value="item.month"
        />
      </el-select>
      <!--      </el-form>-->
      <el-button
        class="filter-item"
        type="primary"
        @click="handleQuery(undefined)"
      >
        查看本人
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleQuery(true)"
      >
        查看本组
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleExport(undefined)"
      >
        导出本人明细
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleExport(true)"
      >
        导出本组明细
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleSave"
      >
        保存
      </el-button>
      <el-button
        v-if="permission.includes('audit_export')"
        class="filter-item"
        type="primary"
        @click="handleReport"
      >
        审计报告
      </el-button>
      <router-link
        target="_blank"
        :to="{ path:'/audit/print', query:{start_month: start_month, end_month: end_month} }"
      >
        <el-button
          type="primary"
          class="filter-item"
        >
          打印
        </el-button>
      </router-link>
    </div>
    <div
      v-loading="listLoading"
      style="height: 900px;"
    >
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;"
        type="border-card"
        @tab-click="handleClickTab"
      >
        <el-tab-pane
          v-for="table in result"
          :key="table.model_name"
          :label="table.rule_name"
          :name="table.model_name"
        />
        <el-table
          v-for="table in result"
          v-loading="listLoading"
          :data="table.data"
          stripe
          border
          size="mini"
          fit
          highlight-current-row
          v-if="activeName === table.model_name"
          max-height="700px"
        >
          <el-table-column
            v-for="column in table.columns"
            :prop="column.col_name"
            :label="column.col_label"
            align="center"
            :min-width="getColWidth(column.col_name)"
          >
            <template slot-scope="{row}">
              <el-input
                v-if="column.col_name === 'remark'"
                v-model="row[column.col_name]"
                placeholder="请输入内容"
                clearable
                style="width: 40px;"
              >
              </el-input>
              <span v-else>{{ row[column.col_name] }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { queryAuditPermisson, queryAuditMonths, queryAuditData, updateAuditData, exportAuditDetail, exportAuditReport } from '@/api/audit'
import { downloadFile } from '@/utils/file-transfer'

export default {
  name: 'Index',
  // components: { AuditTable },
  data () {
    return {
      // 权限，'report':可导出审计报告，'edit_group':可修改本组数据
      permission: [],
      // 月份
      monthOptions: [],
      // tab活动页
      activeName: '',
      // 查询条件
      start_month: undefined,
      end_month: undefined,
      // loading图标
      listLoading: false,
      // 页面查询结果
      result: []
    }
  },
  created () {
    this.getPermission()
    this.getMonths()
  },
  watch: {
    monthOptions (val) {
      this.start_month = val[0].month
      this.end_month = val[0].month
    }
  },
  methods: {
    // 切换tab页
    handleClickTab (tab) {
      this.listLoading = true
      this.activeName = tab.name
      this.listLoading = false
    },
    // 列宽
    getColWidth (colname) {
      if (colname === 'remark') {
        return 200
      } else {
        return 80
      }
    },
    // 获取可查询月份
    getMonths () {
      queryAuditMonths().then((resp) => {
        this.monthOptions = resp.data
      })
    },
    // 判断权限
    getPermission () {
      queryAuditPermisson().then((resp) => {
        this.permission = resp.data
      })
    },
    // 查询
    handleQuery (is_group) {
      let vm = this
      vm.listLoading = true
      queryAuditData(this.start_month, this.end_month, is_group).then((resp) => {
        this.result = resp.data
        if (this.result[0]) {
          this.activeName = this.result[0].model_name
        }
        else {
          this.result = []
          this.activeName = ""
          vm.$message.info("没有数据")
        }
        vm.listLoading = false
      }).catch(function (error) {
        vm.listLoading = false
        vm.$message.error('查询失败')
      })
    },
    // 保存
    handleSave () {
      let vm = this
      if (vm.result[0]) {
        vm.listLoading = true
        updateAuditData(this.result).then((resp) => {
          vm.listLoading = false
          vm.$message.success('保存成功')
        }).catch(function (error) {
          vm.listLoading = false
          vm.$message.error('保存失败')
        })
      }
      else {
        vm.$message.info('没有需保存的数据')
      }
    },
    // 下载明细
    handleExport (is_group) {
      let vm = this
      vm.listLoading = true
      exportAuditDetail(this.start_month, this.end_month, is_group).then((resp) => {
        downloadFile(resp.data, '审计明细.xlsx')
        vm.listLoading = false
      }).catch(function (error) {
        vm.listLoading = false
        vm.$message.error('下载明细失败')
      })
    },
    // 审计报告
    handleReport () {
      let vm = this
      vm.listLoading = true
      exportAuditReport(this.start_month, this.end_month).then((resp) => {
        downloadFile(resp.data, '审计报告.xlsx')
        vm.listLoading = false
      }).catch(function (error) {
        vm.listLoading = false
        vm.$message.error('导出报告失败')
      })
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 100% !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>
