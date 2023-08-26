<template>
  <div
    class="pdf-container"
    element-loading-text="Efforts to generate PDF"
  >
    <div
      class="table-container"
      v-for="table in result"
    >
      <p class="table-title">{{ table.rule_name }}</p>
      <el-table
        :data="table.data"
        stripe
        border
        size="mini"
        highlight-current-row
      >
        <el-table-column
          v-for="column in table.columns"
          :prop="column.col_name"
          :label="column.col_label"
          align="center"
          :min-width="getColWidth(column.col_name)"
        >
          <template slot-scope="{row}">
            <span>{{ row[column.col_name] }}</span>
          </template>
        </el-table-column>

      </el-table>

    </div>
  </div>
</template>

<script>
import { queryAuditData } from '@/api/audit'

export default {
  name: 'downloadPdf',
  data () {
    return {
      start_month: '',
      end_month: '',
      result: [],
      listLoading: false
    }
  },
  created () {
    this.start_month = this.$route.query.start_month
    this.end_month = this.$route.query.end_month
    this.handleQuery(true)

  },
  mounted () {
    setTimeout(() => {
      this.$nextTick(() => {
        window.print()
      })
    }, 1000)
  },
  methods: {
    // 查询
    handleQuery (is_group) {
      let vm = this
      vm.listLoading = true
      queryAuditData(this.start_month, this.end_month, is_group).then((resp) => {
        this.result = resp.data
        if (!this.result[0]) {
          this.result = []
          vm.$message.info("没有数据")
        }
        vm.listLoading = false
      }).catch(function (error) {
        vm.listLoading = false
        vm.$message.error('查询失败')
      })
    },
    // 列宽
    getColWidth (colname) {
      if (colname === 'remark') {
        return 200
      } else {
        return 80
      }
    }
  }
}
</script>

<style scoped>
.pdf-container {
  width: 1100px;
  padding: 10px;
  align-items: center;
  text-align: center;
  margin: auto;
}
.table-container {
  padding-bottom: 5px;
  padding-top: 5px;
}
.table-title {
  font-size: large;
}
</style>
