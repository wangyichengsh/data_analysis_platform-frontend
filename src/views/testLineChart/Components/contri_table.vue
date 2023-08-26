<template>
  <div class="contri_table"  >
    <div style="clear: both;" ></div>
    <div style="color:#ffffff;font-size: 16px;font-family: PingFangSC-Semibold;" >科创50影响点数前三个股</div>
    <div style="margin-top:10px;" >
    <el-table
      :data="tableData"
      size="small"
      border
      highlight-current-row
      :span-method="objectSpanMethod"
      :cell-class-name="cellClassName"
      :header-cell-style="{'background': '#19202F','border-radius': '1px 1px 0 0','font-family': 'PingFangSC-Regular','font-size': '14px','color':'#AEC0E6','padding-right':'3px'}"
      style="background:#0e131a;"
      :cell-style="{'background':'#0e131a','color':'#FFFFFF'}">
      <el-table-column
        :prop="sql_title[i]"
        :align="align_list[i]"
        :label="title" v-for="(title,i) in title_list"
        :width="table_width[i]">
        <template slot-scope="{row,$index}">
          <div v-if="rgColumn.indexOf(sql_title[i])===-1" :class="{'tag':i===0}" :id="'contri_table_'+String($index)+'_'+String(sql_title[i])" >
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
          <div v-else-if="rgColumn.indexOf(sql_title[i])!==-1 && Number(row[sql_title[i]])>=0" :id="'contri_table_'+String($index)+'_'+String(sql_title[i])" style="color: #FB192B;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >%</span>
          </div>
          <div v-else-if="rgColumn.indexOf(sql_title[i])!==-1 && Number(row[sql_title[i]])<0" :id="'contri_table_'+String($index)+'_'+String(sql_title[i])" style="color: #1CC017;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1  && String(row[sql_title[i]])!=='-'" >%</span></div>
          <div v-else :id="'contri_table_'+String($index)+'_'+String(sql_title[i])" style="color: #ffffff;">
            <span v-if="Fix2.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],2)}}</span>
            <span v-else-if="Fix4.indexOf(sql_title[i])!==-1 && String(row[sql_title[i]])!=='-'" >{{fixdata(row[sql_title[i]],4)}}</span>
            <span v-else>{{row[sql_title[i]]}}</span>
            <span v-if="perColumn.indexOf(sql_title[i])!==-1  && String(row[sql_title[i]])!=='-'" >%</span></div>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
  import {queryKcbWeb2simpleTableTwo, channel_host} from '@/api/api'
  import { Disappear } from '@/utils/animation'
    export default {
        name: "contri_table",
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
      created(){
        queryKcbWeb2simpleTableTwo().then((response) => {
          this.tableData = response.data.results;
        }).catch(function (error) { console.log(error);});
        let kcb_ws = new WebSocket(channel_host+"/ws/web/ConTable/");
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
      },
      methods:{
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            if (rowIndex % 3 === 0) {
              return {
                rowspan: 3,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        },
        cellClassName({row, column, rowIndex, columnIndex}){
          if (rowIndex  === 3) {
            return "highlightRow_C";
          }else{
            return "normalRow";
          }
        },
        fixdata(data,n){
          let res = Number(data).toFixed(n);
          return res;
        }
      }
    }
</script>

<style scoped>
  .contri_table > .tag{
    color:#AEC0E6;
    font-size: 14px;
  }
  .highlightRow_C{
    border-top: 2px solid #293753 !important;
  }
</style>
