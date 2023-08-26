<!--suppress XmlDuplicatedId -->
<template>
  <div class="app-container">
    <el-card
      class="box-card"
      shadow="never"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <div
          class="parameter-container-header"
          v-if="showData === 'history'"
        >
          <p>筛选条件</p>
          <div class="button-container">
            <el-button
              size="mini"
              @click="handleInstruct"
            >说明</el-button>
            <el-button
              size="mini"
              @click="handleClear"
            >清空</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="remarkDialogVisible = true"
            >查询</el-button>
          </div>
        </div>
        <div
          class="parameter-container-header"
          v-else
        >
          <p>查看结果</p>
          <div class="button-container">
            <router-link
              target="_blank"
              :to="{name:'AcctRelationGraph', query:{queryId: page_info.query_id, appId: appId, id: page_info.id}}"
            >
              <el-button
                size="mini"
                type="primary"
              >查看关联图</el-button>
            </router-link>
            <el-button
              size="mini"
              type="primary"
              @click="handleExportParameter"
            >导出输入参数</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleExportAcctGroup"
            >导出分组数据</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleExportDtl"
            >导出终端流水</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleShowHistory"
            >历史记录</el-button>
          </div>
        </div>

        <el-dialog
          title="备注信息"
          :visible.sync="remarkDialogVisible"
          width="30%"
          center
        >
          <el-input
            v-model="remark"
            class="input-dialog-remark"
            placeholder="备注信息"
          ></el-input>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="remark = '';remarkDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="handleQuery"
            >确 定</el-button>
          </span>
        </el-dialog>

        <Parameter v-model="parameter"></Parameter>
      </div>

      <div class="data-container">
        <div v-if="showData === 'history'">
          <p>历史记录</p>
          <AppExecuteHistory
            v-model="page_info"
            :app-id="appId"
            :parameter="parameter_exec"
            :execute="execute"
            :remark="remark"
            v-on:executed="executed"
          >
          </AppExecuteHistory>
        </div>
        <div v-else>
          <el-tabs
            class="data-tab"
            v-model="activeTabName"
            style="margin-top:15px;width: 100%;"
            type="border-card"
            @tab-click="handleClickTab"
          >
            <el-tab-pane
              v-for="tab in tabMapOptions"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            >
              <keep-alive>
                <AcctRelationTable
                  :id="id"
                  :tablename="tab.name"
                  height="550px"
                  :activeTabName="activeTabName"
                />
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>

</template>

<script>

// import Pagination from '@/components/Pagination'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import AppExecuteHistory from './components/appExecuteHistory'
import Parameter from './components/parameter'
import AcctRelationTable from './components/acctRelationTable'
import { queryAcctRelation, queryAcctGraph, exportAcctRelationFile, exportAcctRelationDoc } from '@/api/complexApp/acctRelation'
import { executeApp, getHistory, putHasViewedTrue } from '@/api/component'
import { parseTime } from '@/utils'
import { downloadFile } from '@/utils/file-transfer'

export default {
  name: 'Index',
  components: { AppExecuteHistory, Parameter, AcctRelationTable },
  data () {
    return {
      // 查询参数
      parameter: {
        period: [],
        acct_id: '',
        sec_code: '',
        ip: '',
        mac: '',
        mobile: '',
        hardware: '',
        lvl4_n: 3
      },
      // tab页信息（后续变更为从后端获取）
      tabMapOptions: [
        { name: 'acct_group', label: '账户分组' },
        { name: 'device_relation', label: '终端关联明细' },
        { name: 'physical_relation_dtl', label: '物理关联明细' },
        { name: 'relation_info', label: '关联详细信息' },
        { name: 'acct_device_all', label: '账户终端流水' },
        { name: 'invalid_device', label: '无效终端' }
      ],
      // 执行参数（对查询参数做处理，传递给子组件）
      parameter_exec: {},
      // 历史记录中的id
      id: 0,
      // appid(后续变更为从后端获取)
      appId: 1,
      // 加载图标
      loading: false,
      // 历史信息
      history: [],
      // 页面信息
      page_info: {},
      // 显示数据选项（data:应用结果数据；history:历史查询记录）
      showData: 'history',
      // 显示应用结果数据时的活动tab页
      activeTabName: 'acct_group',
      // true:向子组件发送信息开始查询；false：不发送查询要求
      execute: false,
      // 备注输入对话框
      remarkDialogVisible: false,
      // 备注内容
      remark: ''
    }
  },
  watch: {
    // 查看历史记录时，变更页面参数。若该历史记录为成功执行的记录，则进入结果数据页面。
    page_info (val) {
      this.paramToFront(val.parameter)
      this.id = val.id
      if (val.exec_status === 1) {
        this.showData = 'data'
      }
    }
  },
  // created () {
  //   this.queryAllHistory(this.appId)
  // },
  methods: {
    // 后端参数转换为前端显示参数
    paramToFront (param) {
      this.parameter.period = [param.start_date, param.end_date]
      this.parameter.lvl4_n = param.lvl4_n
      this.parameter.acct_id = param.acct_id.join('\n')
      this.parameter.sec_code = param.sec_code.join('\n')
      this.parameter.ip = param.ip.join('\n')
      this.parameter.mac = param.mac.join('\n')
      this.parameter.mobile = param.mobile.join('\n')
      this.parameter.hardware = param.hardware.join('\n')
    },
    // 前端参数转换为后端执行参数
    paramToExec (param) {
      this.parameter_exec.start_date = param.period[0]
      this.parameter_exec.end_date = param.period[1]
      this.parameter_exec.lvl4_n = param.lvl4_n
      this.parameter_exec.acct_id = param.acct_id.split('\n')
      this.parameter_exec.sec_code = param.sec_code.split('\n')
      this.parameter_exec.ip = param.ip.split('\n')
      this.parameter_exec.mac = param.mac.split('\n')
      this.parameter_exec.mobile = param.mobile.split('\n')
      this.parameter_exec.hardware = param.hardware.split('\n')
    },
    // 参数有效性判断
    paramIsValid () {
      if (this.parameter.period.length !== 2) {
        this.$message.info('请输入起始截止日期')
        return false
      }
      if (this.parameter.acct_id === undefined || this.parameter.acct_id.length === 0) {
        this.$message.info('请输入账户代码')
        return false
      }
      if (this.parameter.lvl4_n === undefined) {
        this.$message.info('请输入4级-N日内')
        return false
      }
      return true
    },
    // 查询数据
    handleQuery () {
      this.remarkDialogVisible = false
      this.history = []
      this.parameter.acct_id = this.parameter.acct_id.replace(/(\s*$)/g, "")
      if (this.paramIsValid()) {
        this.paramToExec(this.parameter)
        this.execute = true
        this.historyCompleted = false
      }
    },
    // 清空参数
    handleClear () {
      this.parameter = {
        period: [],
        acct_id: '',
        sec_code: '',
        ip: '',
        mac: '',
        mobile: '',
        hardware: '',
        lvl4_n: 3
      }
    },
    // 切换tab页
    handleClickTab (tab) {
      this.activeTabName = tab.name
      // this.getAcctRelationData(this.activeTabName)
    },
    // 获取数据
    getAcctRelationData (tabname) {
      const vm = this
      vm.loading = true
      queryAcctRelation(vm.id, vm.activeTabName, vm.filters, vm.page_size, vm.page_number, vm.order_by).then((resp) => {
        vm.result = resp.data
        vm.total = vm.result.row_total_num
        vm.loading = false
      }).catch(function () {
        vm.loading = false
        vm.result = []
      })
    },
    // 从vendor.Export2Excel中复制的函数，saveAs前调用
    s2ab (s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
    // 导出输入参数
    handleExportParameter () {
      if (this.paramIsValid()) {
        this.paramToExec(this.parameter)
        // 将参数写入二维数组，再转置，最后用XLSX写入EXCEL中
        var data = new Array()
        var rowNum = 1
        for (var i in this.parameter_exec) {
          if (typeof this.parameter_exec[i] === 'string' | typeof this.parameter_exec[i] === 'number') {
            data.push([this.parameter_exec[i]])
            console.log(i)
          }
          else {
            var rowNum = Math.max(rowNum, this.parameter_exec[i].length)
            data.push(this.parameter_exec[i])
          }
        }
        var dataT = new Array()
        for (var i = 0; i < rowNum; i++) {
          dataT[i] = []
        }
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            dataT[j][i] = data[i][j]
          }
        }
        // 添加标题
        dataT.unshift(['起始日期', '截止日期', '4级-N日内', '账户代码', '股票代码', '无效IP', '无效MAC', '无效联系电话', '无效硬盘序列号'])
        // 写入EXCEL
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(dataT)
        XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], {
          type: "application/octet-stream"
        }), "输入参数.xlsx")
      }
    },

    // 导出分组数据
    handleExportAcctGroup () {
      let vm = this
      exportAcctRelationFile(this.id, this.appId, 'excel').then((resp) => {
        downloadFile(resp.data, '关联账户分组.xlsx')
      }).catch(function (error) {
        vm.$message.error('下载文件失败')
      })
    },
    // 导出终端流水
    handleExportDtl () {
      let vm = this
      exportAcctRelationFile(this.id, this.appId, 'csv').then((resp) => {
        downloadFile(resp.data, '账户终端流水.csv')
      }).catch(function (error) {
        vm.$message.error('下载文件失败')
      })
    },
    // 显示历史数据
    handleShowHistory () {
      this.showData = 'history'
    },
    // 算法说明
    handleInstruct () {
      let vm = this
      exportAcctRelationDoc().then((resp) => {
        downloadFile(resp.data, '新终端关联使用手册.docx')
      }).catch(function (error) {
        vm.$message.error('下载文件失败')
      })
    },
    // 已执行程序，将可执行状态调整为false
    executed () {
      this.execute = false
    }
  }
}
</script>

<style lang="scss">
.app-container {
  background-color: rgb(240, 243, 244);
}
.parameter-container-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.data-container {
  height: 100%;
}
p {
  color: #1c1d1d;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  margin-top: 10px;
  margin-bottom: 10px;
}
.box-card {
  height: 100%;
  border: none;
  padding: 20px;
  padding-bottom: 0px;
}
.box-card > .el-card__header {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 20px;
}
.box-card > .el-card__body {
  padding: 0px;
}
.input-dialog-remark {
  width: 100% !important;
}
</style>
