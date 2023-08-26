<!--
 * @Author: 张杰
 * @Date: 2020-07-08 10:30:22
 * @LastEditTime: 2020-07-24 08:54:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \anls_web_master\src\views\complexQuery\acctRelation\graph.vue
-->
<template>
  <div class='app-main'>
    <div class="app-container">
      <el-row
        :gutter="10"
        type="flex"
        class="app-container-row"
      >
        <el-col :span="16">
          <div class="graph-container">
            <div class="graph-toolbox">
              <div>
                <el-select
                  v-model="graphGroup"
                  placeholder="请选择分组方式"
                  class="select-graph-group"
                  @change="getRespData"
                  size="mini"
                >
                  <el-option
                    v-for="item in graphGroupOptions"
                    :key="item.key"
                    :label="item.label"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <el-checkbox
                  v-model="useAcctDefaultGroup"
                  @change="getRespData"
                >图例维持物理关联并组（2级以上）分组</el-checkbox>
                <el-input
                  v-model="searchNode"
                  size="mini"
                  @keypress.enter.native="handleSearchNode"
                ></el-input>
                <el-button
                  size="mini"
                  class="el-icon-search"
                  @click="handleSearchNode"
                ></el-button>
              </div>
              <div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="全选图例"
                  placement="bottom"
                >
                  <el-button
                    type="primary"
                    size="medium "
                    plain
                    circle
                    @click="checkAllLegends"
                  >
                    <svg-icon :icon-class="isCheckAllLegends? 'check-all':'check-none'" />
                  </el-button>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="graphShowDevice? '查看终端节点':'隐藏终端节点'"
                  placement="bottom"
                >
                  <el-button
                    type="primary"
                    size="medium "
                    plain
                    circle
                    @click="graphShowDevice = !graphShowDevice"
                  >
                    <svg-icon :icon-class="graphShowDevice? 'eye-open':'eye'" />
                  </el-button>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="symbolSize === 'trade'? '按成交量大小':'按关联数显示大小'"
                  placement="bottom"
                >
                  <el-button
                    type="primary"
                    size="medium "
                    plain
                    circle
                    @click="symbolSize === 'trade'? symbolSize = 'relation':symbolSize = 'trade'"
                  >
                    <svg-icon :icon-class="symbolSize === 'trade'? 'trade':'relation'" />
                  </el-button>
                </el-tooltip>

                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  content="重置图形"
                  placement="bottom"
                >
                  <el-button
                    class="el-icon-refresh"
                    type="primary"
                    size="medium "
                    plain
                    circle
                    @click="initGraphData"
                  />
                </el-tooltip> -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="下载图形"
                  placement="bottom"
                >
                  <el-button
                    class="el-icon-download"
                    type="primary"
                    size="medium "
                    plain
                    circle
                    @click="downloadGraph"
                  />
                </el-tooltip>
              </div>
            </div>
            <!-- <v-chart
              class="graph-show"
              :options="{}"
              :setOptions="graphOptions"
              @click="handleClickGraph"
            >
            </v-chart> -->
            <div id="chart">
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <!-- <el-tabs
            class="data-tab"
            v-model="activeTabName"
            style="width: 100%;height:100%"
            type="border-card"
            @tab-click="handleClickTab"
          > -->
          <!-- <el-tab-pane
              v-for="tab in tabMapOptions"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            >
            </el-tab-pane> -->
          <el-card
            class="card-graph-info"
            shadow="never"
          >
            <div slot="header">
              <div class="graph-btn-container">
                <p>查询指定账户对详情</p>
                <div>
                  <el-button
                    size="mini"
                    @click="clearQueryPath"
                  >清空</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="queryPath"
                  >查询</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="downloadRelationInfo"
                  >下载</el-button>
                </div>
              </div>
              <div class="graph-input-container">
                <div>
                  <span>账户A：</span>
                  <el-input
                    placeholder="请输入账户代码"
                    v-model="nodeA"
                  ></el-input>
                </div>
                <div>
                  <span>账户B：</span>
                  <el-input
                    placeholder="请输入账户代码"
                    v-model="nodeB"
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="acct-relation-info">
              <el-table
                :v-if="queryPathResult.data.data.length >= 1"
                :data="queryPathResult.data.data"
                border
                size="mini"
                fit
                highlight-current-row
                show-overflow-tooltip
                tooltip-effect="dark"
                :height="722"
                header-cell-class-name="table-header-cell"
              >
                <el-table-column
                  v-for="column in queryPathResult.data.columns"
                  :prop="column.name"
                  :label="column.label"
                  min-width="150px"
                  align="center"
                />
              </el-table>
            </div>
          </el-card>
          <!-- </el-tabs> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import fadeOutItem from 'echarts/lib/chart/graph/GraphView'
import { queryAcctGraph, queryPath } from '@/api/complexApp/acctRelation'


/// 用于存放tooltip的点击回调函数的map
let toolTipClickCallback = {}

/// 真实的点击回调函数，内部实际上是调用的上面map中的函数
window.onClickTooktip = function (action, dataType, dataIndex, chartKey) {
  if (toolTipClickCallback[chartKey]) {
    toolTipClickCallback[chartKey](action, dataType, dataIndex)
  }
}


export default {
  name: 'AcctRelationGraph',
  // components: { AcctRelationTooltip },
  props: {
    chartKey: String,
  },
  data () {
    return {
      // 图形分组选项
      graphGroupOptions: [
        { 'key': 'grp_lvl_gt_2', 'label': '物理关联并组（2级以上）' },
        { 'key': 'grp_lvl_gt_3', 'label': '物理关联并组（3级以上）' },
        { 'key': 'grp_lvl_gt_4', 'label': '物理关联并组（4级以上）' },
        { 'key': 'grp_lvl_2_ip', 'label': '账户IP组号(2级)' },
        { 'key': 'grp_lvl_2_mac', 'label': '账户MAC组号(2/3级)' },
        { 'key': 'grp_lvl_2_mobile', 'label': '账户电话组号(2/3级)' },
        { 'key': 'grp_lvl_2_hardware', 'label': '账户硬盘序列号组号(2/3级)' },
        { 'key': 'grp_lvl_2', 'label': '关联级别（2级）' },
        { 'key': 'grp_lvl_3_ip', 'label': '账户IP组号(3级)' },
        { 'key': 'grp_lvl_3', 'label': '关联级别（3级）' },
        { 'key': 'grp_lvl_4_ip', 'label': '账户IP组号(4级)' },
        { 'key': 'grp_lvl_4_mac', 'label': '账户MAC组号(4级)' },
        { 'key': 'grp_lvl_4_mobile', 'label': '账户电话组号(4级)' },
        { 'key': 'grp_lvl_4_hardware', 'label': '账户硬盘序列号组号(4级)' },
        { 'key': 'grp_lvl_4', 'label': '关联级别（4级）' },
        { 'key': 'grp_lvl_5', 'label': '账户5级关联组号' },
        { 'key': 'grp_lvl_6', 'label': '账户6级关联组号' },
      ],
      // 选择的图形分组
      graphGroup: 'grp_lvl_gt_2',
      // 默认保持按物理关联2级以上分组
      useAcctDefaultGroup: true,
      // 账户A
      nodeA: '',
      // 账户B
      nodeB: '',
      // 后端获取的原始数据
      respData: [],
      // 图形数据（对后端获取的数据做处理）
      graphData: { 'nodes': [], 'edges': [], 'catogories': [] },
      // 图形类型
      // relationType: 'acct_to_acct',
      // 图形显示终端节点
      graphShowDevice: false,
      // 图例大小
      symbolSize: 'relation',
      // 移除的节点
      removedNodes: [],
      // 移除的关系
      removedEdges: [],
      // 全选图例
      isCheckAllLegends: true,
      // tab页
      tabMapOptions: [
        { name: 'acct_to_acct', label: '账户对关联' },
        // { name: 'acct_to_info', label: '账户与终端关联' },
        { name: 'invalid_device', label: '无效终端' }
      ],
      // 活动tab页
      activeTabName: 'acct_to_acct',
      // 搜索节点
      searchNode: '',
      // 关联路径
      queryPathResult: { 'path': '', 'data': { 'data': [], 'columns': [] } },

    }
  },
  computed: {
    queryId () {
      return this.$route.query.queryId
    },
    id () {
      return this.$route.query.id
    },
    appId () {
      return this.$route.query.appId
    },
    // 图形配置
    graphOptions () {
      // return this.acctRelationOptions()
      const vm = this

      for (var i in this.graphData.nodes) {
        const node = this.graphData.nodes[i]
        node.itemStyle = {
          emphasis: {
            // color: 'white',
            borderWidth: 3,
            borderColor: 'white',
            opacity: 1
          }
        }

        if (node.type === 'acct') {
          node.symbol = 'circle'
          node.label = {
            normal: {
              show: true,
              position: 'inside',
              formatter: String(node.acct_group),
              color: 'black'
            },
            emphasis: {
              position: 'right',
              formatter: '{b}-{c}',
              color: '#fff'
            }

          }
        }
        else {
          node.label = {
            position: 'right',
            formatter: '{b}'
          }

          if (node.acct_info_type === 'CCRC_ACCT_ID') {
            node.symbol = 'path://M672 320a160 160 0 1 0-160 160 160 160 0 0 0 160-160z m64 0a224 224 0 1 1-224-224 224 224 0 0 1 224 224z M224 832a32 32 0 0 1-64 0 352 352 0 0 1 704 0 32 32 0 0 1-64 0 288 288 0 0 0-576 0z'
          }
          else if (node.acct_info_type === 'MOBILE') {
            node.symbol = 'path://M983.8 312.7C958 251.7 921 197 874 150c-47-47-101.7-84-162.7-109.7C648.2 13.5 581.1 0 512 0S375.8 13.5 312.7 40.3C251.7 66 197 103 150 150c-47 47-84 101.7-109.7 162.7C13.5 375.8 0 442.9 0 512s13.5 136.2 40.3 199.3C66 772.3 103 827 150 874c47 47 101.8 83.9 162.7 109.7 63.1 26.7 130.2 40.3 199.3 40.3s136.2-13.5 199.3-40.3C772.3 958 827 921 874 874c47-47 83.9-101.8 109.7-162.7 26.7-63.1 40.3-130.2 40.3-199.3s-13.5-136.2-40.2-199.3zM717 665.6l-54.8 54.8C566.6 735.1 465.6 705.6 392 632c-73.6-73.6-103.1-174.6-88.4-270.2l54.8-54.8c9.3-9.3 24.3-9.3 33.6 0l86.4 86.4c9.3 9.3 9.3 24.3 0 33.6L421 484.4l-0.4 0.4c0.1 30.3 11.8 60.6 34.9 83.7 23.4 23.4 54 35 84.6 34.9l0.4-0.4 57-57c9.3-9.3 24.3-9.3 33.6 0l85.9 85.9c9.3 9.3 9.3 24.4 0 33.7z'
            // node.symbol = 'diamond'
          }
          else if (node.acct_info_type === 'ID') {
            node.symbol = 'path://M1056 64H96C43 64 0 107 0 160v704c0 53 43 96 96 96h960c53 0 96-43 96-96V160c0-53-43-96-96-96z m0 800H606.4c1.8-9 1.6 7.2 1.6-44.8 0-63.6-60.2-115.2-134.4-115.2-21.6 0-37.4 16-89.6 16-53.8 0-66.8-16-89.6-16-74.2 0-134.4 51.6-134.4 115.2 0 52-0.4 35.8 1.6 44.8H96V288h960v576z m-336-160h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m0-128h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m0-128h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m-336 192c70.6 0 128-57.4 128-128s-57.4-128-128-128-128 57.4-128 128 57.4 128 128 128z'
          }
          else if (node.acct_info_type === 'IP') {
            node.symbol = 'path://M512 64 C264.576 64 64 264.577 64 512 s200.576 448 448 448 448-200.576 448-448 S759.424 64 512 64z M512 896 c-212.078 0-384-171.923-384-384 0-212.077 171.922-384 384-384 212.077 0 384 171.923 384 384 C896 724.077 724.077 896 512 896z M352 256c-17.673 0-32 14.327-32 32l0 448 c0 17.674 14.327 32 32 32 s32-14.326 32-32L384 288 C384 270.327 369.673 256 352 256z M608 256 480 256c-17.673 0-32 14.326-32 32l0 448c0 17.674 14.327 32 32 32s32-14.326 32-32L512 576l96 0c88.366 0 160-71.635 160-160C768 327.634 696.366 256 608 256zM608 512l-96 0L512 320l96 0c53.02 0 96 42.98 96 96S661.02 512 608 512z'
          }
          else if (node.acct_info_type === 'MAC') {
            node.symbol = 'path://M332.799002 686.081014m-332.799002 0a332.799002 332.799002 0 1 0 665.598003 0 332.799002 332.799002 0 1 0-665.598003 0Z M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z M262.655212 399.105875h40.959877l41.471876 114.175657c5.119985 15.103955 9.727971 30.463909 15.103954 45.823863h1.535996c5.119985-15.359954 9.471972-30.719908 14.847955-45.823863l40.959877-114.175657h40.703878v226.047322h-33.2799v-111.871665c0-20.223939 2.815992-49.407852 4.607986-70.143789l-18.175945 51.199846-39.423882 107.775677h-22.015934l-39.679881-107.775677-17.919946-51.199846c1.535995 20.479939 4.351987 49.663851 4.351987 70.143789v111.871665h-34.047898zM622.078134 560.64139h-78.591764l-19.455942 64.511807h-36.095892L563.19831 399.105875h41.215877l75.007775 226.047322H639.99808z m-7.679977-27.903916l-8.959973-30.463909c-7.679977-25.599923-14.335957-49.663851-21.503936-75.263774-6.399981 25.599923-13.567959 51.199846-20.991937 75.263774l-9.215972 30.463909zM692.989921 512.001536c0-73.727779 44.799866-118.015646 102.399693-118.015646a87.039739 87.039739 0 0 1 64.255807 28.671914l-19.455942 22.783932a60.15982 60.15982 0 0 0-44.287867-20.22394c-38.911883 0-66.047802 32.511902-66.047802 85.759743s25.599923 86.52774 65.023805 86.52774a65.791803 65.791803 0 0 0 51.199847-24.063927l18.943943 22.527932a89.087733 89.087733 0 0 1-71.423786 33.2799c-56.83183 0-100.607698-42.495873-100.607698-117.247648z'
          }
          else if (node.acct_info_type === 'HARDWARE') {
            node.symbol = 'path://M722.858667 234.666667a64 64 0 0 1 56.533333 33.984L874.666667 448v256a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V448l95.274667-179.349333A64 64 0 0 1 301.141333 234.666667h421.717334zM810.666667 501.333333H213.333333V704h597.333334v-202.666667zM618.666667 576v64H384v-64h234.666667z m128 0v64h-64v-64h64z m-23.808-277.333333H301.141333l-73.685333 138.666666h569.066667L722.858667 298.666667z'
          }
          else if (node.acct_info_type === 'ADDRESS') {
            node.symbol = 'path://M508.509091 999.563636s-1.163636 0 0 0c-39.563636 0-76.8-22.109091-110.545455-64l-39.563636-48.872727c-54.690909-67.490909-110.545455-137.309091-164.072727-207.127273-61.672727-80.290909-90.763636-161.745455-88.436364-249.018181v-2.327273c0-9.309091 0-17.454545 1.163636-26.763637l2.327273-90.763636 8.145455 17.454546C148.945455 197.818182 242.036364 90.763636 371.2 47.709091c180.363636-60.509091 353.745455-5.818182 465.454545 144.290909 102.4 138.472727 101.236364 337.454545-1.163636 473.6-74.472727 97.745455-152.436364 193.163636-219.927273 274.618182-33.745455 39.563636-69.818182 59.345455-107.054545 59.345454zM165.236364 459.636364c4.654545 64 29.090909 124.509091 74.472727 185.018181 52.363636 69.818182 109.381818 138.472727 162.909091 205.963637l39.563636 50.036363c15.127273 19.781818 39.563636 41.890909 65.163637 41.89091 19.781818 0 40.727273-12.8 62.836363-38.4 67.490909-80.290909 145.454545-175.709091 218.763637-272.29091 87.272727-116.363636 87.272727-286.254545 1.163636-403.781818C693.527273 96.581818 544.581818 51.2 389.818182 102.4 252.509091 148.945455 162.909091 280.436364 165.236364 430.545455v29.090909z M509.672727 573.672727h-5.818182c-39.563636-1.163636-76.8-18.618182-104.727272-48.872727-26.763636-29.090909-40.727273-67.490909-39.563637-108.218182v-2.327273c1.163636-39.563636 17.454545-75.636364 45.381819-102.4 27.927273-26.763636 65.163636-40.727273 104.727272-39.563636h9.309091c81.454545 3.490909 144.290909 73.309091 140.8 154.763636v3.49091c-3.490909 79.127273-69.818182 143.127273-150.109091 143.127272z m-3.490909-244.363636c-23.272727 0-44.218182 8.145455-60.509091 24.436364-17.454545 16.290909-26.763636 38.4-27.927272 61.672727v3.490909c-1.163636 24.436364 8.145455 47.709091 24.436363 66.327273 16.290909 18.618182 39.563636 29.090909 64 29.090909 51.2 2.327273 93.090909-37.236364 95.418182-88.436364v-2.327273c2.327273-50.036364-36.072727-91.927273-84.945455-94.254545H507.345455h-1.163637z'
          }
        }
        // if (!categories.indexOf(categoryName) >= 0) {
        //   categories[categories.length] = categoryName
        // }
        // node.category = categories.indexOf(categoryName)

      }
      for (var i in this.graphData.edges) {
        const edge = this.graphData.edges[i]
        // if (edge.type === 'acct_to_acct') {
        //   edge.value = 100
        // }
        // else {
        //   edge.value = 50
        // }

        edge.lineStyle = {
          emphasis: {
            width: 2,
            color: "white",
            opacity: 1
          }
        }
      }

      var options = {
        showGraph: true,
        title: {
          show: false
        },
        tooltip: {
          show: true,
          triggerOn: 'click',
          enterable: true,
          formatter: function (params) {
            var html = ''
            if (params.dataType === 'node' & params.data.acct_info !== undefined) {
              // html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">查询</button>'
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            }
            else if (params.dataType === 'node' & params.data.acct_info === undefined) {
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">添加到查询</button>'
            }
            else if (params.dataType === 'edge' && params.data.type === 'acct_to_acct') {
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">添加到查询</button>'
              // html += '  <button class="btn-tooltip" onclick="onClickTooktip(\'detail\',\'' + params.dataType + '\',' + params.dataIndex + ')">展开</button>'
              // html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            }
            // else if (params.dataType === 'edge' && params.data.type === 'acct_to_info') {
            //   html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">查询</button>'
            //   // html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            // }
            return html
          }
        },
        legend: [{
          type: 'scroll',
          data: this.graphData.catogories.map(function (a) {
            return a.name
          })
        }],
        animation: false,
        progressive: 100,
        nodeScaleRatio: 0,
        series: [
          {
            type: 'graph',
            id: 'acct-graph',
            name: '关联关系',
            legendHoverLink: false,
            hoverAnimation: false,
            layout: 'force',
            data: this.graphData.nodes,
            edges: this.graphData.edges,
            categories: this.graphData.catogories,
            roam: true,
            lineStyle: {
              normal: {
                color: 'source'
              }
            },
            force: {
              repulsion: 150,
              edgeLength: [50, 100],
              gravity: 0.1,
              friction: 0.5,
              layoutAnimation: true
            },
            draggable: false,
            focusNodeAdjacency: true,
          }
        ]
      }
      return options
    }
  },
  mounted () {
    this.getRespData()
    // 初始化echarts控件

    this.chart = echarts.init(document.getElementById('chart'), 'dark', { renderer: 'canvas' })
    // this.canvas.scale(1, -1)

    let vm = this
    // 这里在组件被挂在时初始化回调函数map，以当前组件key值作为key进行初始化
    toolTipClickCallback[this.chartKey] = function (action, dataType, dataIndex) {
      if (action === 'delete') {
        vm.deleteSeries(dataType, dataIndex)
      }
      else if (action === 'query') {
        vm.querySeries(dataType, dataIndex)
      }
      else if (action === 'detail') {
        vm.detailSeries(dataType, dataIndex)
      }
      document.getElementsByClassName("btn-tooltip")[0].parentElement.style = "display:none"
    }
  },
  watch: {
    // 原程序
    // graphOptions (val) {
    //   this.chart.showLoading({
    //     type: 'default',
    //     default: {
    //       text: 'loading',
    //       color: '#c23531',
    //       textColor: '#000',
    //       maskColor: 'rgba(255, 255, 255, 0.8)',
    //       zlevel: 0
    //     }
    //   })
    //   this.chart.resize()
    //   this.chart.setOption(val)
    //   this.chart.hideLoading()
    // },
    graphData () {
      this.setGraphOptions()
    },
    graphShowDevice (val) {
      if (val) {
        this.acctToInfoGraphData()
      }
      else {
        this.acctToAcctGraphData()
      }
    },
    symbolSize (val) {

      this.setGraphOptions()
    }
  },
  methods: {
    // 从后端获取图形详细数据
    getRespData () {
      queryAcctGraph(this.appId, this.id, this.queryId, this.graphGroup, this.useAcctDefaultGroup).then((resp) => {
        this.respData = resp.data
        this.initGraphData()
      }).catch(function () {
        this.respData = []
      })
    },
    // 设置图例大小
    setSymbolSize () {
      if (this.symbolSize === 'trade') {
        for (var i in this.graphData.nodes) {
          var node = this.graphData.nodes[i]
          if (node.type === 'acct') {
            node.symbolSize = Math.min(Math.log10(node.trade_vol + 100) * 5, 40) + 5
          }
          else {
            node.symbolSize = 20
            console.log(node)
          }
        }
      }
      else {
        for (var i in this.graphData.nodes) {
          var node = this.graphData.nodes[i]
          if (node.type === 'acct') {
            node.symbolSize = Math.min(Math.log2(node.cnt_relate_acct + 2) * 8, 30)
          }
          else {
            node.symbolSize = 20
          }
        }
      }
    },
    // 图形设置
    setGraphOptions () {
      this.setSymbolSize()
      // return this.acctRelationOptions()
      const vm = this

      for (var i in this.graphData.nodes) {
        const node = this.graphData.nodes[i]
        node.itemStyle = {
          emphasis: {
            // color: 'white',
            borderWidth: 3,
            borderColor: 'white',
            opacity: 1
          }
        }

        if (node.type === 'acct') {
          node.symbol = 'circle'
          node.label = {
            normal: {
              show: true,
              position: 'inside',
              formatter: String(node.acct_group),
              color: 'black'
            },
            emphasis: {
              position: 'right',
              formatter: '{b}-{c}',
              color: '#fff'
            }

          }
        }
        else {
          node.label = {
            position: 'right',
            formatter: '{b}'
          }

          if (node.acct_info_type === 'CCRC_ACCT_ID') {
            node.symbol = 'path://M672 320a160 160 0 1 0-160 160 160 160 0 0 0 160-160z m64 0a224 224 0 1 1-224-224 224 224 0 0 1 224 224z M224 832a32 32 0 0 1-64 0 352 352 0 0 1 704 0 32 32 0 0 1-64 0 288 288 0 0 0-576 0z'
          }
          else if (node.acct_info_type === 'MOBILE') {
            node.symbol = 'path://M983.8 312.7C958 251.7 921 197 874 150c-47-47-101.7-84-162.7-109.7C648.2 13.5 581.1 0 512 0S375.8 13.5 312.7 40.3C251.7 66 197 103 150 150c-47 47-84 101.7-109.7 162.7C13.5 375.8 0 442.9 0 512s13.5 136.2 40.3 199.3C66 772.3 103 827 150 874c47 47 101.8 83.9 162.7 109.7 63.1 26.7 130.2 40.3 199.3 40.3s136.2-13.5 199.3-40.3C772.3 958 827 921 874 874c47-47 83.9-101.8 109.7-162.7 26.7-63.1 40.3-130.2 40.3-199.3s-13.5-136.2-40.2-199.3zM717 665.6l-54.8 54.8C566.6 735.1 465.6 705.6 392 632c-73.6-73.6-103.1-174.6-88.4-270.2l54.8-54.8c9.3-9.3 24.3-9.3 33.6 0l86.4 86.4c9.3 9.3 9.3 24.3 0 33.6L421 484.4l-0.4 0.4c0.1 30.3 11.8 60.6 34.9 83.7 23.4 23.4 54 35 84.6 34.9l0.4-0.4 57-57c9.3-9.3 24.3-9.3 33.6 0l85.9 85.9c9.3 9.3 9.3 24.4 0 33.7z'
            // node.symbol = 'diamond'
          }
          else if (node.acct_info_type === 'ID') {
            node.symbol = 'path://M1056 64H96C43 64 0 107 0 160v704c0 53 43 96 96 96h960c53 0 96-43 96-96V160c0-53-43-96-96-96z m0 800H606.4c1.8-9 1.6 7.2 1.6-44.8 0-63.6-60.2-115.2-134.4-115.2-21.6 0-37.4 16-89.6 16-53.8 0-66.8-16-89.6-16-74.2 0-134.4 51.6-134.4 115.2 0 52-0.4 35.8 1.6 44.8H96V288h960v576z m-336-160h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m0-128h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m0-128h224c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H720c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16z m-336 192c70.6 0 128-57.4 128-128s-57.4-128-128-128-128 57.4-128 128 57.4 128 128 128z'
          }
          else if (node.acct_info_type === 'IP') {
            node.symbol = 'path://M512 64 C264.576 64 64 264.577 64 512 s200.576 448 448 448 448-200.576 448-448 S759.424 64 512 64z M512 896 c-212.078 0-384-171.923-384-384 0-212.077 171.922-384 384-384 212.077 0 384 171.923 384 384 C896 724.077 724.077 896 512 896z M352 256c-17.673 0-32 14.327-32 32l0 448 c0 17.674 14.327 32 32 32 s32-14.326 32-32L384 288 C384 270.327 369.673 256 352 256z M608 256 480 256c-17.673 0-32 14.326-32 32l0 448c0 17.674 14.327 32 32 32s32-14.326 32-32L512 576l96 0c88.366 0 160-71.635 160-160C768 327.634 696.366 256 608 256zM608 512l-96 0L512 320l96 0c53.02 0 96 42.98 96 96S661.02 512 608 512z'
          }
          else if (node.acct_info_type === 'MAC') {
            node.symbol = 'path://M332.799002 686.081014m-332.799002 0a332.799002 332.799002 0 1 0 665.598003 0 332.799002 332.799002 0 1 0-665.598003 0Z M883.19735 1024h-639.99808A141.055577 141.055577 0 0 1 102.399693 883.200422v-742.397772A141.055577 141.055577 0 0 1 243.19927 0.003072h516.350451a89.087733 89.087733 0 0 1 63.231811 25.599923l189.695431 189.695431A38.399885 38.399885 0 0 1 1023.996928 243.202342v639.99808a141.055577 141.055577 0 0 1-140.799578 140.799578zM243.19927 76.802842A63.999808 63.999808 0 0 0 179.199462 140.80265v742.397772A63.999808 63.999808 0 0 0 243.19927 947.20023h639.99808a63.999808 63.999808 0 0 0 63.999808-63.999808V259.074295l-179.199462-179.199463a12.799962 12.799962 0 0 0-8.447975-3.07199z M262.655212 399.105875h40.959877l41.471876 114.175657c5.119985 15.103955 9.727971 30.463909 15.103954 45.823863h1.535996c5.119985-15.359954 9.471972-30.719908 14.847955-45.823863l40.959877-114.175657h40.703878v226.047322h-33.2799v-111.871665c0-20.223939 2.815992-49.407852 4.607986-70.143789l-18.175945 51.199846-39.423882 107.775677h-22.015934l-39.679881-107.775677-17.919946-51.199846c1.535995 20.479939 4.351987 49.663851 4.351987 70.143789v111.871665h-34.047898zM622.078134 560.64139h-78.591764l-19.455942 64.511807h-36.095892L563.19831 399.105875h41.215877l75.007775 226.047322H639.99808z m-7.679977-27.903916l-8.959973-30.463909c-7.679977-25.599923-14.335957-49.663851-21.503936-75.263774-6.399981 25.599923-13.567959 51.199846-20.991937 75.263774l-9.215972 30.463909zM692.989921 512.001536c0-73.727779 44.799866-118.015646 102.399693-118.015646a87.039739 87.039739 0 0 1 64.255807 28.671914l-19.455942 22.783932a60.15982 60.15982 0 0 0-44.287867-20.22394c-38.911883 0-66.047802 32.511902-66.047802 85.759743s25.599923 86.52774 65.023805 86.52774a65.791803 65.791803 0 0 0 51.199847-24.063927l18.943943 22.527932a89.087733 89.087733 0 0 1-71.423786 33.2799c-56.83183 0-100.607698-42.495873-100.607698-117.247648z'
          }
          else if (node.acct_info_type === 'HARDWARE') {
            node.symbol = 'path://M722.858667 234.666667a64 64 0 0 1 56.533333 33.984L874.666667 448v256a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V448l95.274667-179.349333A64 64 0 0 1 301.141333 234.666667h421.717334zM810.666667 501.333333H213.333333V704h597.333334v-202.666667zM618.666667 576v64H384v-64h234.666667z m128 0v64h-64v-64h64z m-23.808-277.333333H301.141333l-73.685333 138.666666h569.066667L722.858667 298.666667z'
          }
          else if (node.acct_info_type === 'ADDRESS') {
            node.symbol = 'path://M508.509091 999.563636s-1.163636 0 0 0c-39.563636 0-76.8-22.109091-110.545455-64l-39.563636-48.872727c-54.690909-67.490909-110.545455-137.309091-164.072727-207.127273-61.672727-80.290909-90.763636-161.745455-88.436364-249.018181v-2.327273c0-9.309091 0-17.454545 1.163636-26.763637l2.327273-90.763636 8.145455 17.454546C148.945455 197.818182 242.036364 90.763636 371.2 47.709091c180.363636-60.509091 353.745455-5.818182 465.454545 144.290909 102.4 138.472727 101.236364 337.454545-1.163636 473.6-74.472727 97.745455-152.436364 193.163636-219.927273 274.618182-33.745455 39.563636-69.818182 59.345455-107.054545 59.345454zM165.236364 459.636364c4.654545 64 29.090909 124.509091 74.472727 185.018181 52.363636 69.818182 109.381818 138.472727 162.909091 205.963637l39.563636 50.036363c15.127273 19.781818 39.563636 41.890909 65.163637 41.89091 19.781818 0 40.727273-12.8 62.836363-38.4 67.490909-80.290909 145.454545-175.709091 218.763637-272.29091 87.272727-116.363636 87.272727-286.254545 1.163636-403.781818C693.527273 96.581818 544.581818 51.2 389.818182 102.4 252.509091 148.945455 162.909091 280.436364 165.236364 430.545455v29.090909z M509.672727 573.672727h-5.818182c-39.563636-1.163636-76.8-18.618182-104.727272-48.872727-26.763636-29.090909-40.727273-67.490909-39.563637-108.218182v-2.327273c1.163636-39.563636 17.454545-75.636364 45.381819-102.4 27.927273-26.763636 65.163636-40.727273 104.727272-39.563636h9.309091c81.454545 3.490909 144.290909 73.309091 140.8 154.763636v3.49091c-3.490909 79.127273-69.818182 143.127273-150.109091 143.127272z m-3.490909-244.363636c-23.272727 0-44.218182 8.145455-60.509091 24.436364-17.454545 16.290909-26.763636 38.4-27.927272 61.672727v3.490909c-1.163636 24.436364 8.145455 47.709091 24.436363 66.327273 16.290909 18.618182 39.563636 29.090909 64 29.090909 51.2 2.327273 93.090909-37.236364 95.418182-88.436364v-2.327273c2.327273-50.036364-36.072727-91.927273-84.945455-94.254545H507.345455h-1.163637z'
          }
        }
        // if (!categories.indexOf(categoryName) >= 0) {
        //   categories[categories.length] = categoryName
        // }
        // node.category = categories.indexOf(categoryName)

      }
      for (var i in this.graphData.edges) {
        const edge = this.graphData.edges[i]
        // if (edge.type === 'acct_to_acct') {
        //   edge.value = 100
        // }
        // else {
        //   edge.value = 50
        // }

        edge.lineStyle = {
          emphasis: {
            width: 2,
            color: "white",
            opacity: 1
          }
        }
      }

      var options = {
        showGraph: true,
        title: {
          show: false
        },
        tooltip: {
          show: true,
          triggerOn: 'click',
          enterable: true,
          formatter: function (params) {
            var html = ''
            if (params.dataType === 'node' & params.data.acct_info !== undefined) {
              // html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">查询</button>'
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            }
            else if (params.dataType === 'node' & params.data.acct_info === undefined) {
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">添加到查询</button>'
            }
            else if (params.dataType === 'edge' && params.data.type === 'acct_to_acct') {
              html += '<button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">添加到查询</button>'
              // html += '  <button class="btn-tooltip" onclick="onClickTooktip(\'detail\',\'' + params.dataType + '\',' + params.dataIndex + ')">展开</button>'
              // html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            }
            // else if (params.dataType === 'edge' && params.data.type === 'acct_to_info') {
            //   html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'query\',\'' + params.dataType + '\',' + params.dataIndex + ')">查询</button>'
            //   // html += ' <button class="btn-tooltip" onclick="onClickTooktip(\'delete\',\'' + params.dataType + '\',' + params.dataIndex + ')">删除</button>'
            // }
            return html
          }
        },
        legend: [{
          type: 'scroll',
          data: this.graphData.catogories.map(function (a) {
            return a.name
          })
        }],
        animation: false,
        progressive: 100,
        nodeScaleRatio: 0,
        series: [
          {
            type: 'graph',
            id: 'acct-graph',
            name: '关联关系',
            legendHoverLink: false,
            hoverAnimation: false,
            layout: 'force',
            data: this.graphData.nodes,
            edges: this.graphData.edges,
            categories: this.graphData.catogories,
            roam: true,
            lineStyle: {
              normal: {
                color: 'source'
              }
            },
            force: {
              repulsion: 150,
              edgeLength: [50, 100],
              gravity: 0.1,
              friction: 0.5,
              layoutAnimation: true
            },
            draggable: false,
            focusNodeAdjacency: true,
            // symbolSize: this.setSymbolSize
          }
        ]
      }
      // return options
      this.chart.showLoading({
        type: 'default',
        default: {
          text: 'loading',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        }
      })
      this.chart.resize()
      this.chart.setOption(options)
      this.chart.hideLoading()
    },
    // 账户与账户关联数据
    acctToAcctGraphData () {
      const sourceData = Object.assign({}, this.respData)
      this.graphData = { 'nodes': [], 'edges': [], 'catogories': [] }
      const vm = this
      for (var i in sourceData.catogories) {
        this.graphData.catogories[i] = { 'name': sourceData.catogories[i].name }
      }
      // 账户节点
      if (typeof sourceData.nodes_acct === 'object') {
        for (var i in sourceData.nodes_acct) {
          var node = sourceData.nodes_acct[i]
          node.name = node.acct_id
          node.value = node.acct_name
          // node.fixed = false
          node.x = node.x_random * 700
          node.y = node.y_random * 700
          // node.symbolSize = Math.min(Math.log2(node.cnt_relate_acct + 2) * 8, 30)
          node.type = 'acct'
          node.category = node.acct_group - 1
          this.graphData.nodes.push(node)
        }
      }
      // 账户-账户
      if (typeof sourceData.edges_acct_to_acct === 'object') {
        for (var i in sourceData.edges_acct_to_acct) {
          var edge = sourceData.edges_acct_to_acct[i]
          edge.source = edge.start_acct.acct_id
          edge.target = edge.end_acct.acct_id
          edge.type = 'acct_to_acct'
          edge.value = 100
          this.graphData.edges.push(edge)
          // edge.value = 10 - edge.relation_lvl * 1.5
        }
      }

    },
    // 账户与终端关联数据
    acctToInfoGraphData () {
      const sourceData = Object.assign({}, this.respData)
      this.graphData = { 'nodes': [], 'edges': [], 'catogories': [] }
      const vm = this
      for (var i in sourceData.catogories) {
        this.graphData.catogories[i] = { 'name': sourceData.catogories[i].name }
      }
      // 账户节点
      if (typeof sourceData.nodes_acct === 'object') {
        for (var i in sourceData.nodes_acct) {
          var node = sourceData.nodes_acct[i]
          node.name = node.acct_id
          node.value = node.acct_name
          // node.fixed = false
          node.x = node.x_random * 700
          node.y = node.y_random * 700
          // node.symbolSize = Math.min(Math.log2(node.cnt_relate_acct + 2) * 8, 30)
          node.category = node.acct_group - 1
          node.type = 'acct'
          this.graphData.nodes.push(node)
        }
      }

      // 账户-终端
      if (typeof sourceData.edges_acct_to_info === 'object') {
        for (var i in sourceData.edges_acct_to_info) {
          var edge = sourceData.edges_acct_to_info[i]
          edge.source = edge.acct.acct_id
          edge.target = edge.acct_info.acct_info_type + ':' + edge.acct_info.acct_info
          // edge.value = 1000
          this.graphData.edges.push(edge)
          // edge.value = 10 - edge.relation_lvl * 1.5
        }
      }
      // 终端节点
      if (typeof sourceData.nodes_acct_info === 'object') {
        for (var i in sourceData.nodes_acct_info) {
          var node = sourceData.nodes_acct_info[i]
          node.name = node.acct_info_type + ':' + node.acct_info
          node.value = node.acct_info_type + ':' + node.acct_info
          // node.symbolSize = 20
          node.category = node.acct_group - 1
          node.type = node.acct_info_type
          // node.symbolRotate = 180
          // node.fixed = false
          node.x = node.x_random * 700
          node.y = node.y_random * 700
          this.graphData.nodes.push(node)
        }
      }
    },

    // 初始化图形所用的数据(点、边)
    initGraphData () {
      this.acctToAcctGraphData()
    },

    // 删除图元素
    deleteSeries (dataType, dataIndex) {
      if (dataType === 'node') {
        this.removedNodes.push(this.graphData.nodes.splice(dataIndex, 1)[0])
      }
      else if (dataType === 'edge') {
        this.removedEdges.push(this.graphData.edges.splice(dataIndex, 1)[0])
      }
      console.log(this.removedEdges)
      console.log(this.removedNodes)
      // document.getElementsByClassName("btn-tooltip")[0].parentElement.style = "display:none"
    },
    // 查询图元素
    querySeries (dataType, dataIndex) {
      if (dataType === 'node') {
        if (this.nodeA === '') {
          this.nodeA = this.graphData.nodes[dataIndex].name
        }
        else if (this.nodeB === '' & this.nodeA !== this.graphData.nodes[dataIndex].name) {
          this.nodeB = this.graphData.nodes[dataIndex].name
        }
        else if (this.nodeA !== '' & this.nodeB !== '') {
          this.nodeA = this.graphData.nodes[dataIndex].name
          this.nodeB = ''
        }
      }
      else if (dataType === 'edge') {
        this.nodeA = this.graphData.edges[dataIndex].source
        this.nodeB = this.graphData.edges[dataIndex].target
        // this.queryPath()
      }
    },
    // 展开关联节点
    detailSeries (dataType, dataIndex) {
      let sourceData = Object.assign({}, this.respData)
      let acct_relationship = this.graphData.edges[dataIndex].relationship
      // 显示中间的终端节点
      for (var i in acct_relationship) {
        for (var j in sourceData.nodes_acct_info) {
          if (sourceData.nodes_acct_info[j].acct_info_type === acct_relationship[i].acct_info_type
            & sourceData.nodes_acct_info[j].acct_info === acct_relationship[i].acct_info) {
            var node = sourceData.nodes_acct_info[j]
            node.name = node.acct_info_type + ':' + node.acct_info
            node.value = node.acct_info_type + ':' + node.acct_info
            node.symbolSize = 20
            node.type = node.acct_info_type
            this.graphData.nodes.push(node)
            // this.graphOptions.series[0].data.push(node)
          }
        }
      }
      // 删除账户之间的关联
      this.deleteSeries(dataType, dataIndex)
      // 显示账户与终端之间的关联

    },
    // 显示所有终端节点
    showAcctInfo () {
      this.acctToInfoGraphData()
    },
    // 全选图例
    checkAllLegends () {
      this.isCheckAllLegends = !this.isCheckAllLegends
      if (this.isCheckAllLegends) {
        for (var i in this.graphData.catogories) {
          this.chart.dispatchAction({
            type: 'legendSelect',
            // 图例名称
            name: this.graphData.catogories[i].name
          })
        }
      }
      else {
        for (var i in this.graphData.catogories) {
          this.chart.dispatchAction({
            type: 'legendUnSelect',
            // 图例名称
            name: this.graphData.catogories[i].name
          })
        }
      }
    },
    // 切换tab页
    handleClickTab (tab) {
      this.activeTabName = tab.name
      // this.getAcctRelationData(this.activeTabName)
    },
    // 淡化整张图形
    fadeOut () {
      // 淡化节点和边
      var graph = this.chart._chartsMap['_ec_acct-graph_series.graph'].__model.getData().graph
      for (var i in graph.nodes) {
        var node = graph.nodes[i]
        var el = node.getGraphicEl()
        if (el != undefined) {

          el.downplay && el.downplay()
          el.traverse(function (child) {
            if (!child.isGroup) {
              var opct = child.lineLabelOriginalOpacity
              child.style.opacity = 0.1
            }
          })
        }
      }
      // 使用dispatch无法使边高亮，因此暂时在这里写死，等待修改
      for (var i in graph.edges) {
        var edge = graph.edges[i]
        var el = edge.getGraphicEl()
        if (el != undefined) {
          el.downplay && el.downplay()
          el.traverse(function (child) {
            if (!child.isGroup) {
              var opct = child.lineLabelOriginalOpacity
              child.style.opacity = 0.1
            }
          })
        }
      }
    },
    // 账户A与账户B的关系
    queryPath () {
      const vm = this
      this.queryPathResult = { 'path': '', 'data': { 'data': [], 'columns': [] } }
      if (this.nodeA !== '' & this.nodeB !== '') {
        this.chart.dispatchAction({
          type: 'downplay',
          seriesName: '关联关系',
        })
        // 淡化节点和边
        this.fadeOut()
        // 高亮选中的点
        this.chart.dispatchAction({
          type: 'highlight',
          seriesName: '关联关系',
          name: this.nodeA
        })
        this.chart.dispatchAction({
          type: 'highlight',
          seriesName: '关联关系',
          name: this.nodeB
        })

        queryPath(this.appId, this.id, this.queryId, this.graphGroup, this.nodeA, this.nodeB).then((resp) => {
          this.queryPathResult = resp.data
          // 高亮途径的点
          for (var i in this.queryPathResult.path.nodes) {
            this.chart.dispatchAction({
              type: 'highlight',
              seriesName: '关联关系',
              name: this.queryPathResult.path.nodes[i].acct_id
            })
          }
          // 高亮途径的边
          // 使用dispatch无法使边高亮，因此暂时在这里写死，等待修改
          var graph = this.chart._chartsMap['_ec_acct-graph_series.graph'].__model.getData().graph
          var pathEdeges = new Array
          for (var i in this.queryPathResult.data.data) {
            pathEdeges.push(this.queryPathResult.data.data[i].acct_id_1)
            pathEdeges.push(this.queryPathResult.data.data[i].acct_id_2)
          }
          for (var i in graph.edges) {
            var edge = graph.edges[i]
            var el = edge.getGraphicEl()
            if (pathEdeges.includes(edge.node1.id) && pathEdeges.includes(edge.node2.id)) {
              el.highlight && el.highlight()
            }
          }
        }).catch(function (error) {
          console.log(error)
          // vm.$message.error('查询失败')
        })
      }
    },
    // 清空
    clearQueryPath () {
      this.queryPathResult = { 'path': '', 'data': { 'data': [], 'columns': [] } }
      this.nodeA = ''
      this.nodeB = ''
    },
    // 搜索节点
    handleSearchNode () {
      this.fadeOut()
      this.chart.dispatchAction({
        type: 'downplay',
        seriesName: '关联关系',
      })
      if (this.searchNode === '') {
        return
      }
      var searchIndexes = []
      for (var i in this.graphData.nodes) {
        if (this.graphData.nodes[i].name.search(this.searchNode) >= 0 | this.graphData.nodes[i].value.search(this.searchNode) >= 0) {
          searchIndexes.push(i)
        }
      }
      for (var i in searchIndexes) {
        this.chart.dispatchAction({
          type: 'highlight',
          seriesName: '关联关系',
          dataIndex: searchIndexes[i]
        })
      }
    },

    // 下载关联信息
    downloadRelationInfo () {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['账户代码1', '账户名称1', '账户代码2', '账户名称2', '关联节点类型', '关联节点', '关联级别', '关联描述', '账户1与节点的关系', '账户2与节点的关系']
        const filterVal = ['acct_id_1', 'acct_name_1', 'acct_id_2', 'acct_name_2', 'acct_info_type', 'acct_info', 'relation_lvl', 'describe', 'acct_info_relation1', 'acct_info_relation2']
        const list = this.queryPathResult.data.data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data: data,
          filename: '账户对关联信息.xlsx',
        })
        // this.downloadLoading = false
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    downloadGraph () {
      var img = new Image()
      img.src = this.chart.getDataURL({
        type: 'png'
      })
      var a = document.createElement('a')
      a.download = name || '关联图形'
      a.href = img.src
      a.click()
    }
  }
}
</script>

<style lang="scss" >
.app-main {
  background-color: rgb(240, 243, 244);
  padding: 20px;
  width: 100%;
  height: 100%;
  /* position: absolute; */
  /* display: flex; */
  /* align-items: stretch; */
}
.graph-toolbox {
  display: flex;
  justify-content: space-between;
}
.app-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  background: #ffffff;
}
.app-container-row {
  width: 100%;
  height: 100%;
}
.graph-container {
  flex: 1;
  width: 100%;
  height: 100%;
}
#chart {
  position: relative;
  top: 10px;
  width: 100%;
  height: 95%;
  border: 1px solid #e2e7f2;
}
.card-graph-info {
  width: 100%;
  height: 100%;
  border: none;
}
.card-graph-info > .el-card__header {
  padding: 0px;
  padding-bottom: 20px;
}
.card-graph-info > .el-card__body {
  margin-top: 20px;
  border: 1px solid #e2e7f2;
}
.graph-btn-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.graph-input-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.graph-tooltip {
  position: absolute;
  left: 30px;
  top: 20px;
  z-index: 2;
}
// .acct-relation-info {
//   height: 100%;
//   border: 1px solid #e2e7f2;
// }
</style>
