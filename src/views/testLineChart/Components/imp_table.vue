<template>
  <div class="imp_table"  >
    <div style="clear: both;" ></div>
    <div style="color:#ffffff;font-size: 16px;font-family: PingFangSC-Semibold;" >上证指数影响点数前三的科创板个股</div>
    <div style="margin-top:6px;" >
    <el-table
      :data="tableData"
      size="small"
      border
      highlight-current-row
      :cell-class-name="cellClassName"
      :span-method="objectSpanMethod"
      :header-cell-style="{'background': '#19202F','border-radius': '1px 1px 0 0','font-family': 'PingFangSC-Regular','font-size': '14px','color':'#AEC0E6','padding-right':'3px'}"
      style="background:#0e131a;"
      :cell-style="{'background':'#0e131a','color':'#FFFFFF'}">
      <el-table-column
        :prop="sql_title[i]"
        :align="align_list[i]"
        :label="title" v-for="(title,i) in title_list"
        :width="table_width[i]">
        <template slot-scope="{row,$index}">
          <div v-if="rgColumn.indexOf(sql_title[i])===-1" :class="{'tag':i===0}" :id="'imp_table_'+String($index)+'_'+String(sql_title[i])" >
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
          <div v-else-if="rgColumn.indexOf(sql_title[i])!==-1 && Number(row[sql_title[i]])>=0" :id="'imp_table_'+String($index)+'_'+String(sql_title[i])" style="color: #FB192B;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
          <div v-else-if="rgColumn.indexOf(sql_title[i])!==-1 && Number(row[sql_title[i]])<0" :id="'imp_table_'+String($index)+'_'+String(sql_title[i])" style="color: #1CC017;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
          <div v-else :id="'imp_table_'+String($index)+'_'+String(sql_title[i])" style="color:#fffff;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
  import {queryKcbWeb2simpleTable, channel_host} from '@/api/api'
  import { Disappear } from '@/utils/animation'
    export default {
        name: "imp_table",
        data(){
          return{
            tableData:[],
            title_list: ["","证券简称","涨跌幅","指数影响点数","成交金额(亿元)","减持卖出金额(亿元)","减持卖出占比"],
            table_width:[181,110,96,112,130,150,126],
            align_list:['center','left','right','right','right','right','right'],
            rgColumn:['sec_rf','gxds'],
            perColumn:['sec_rf','free_sell_vol_ratio'],
            Fix2:['sec_rf','trade_amt','free_sell_vol_ratio'],
            Fix4:['gxds','free_sell_amt'],
            sql_title:['gxd_type','sec_name','sec_rf','gxds','trade_amt','free_sell_amt','free_sell_vol_ratio'],
            tableData:[]
          }
        },
      methods:{
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            if (rowIndex % 4 === 3) {
              return {
                rowspan: 1,
                colspan: 1
              };
            }
            else if (rowIndex % 4 === 0) {
              return {
                rowspan: 3,
                colspan: 1
              };
            }else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        },
        cellClassName({row, column, rowIndex, columnIndex}){
          if (rowIndex % 4 === 3) {
            return "highlightRow";
          }else{
            return "normalRow";
          }
        },
        fixdata(data,n){
          let res = Number(data).toFixed(n);
          return res;
        }
      },
      created(){
        queryKcbWeb2simpleTable().then((response) => {
          this.tableData = response.data.results;
          console.log(this.tableData);
        }).catch(function (error) { console.log(error);});
        let kcb_ws = new WebSocket(channel_host+"/ws/web/ImpTable/");
        kcb_ws.onopen = function () {
          console.log('数据刷新已开启');
        };
        kcb_ws.onmessage = function (evt) {
          var received_msg = evt.data;
          var msg = JSON.parse(received_msg)['message'];
          for(let d in msg){
            Disappear(msg[d].id,msg[d].data,msg[d].style);
          }
        };
        kcb_ws.onclose = function () {
          // 关闭 websocket
          console.log("数据刷新已关闭");
        };
      }
    }
</script>

<style>
  .tag{
    color:#AEC0E6;
    font-size: 14px;
  }
  .highlightRow{
    border-bottom:  2px solid #293753 !important;
    border-top: 2px solid #293753 !important;
  }

</style>
