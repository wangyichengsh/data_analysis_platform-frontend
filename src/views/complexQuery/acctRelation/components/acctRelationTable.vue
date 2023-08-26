<!--
 * @Author: 张杰
 * @Date: 2020-06-29 09:13:39
 * @LastEditTime: 2020-07-08 10:10:56
 * @LastEditors: 张杰
 * @Description: In User Settings Edit
 * @FilePath: \anls_web\src\views\complexQuery\acctRelation\components\acctRelationTable.vue
--> 
<template>
  <div>
    <el-table
      v-loading="loading"
      :data="result.data"
      border
      size="mini"
      fit
      highlight-current-row
      show-overflow-tooltip
      tooltip-effect="dark"
      :height="height"
      header-cell-class-name="table-header-cell"
      @sort-change="sortList"
    >
      <el-table-column
        v-for="column in result.columns"
        :prop="column.name"
        :label="column.label"
        align="center"
        sortable="custom"
        min-width="150px"
      />
    </el-table>
    <pagination
      id="pagination"
      v-show="total>0"
      small
      :page-sizes="[50,100,200]"
      :total="total"
      :page.sync="page_number"
      :limit.sync="page_size"
      @pagination="getList()"
    />
  </div>
</template>

<script>
import { queryAcctRelation } from '@/api/complexApp/acctRelation'
import Pagination from '@/components/Pagination'

export default {
  name: 'AcctRelationTable',
  components: { Pagination },
  props: ['height', 'parameter', 'id', 'tablename'],
  data () {
    return {
      loading: false,
      total: 0,
      page_number: 1,
      page_size: 50,
      order_by: [],
      // filters: [],
      result: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      queryAcctRelation(this.id, this.tablename, this.filters, this.page_size, this.page_number, this.order_by).then((resp) => {
        this.result = resp.data
        this.total = this.result.row_total_num
        this.loading = false
      }).catch(function () {
        this.loading = false
        this.result = []
      })
    },
    sortList (data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.order_by = prop
      } else {
        this.order_by = '-' + prop
      }
      this.getList()
    }
  }
}
</script>

<style scoped>
#pagination {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
