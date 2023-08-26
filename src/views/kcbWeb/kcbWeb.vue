<template>
  <div class="kcbWeb">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      border
      size="mini"
      :row-class-name="tableRowClassName"
      :header-cell-style="{'background': '#19202F','border-radius': '1px 1px 0 0','font-family': 'PingFangSC-Regular','font-size': '15px','color':'#AEC0E6','padding-right':'3px'}"
      style="background:#0e131a;"
      :cell-style="{'color':'#FFFFFF','font-size': '15px'}"
      @sort-change="sortList"
      max-height="1000px"
    >
      <el-table-column :label="title" align="center"  v-for="(title,index) in title_main" >
        <el-table-column
          :prop="dataColumn[index][i]"
          :label="title2"
          sortable="custom"
          :align="getRowAlign(dataColumn[index][i])"
          :show-overflow-tooltip="true"
          v-for="(title2,i) in title_all[title]"
          >
          <template slot-scope="{row}">
            <div v-if="rgColumn.indexOf(dataColumn[index][i])===-1 && rgColumnPrice.indexOf(dataColumn[index][i])===-1 " :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" style="height:22px;">
              <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(2)}}%
              </span>
              <span v-else-if="perColumn.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(0)}}%
              </span>
              <span v-else>
                <span v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                <span v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                <span v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>

            <div v-if="rgColumn.indexOf(dataColumn[index][i])!==-1 " :class="{'upred':Number(row[dataColumn[index][i]])>=0,'downgreen':Number(row[dataColumn[index][i]])<0}" :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" style="height:22px;">
              <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(2)}}%
              </span>
              <span v-else-if="perColumn.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(0)}}%
              </span>
              <span v-else>
                <span v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                <span v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                <span v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>

            <div v-if="rgColumnPrice.indexOf(dataColumn[index][i])!==-1 " :class="{'upred':Number(row[rgstand])>=0,'downgreen':Number(row[rgstand])<0}" :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" style="height:22px;">
              <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(2)}}%
              </span>
              <span v-else-if="perColumn.indexOf(dataColumn[index][i])!==-1" >
                {{(row[dataColumn[index][i]]*100).toFixed(0)}}%
              </span>
              <span v-else>
                <span v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                <span v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                <span v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="bottom-data" >
      <div class="bottom_border" >
        <div class="bottom_row" >
          <div class="bottom"> <span>累计涨幅最大股票：</span><span id="max_1_bottom" >{{bottomData['max_1']}}</span></div>
          <div class="bottom" > <span>累计涨幅最小股票：</span><span id="min_2_bottom" >{{bottomData['min_2']}}</span></div>
          <div class="bottom" > <span>平均涨跌幅：</span><span id="avg_sec_rf_bottom" >{{(bottomData['avg_sec_rf'] *100).toFixed(2) }}%</span></div>
          <div class="bottom" > <span>平均价格：</span><span id="avge_price_bottom" >{{bottomData['avge_price']}}</span></div>
          <div class="bottom" > <span>平均换手率：</span><span id="avge_nego_rate_bottom" >{{(bottomData['avge_nego_rate'] *100).toFixed(2)}}%</span></div>
          <div class="bottom" > <span>平均市盈率：</span><span id="avge_sy_ratio_bottom" >{{bottomData['avge_sy_ratio']}}</span></div>
        </div>
      </div>
      <div class="bottom_border">
        <div class="bottom_row" >
          <div class="bottom"> <span>参与投资者数量(万): </span><span id="ccrc_id_cnt_total_bottom" >{{bottomData['ccrc_id_cnt_total']}}</span></div>
          <div class="bottom" > <span>竞价阶段成交金额(亿元)：</span><span id="trade_amt_total_bottom" >{{bottomData['trade_amt_total']}}</span></div>
          <div class="bottom" > <span>盘后固定价格成交金额(亿元)：</span><span id="afrter_trade_amt_bottom" >{{bottomData['afrter_trade_amt']}}</span></div>
          <div class="bottom" > <span>融资买入金额(亿元)：</span><span id="total_rz_buy_amt_bottom" >{{bottomData['total_rz_buy_amt']}}</span></div>
          <div class="bottom" > <span>融券卖出量(万股)：</span><span id="total_rq_sell_vol_bottom" >{{bottomData['total_rq_sell_vol']}}</span></div>
          <div class="bottom" > <span>异常交易预警数：</span><span id="cnt_alarm_all_bottom" >{{bottomData['cnt_alarm_all']}}</span></div>
        </div>
      </div>
    </div>
    <pagination
      v-show="totalRecord>0"
      :total="totalRecord"
      :page.sync="currentPage"
      @pagination="showKCBTableData"
      :limit.sync="size"
    />
  </div>
</template>

<script>
    import {queryKcbData, queryKcbBottomData,channel_host} from '@/api/api'
    import Pagination from "./Components/Pagination"
    import { Disappear } from '@/utils/animation'
    export default {
        name: "kcbWeb",
      components: { Pagination },
      data () {
          return{
            tableKey:1,
            listLoading:false,
            tableData:[],
            title_all : {'证券信息':['证券代码','证券名称','发行价','A股流通股本(万股)'],
              '竞价阶段行情信息':['最新价','较前收盘价涨跌幅','开盘价','较开盘价涨跌幅','最新价对应市盈率','成交金额(万元)','换手率'],
              '交易监测信息':['最大净买入账户名称','最大净卖出账户名称','参与交易的一码通数量','市价订单笔数占比','融资买入金额(万元)','融券卖出量(万股)'],
              '监管信息':['异常交易预警次数','书面警示函件数','暂停交易函件数','当日临时停牌次数']},
            title_main:[],
            dataColumn:[['sec_code','sec_name','first_price','first_vol'],
              ['new_price','curr_sec_rf','open_price','open_sec_rf','sy_ratio','trade_amt','nego_rate'],
              ['first_buy_acct_name','first_sell_acct_name','ccrc_cnt','order_cnt_ratio','rz_buy_amt','rq_sell_vol'],
              ['cnt_alarm','cnt_warn','cnt_stop_acct','cnt_stop_sec']
            ],
            perColumn:[],
            perColumn2:['curr_sec_rf','open_sec_rf','nego_rate','order_cnt_ratio'],
            size:25,
            currentPage:1,
            ordering:"",
            totalRecord:0,
            totalPage:0,
            rgColumn:['curr_sec_rf','open_sec_rf'],
            rgColumnPrice:['new_price','open_price'],
            leftAlign:['sec_name','first_buy_acct_name','first_sell_acct_name'],
            Fix2:['first_price','first_vol','new_price','curr_sec_rf','open_price','open_sec_rf','sy_ratio','trade_amt','nego_rate','order_cnt_ratio','rz_buy_amt','rq_sell_vol'],
            Fix4:['net_buy_amt','net_sell_amt','rz_buy_amt','rq_sell_vol','kc_gxds'],
            rightAlign:['sec_code','first_price','first_vol','new_price','curr_sec_rf','open_price','open_sec_rf','sy_ratio','trade_amt','nego_rate','ccrc_cnt','order_cnt_ratio','rz_buy_amt','rq_sell_vol'],
            rgstand:"curr_sec_rf",
            bottomData:{}
          }
        },
      created(){
          for(let title1 in this.title_all){
            this.title_main.push(title1)
          }
        let kcb_ws = new WebSocket(channel_host+"/ws/web/kcbWeb/");
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
          console.log("数据刷新已开启");
        };
        queryKcbData({'size':this.size,'page':this.currentPage,'order':this.ordering}).then((response) => {
          this.tableData = response.data.results;
          this.totalRecord = Number(response.data.count);
          this.totalPage = Math.ceil(this.totalRecord / this.size);
          this.listLoading = false;
        }).catch(function (error) { console.log(error);});
        queryKcbBottomData().then((response) => {
          this.bottomData = response.data.results;
          console.log(this.bottomData);
        }).catch(function (error) { console.log(error);});
      },
      methods:{
        sortList(data){
          const { prop, order } = data
          if (order === 'ascending') {
            this.ordering = '+' + prop
          } else {
            this.ordering = '-' + prop
          }
          this.tableData = [];
          this.currentPage = 1;
          this.showKCBTableData()
        },
        showKCBTableData(){
          this.listLoading = true;
          queryKcbData({'size':this.size,'page':this.currentPage,'order':this.ordering}).then((response) => {
            this.tableData = response.data.results;
            this.totalRecord = Number(response.data.count);
            this.totalPage = Math.ceil(this.totalRecord / this.size);
            this.listLoading = false;
          }).catch(function (error) { console.log(error);});
        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex % 2 === 1) {
            return 'odd-row';
          } else if (rowIndex % 2 === 0) {
            return 'even-row';
          }
          return '';
        },
        getRowAlign(colName){
          if(this.leftAlign.indexOf(colName)!==-1){
            return 'left'
          }
          else if(this.rightAlign.indexOf(colName)!==-1){
            return 'right'
          }else{
            return 'center'
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
  .kcbWeb >>> .upred{
    color: #FB192B;
  }
  .kcbWeb >>> .downgreen{
    color: #1CC017;
  }
  .kcbWeb >>>.el-table .odd-row{
    background-color: #19202F;
  }
  .kcbWeb >>>.el-table .even-row{
    background-color: #0e131a;
  }
  .kcbWeb >>>.el-table--enable-row-hover .el-table__body tr:hover>td{
    background: #2d3443;
  }
  .kcbWeb >>>.el-table__header-wrapper{
    height:100px;
  }
  .kcbWeb >>>.bottom{
   float: left;
   width:16%;
   height:30px;

   color:#ffffff;
   font-size: 14px;
 }
  .kcbWeb >>>.bottom_border{
   border-bottom: 1px solid #EBEEF5;
 }
  .kcbWeb >>>.bottom_row{
    padding-top: 15px;
    padding-left: 15px;
    margin-bottom: 10px;
    height:35px;
  }
  .kcbWeb{
    background-color: #19202F;
  }
  .kcbWeb >>>.is-sortable{
    border-bottom: 1px solid #7c7b7a !important;
  }
  .kcbWeb >>>.el-table_1_column_1,.kcbWeb >>> .el-table_1_column_6,.kcbWeb >>> .el-table_1_column_14,.kcbWeb >>>.el-table_1_column_21{
    border: 0.5px solid #7c7b7a !important;
  }
  .kcbWeb >>>.el-table_1_column_1_column_5,.kcbWeb >>> .el-table_1_column_6_column_13,.kcbWeb >>> .el-table_1_column_14_column_20{
    border-right: 0.5px solid #7c7b7a !important;
  }
  .kcbWeb >>>.el-table_1_column_1_column_2, .kcbWeb >>>.el-table_1_column_6_column_7,.kcbWeb >>> .el-table_1_column_14_column_15{
    border-left: 0.5px solid #7c7b7a !important;
  }
  .kcbWeb >>>.el-table th,.kcbWeb >>> .el-table tr {
    background-color: #19202F;
  }
  .kcbWeb >>>.el-table td.gutter,.kcbWeb >>> .el-table th.gutter{
    background: rgb(25,32,47) !important;
    border-bottom: 1px solid  rgb(25,32,47) !important;
  }
  .kcbWeb >>>.el-table--border,.kcbWeb >>> .el-table--group,.kcbWeb >>> .el-table td,.kcbWeb >>> .el-table th.is-leaf,.kcbWeb >>> .el-table--border td,.kcbWeb >>> .el-table--border th,.kcbWeb >>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border: 1px solid #19202F;
  }
</style>
