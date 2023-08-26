<template>
  <div class="kcbWeb" style="width:100%;background:url(http://129.211.26.73:8000/static/js/kcbweb2.png)" >
    <div style="margin-left:41%;padding-top: 0.7%;">
        <span style="font-family: PingFangSC-Semibold;font-size: 24px;color: #FFFFFF;" >
          科创板首批股票解禁减持监控
        </span>
    </div>
    <div style="margin-top: 30px;" >
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      size="mini"
      border
      :highlight-current-row="false"
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      :header-cell-style="{'background': '#19202F','border-radius': '1px 1px 0 0','font-family': 'PingFangSC-Regular','font-size': '15px','color':'#AEC0E6','padding-right':'3px'}"
      style="background:#0e131a;"
      :cell-style="{'color':'#FFFFFF','font-size': '18px',}"
      @sort-change="sortList"
      max-height="1010px"
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
            <div v-if="rgColumn.indexOf(dataColumn[index][i])===-1 && rgColumnPrice.indexOf(dataColumn[index][i])===-1 "  style="height:22px;">
              <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                   <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                    <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                    <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else>{{row[dataColumn[index][i]]}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
              </span>
              <span  v-else-if="dataColumn[index][i]==='max_free_sell_amt'" >
                <div>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])">{{(row[dataColumn[index][i]])}}</span>
                  <span> (</span>
                    <span :id="String(row.sec_code)+'_'+'max_acct_name'"  > {{String(row['max_acct_name'])}} </span>
                  <span>)</span>
                </div>
              </span>
              <span v-else>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>

            <div v-if="rgColumn.indexOf(dataColumn[index][i])!==-1 " :class="{'upred':Number(row[dataColumn[index][i]])>0,'norm':Number(row[dataColumn[index][i]])==0,'downgreen':Number(row[dataColumn[index][i]])<0}" style="height:22px;">
               <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                  <span  :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                  <span  :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                  <span  :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else>{{row[dataColumn[index][i]]}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
              </span>
              <span  v-else-if="dataColumn[index][i]==='max_free_sell_amt'" >
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])">{{(row[dataColumn[index][i]])}}</span>
                <span> (</span>
                <span :id="String(row.sec_code)+'_'+'max_acct_name'" > {{row['max_acct_name']}} </span>
                <span>)</span>
              </span>
              <span v-else>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])" v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>

            <div v-if="rgColumnPrice.indexOf(dataColumn[index][i])!==-1 " :class="{'upred':Number(row[rgstand])>0,'norm':Number(row[rgstand])==0,'downgreen':Number(row[rgstand])<0}" style="height:22px;">
               <span v-if="perColumn2.indexOf(dataColumn[index][i])!==-1" >
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
                  <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-else>{{row[dataColumn[index][i]]}}<span v-if="row[dataColumn[index][i]]!=='-'" >%</span></span>
              </span>
              <span  v-else-if="dataColumn[index][i]==='max_free_sell_amt'" >
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])">{{(row[dataColumn[index][i]])}}</span>
                <span> (</span>
                <span :id="String(row.sec_code)+'_'+'max_acct_name'" > {{row['max_acct_name']}} </span>
                <span>)</span>
              </span>
              <span v-else>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-if="Fix2.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],2)}}</span>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-else-if="Fix4.indexOf(dataColumn[index][i])!==-1" >{{fixdata(row[dataColumn[index][i]],4)}}</span>
                <span :id="String(row.sec_code)+'_'+String(dataColumn[index][i])"  v-else>{{row[dataColumn[index][i]]}}</span>
              </span>
            </div>

          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!--<pagination-->
      <!--v-show="totalRecord>0"-->
      <!--:total="totalRecord"-->
      <!--:page.sync="currentPage"-->
      <!--@pagination="showKCBTableData"-->
      <!--:limit.sync="size"-->
    <!--/>-->
    </div>

  </div>
</template>

<script>
    import {queryKcbNewData,channel_host} from '@/api/api'
    import Pagination from "./Components/Pagination"
    import { Disappear } from '@/utils/animation'
    export default {
        name: "kcbWebNew",
      components: { Pagination },
      data () {
          return{
            tableKey:1,
            listLoading:false,
            tableData:[],
            title_all : {'证券信息':['证券代码','证券名称','总市值(亿元)','流通股本(万股)','解禁股数(万股)'],
              '竞价阶段行情信息':['最新价','较前收盘价涨跌幅','较开盘价涨跌幅','最新价对应市盈率','成交金额(亿元)','换手率','上证指数影响点数'],
              '减持监控':['减持金额最大账户(亿元)','减持卖出金额(亿元)','占竞价可卖出量比例','占解禁股数比例','占成交量比例','累计减持卖出占比']},
            title_main:[],
            dataColumn:[['sec_code','sec_name','tot_amt','first_vol','tot_free_vol'],
              ['new_price','curr_sec_rf','open_sec_rf','sy_ratio','trade_amt','nego_rate','sz_gxds'],
              ['max_free_sell_amt','free_sell_amt','free_sell_vol_ratio','free_sell_vol_ratio2','free_sell_vol_ratio3','csum_free_sell_vol_ratio2']
            ],
            perColumn:[],
            perColumn2:['curr_sec_rf','open_sec_rf','nego_rate','free_sell_vol_ratio','free_sell_vol_ratio2','free_sell_vol_ratio3','csum_free_sell_vol_ratio2'],
            Fix2:['tot_amt','first_vol','tot_free_vol','new_price','curr_sec_rf','open_sec_rf','trade_amt','nego_rate','free_sell_vol_ratio','free_sell_vol_ratio2','free_sell_vol_ratio3','csum_free_sell_vol_ratio2'],
            Fix4:['sz_gxds','free_sell_amt'],
            leftAlign:['sec_name','net_buy_amt','net_sell_amt','max_free_sell_amt'],
            rightAlign:['sec_code','tot_amt','first_vol','tot_free_vol','new_price','curr_sec_rf','open_sec_rf','sy_ratio','trade_amt','nego_rate','sz_gxds','first_buy_acct_name','first_sell_acct_name','ccrc_cnt','order_cnt_ratio','rz_buy_amt','rq_sell_vol','free_sell_amt','free_sell_vol_ratio','free_sell_vol_ratio2','free_sell_vol_ratio3','csum_free_sell_vol_ratio2'],
            size:25,
            currentPage:1,
            ordering:"",
            totalRecord:0,
            totalPage:0,
            rgColumn:['curr_sec_rf','open_sec_rf','sz_gxds'],
            rgColumnPrice:['new_price','open_price'],
            rgstand:"curr_sec_rf",
            bottomData:{}
          }
        },
      created(){
          for(let title1 in this.title_all){
            this.title_main.push(title1)
          }
        let kcb_ws = new WebSocket(channel_host+"/ws/web/KcbWebNew/");
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
        queryKcbNewData({'order':this.ordering}).then((response) => {
          this.tableData = response.data.results;
          this.listLoading = false;
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
          queryKcbNewData({'order':this.ordering}).then((response) => {
            this.tableData = response.data.results;
            this.listLoading = false;
          }).catch(function (error) { console.log(error);});
        },
        fixdata(data,n){
          if(data==='-'){return '-';}
          let res = Number(data).toFixed(n);
          return res;
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
        tableRowClassName({row, rowIndex}) {
          if (rowIndex % 2 === 1) {
            return 'odd-row';
          } else if (rowIndex % 2 === 0) {
            return 'even-row';
          }
          return '';
        }
      }
    }
</script>

<style scoped>
  .kcbWeb >>> .upred{
    color: #FB192B;
  }
  .kcbWeb >>> .downgreen{
    color:#1CC017;
  }
  .kcbWeb >>> .norm{
    color:#ffffff;
  }
  .kcbWeb >>> .el-table .odd-row{
    background: #19202F;
  }
  .kcbWeb >>> .el-table .even-row{
    background: #0e131a;
  }
  .kcbWeb >>> .el-table--enable-row-hover .el-table__body tr:hover>td{
    background: #2d3443;
  }
  .kcbWeb >>> .bottom{
   float: left;
   width:16%;
   height:30px;
   border-bottom: 1px solid #EBEEF5;
   color:#909399;
   font-size: 14px;
 }
  .kcbWeb >>> .bottom_row{
    padding-top: 15px;
    padding-left: 15px;
    margin-bottom: 10px;
    height:35px;
  }
  .kcbWeb >>> .el-table__header-wrapper{
   height:108px;
 }
  .kcbWeb >>> .el-table--border:after,.kcbWeb >>> .el-table--group:after,.kcbWeb >>> .el-table:before{
   background: #19202F;
 }
  .kcbWeb >>> .el-table--border,.kcbWeb >>> .el-table--group,.kcbWeb >>> .el-table td,.kcbWeb >>> .el-table th.is-leaf,.kcbWeb >>> .el-table--border td,.kcbWeb >>> .el-table--border th,.kcbWeb >>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border: 1px solid #19202F;
  }
  .kcbWeb >>>.el-table th,.kcbWeb >>> .el-table tr {
   background-color: #19202F;
 }
  .kcbWeb >>> .el-table td.gutter,.kcbWeb >>> .el-table th.gutter{
    background: rgb(25,32,47) !important;
    border-bottom: 1px solid  rgb(25,32,47) !important;
  }
  .kcbWeb >>> .is-center
  {
    border: 1px solid #7c7b7a !important;
  }
  .kcbWeb >>> .is-sortable{
    border-bottom: 1px solid #7c7b7a !important;
  }
  .kcbWeb >>> .el-table_1_column_1_column_6, .kcbWeb >>> .el-table_1_column_7_column_14, .kcbWeb >>> .el-table_1_column_15_column_21{
    border-right: 0.5px solid #7c7b7a !important;
  }
  .kcbWeb >>> .el-table_1_column_1_column_2, .kcbWeb >>> .el-table_1_column_7_column_8,.kcbWeb >>>.el-table_1_column_15_column_16{
    border-left: 0.5px solid #7c7b7a !important;
  }
</style>
