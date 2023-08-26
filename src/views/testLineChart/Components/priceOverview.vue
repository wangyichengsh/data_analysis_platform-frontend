<template>
  <div class="priceOverview" >
    <div style="margin-top:1.7%;margin-left:1.7%;font-family: PingFangSC-Semibold;font-size: 16px;color: #FFFFFF;" >
      行情概况
    </div>

    <!-- 平均涨跌幅 -->
    <div class="dataCard" style="margin-top: 1.4%;margin-left:1.7%;width:160px;height:90px;padding-top: 1.8%;padding-left:5%;" >
      <div style="font-size: 24px; " >
        <span id="avg_sec_rf" :class="{'upred':res['avg_sec_rf']>=0,'downgreen':res['avg_sec_rf']<0}"  >{{Number(res['avg_sec_rf']).toFixed(2)}}%</span>
      </div>
      <div style="font-size: 14px;color: #8A999F;margin-top: 10px;" >
        平均涨跌幅
      </div>
    </div>

    <!-- 涨平跌 -->
    <div class="dataCard" style="margin-top: 1.4%;width:330px;height:90px;padding-top: 1.8%;padding-left:3%;" >
      <div style="float:left;" >
      <div style="font-size: 24px; color: #FB192B;margin-left: 13px;" >
        <span id="rise_sec_num">{{res['rise_sec_num']}}</span>
      </div>
      <div style="margin-left: 20.5px;font-size: 14px;color: #8A999F;margin-top: 10px;" >
        涨
      </div>
      </div>
      <!-- 分割线 -->
      <div class="cardSplit" style="margin-left: 31.68px;" ></div>

      <div style="float:left;margin-left: 31.68px;" >
        <div style="margin-left: 15px;font-size: 24px; color:  #FFFFFF;" >
          <span id="no_sec_num">{{res['no_sec_num']}}</span>
        </div>
        <div style="margin-left: 15px;margin-top: 10px;font-size: 14px;color: #8A999F;" >
          平
        </div>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit" style="margin-left: 50px;" ></div>

      <div style="float:left;margin-left: 31.68px;" >
        <div style="margin-left: 12px;font-size: 24px; color:  #1CC017;" >
          <span id="drop_sec_num">{{res['drop_sec_num']}}</span>
        </div>
        <div style="margin-left: 15px;margin-top: 10px;font-size: 14px;color: #8A999F;" >
          跌
        </div>
      </div>

    </div>

    <!-- 主动买卖比 -->
    <div class="dataCard" style="margin-top: 1.4%;width:160px;height:90px;padding-top: 1.8%;padding-left:4%;" >
      <div style="font-size: 24px;margin-left: 3px;" >
        <span id="active_buy_ratio" style="color: #FB192B;" >{{res['active_buy_ratio']}}</span>
        <span  style="color:#FFFFFF;" >:</span>
        <span id="active_sell_ratio" style=" color:#1CC017;" >{{res['active_sell_ratio']}}</span>
      </div>
      <div style="font-size: 14px;color: #8A999F;margin-top: 10px;" >
        主动买卖比
      </div>
    </div>

    <!-- 竖条状态栏 -->
    <div class="dataCard" style="float:right;margin-right: 20px;margin-top: 1.4%;width:205px;height:400px;" >
      <!-- 涨幅最大个股 -->
      <div style="margin-top: 30px;margin-left: 65px; font-size: 14px;color: #8A999F;" >
        涨幅最大个股
      </div>
      <div style="font-size: 18px;margin-top:10px;margin-left: 37.62px;" >
        <span id="max_sec_name" style="color:#ffffff;" >{{res['max_sec_name']}}</span><span style="color:#ffffff;" >( </span><span id="max_sec_rf" :class="{'upred':res['max_sec_rf']>=0,'downgreen':res['max_sec_rf']<0}" style="font-size: 16px;" >{{Number(res['max_sec_rf']).toFixed(2)}}%</span><span style="color:#ffffff;font-size: 18px;" >）</span>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit_h" style="margin-left: 31.68px;margin-top: 20.52px;" ></div>

      <!-- 涨幅最大个股 -->
      <div style="margin-top: 20px;margin-left: 65px; font-size: 14px;color: #8A999F;" >
        跌幅最大个股
      </div>
      <div style="font-size: 18px;margin-top:10px;margin-left: 37.62px;" >
        <span id="min_sec_name" style="color:#ffffff;" >{{res['min_sec_name']}}</span><span style="color:#ffffff;" >( </span><span id="min_sec_rf" style="color:#1CC017;font-size: 16px;" >{{Number(res['min_sec_rf']).toFixed(2)}}%</span><span style="color:#ffffff;font-size: 18px;" >）</span>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit_h" style="margin-left: 31.68px;margin-top: 20.52px;" ></div>

      <!-- 减持卖出金额最大个股 -->
      <div style="margin-top: 20px;margin-left: 35.64px; font-size: 14px;color: #8A999F;" >
        减持卖出金额最大个股
      </div>
      <div style="font-size: 18px;margin-top:10px;margin-left: 30px;" >
        <span id="max_ctr_sell_sec_name" style="color:#ffffff;" >{{res['max_ctr_sell_sec_name']}}</span><span style="color:#ffffff;" >( </span><span id="max_free_sell_sec" style="color:#ffffff;font-size: 16px;" >{{Number(res['max_free_sell_sec']).toFixed(2)}}</span><span style="color:#ffffff;font-size: 16px;" >亿元</span><span style="color:#ffffff;font-size: 18px;" >）</span>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit_h" style="margin-left: 31.68px;margin-top: 30.52px;" ></div>

      <!-- 减持卖出占比最大个股 -->
      <div style="margin-top: 20px;margin-left: 35.64px; font-size: 14px;color: #8A999F;" >
        减持卖出占比最大个股
      </div>
      <div style="font-size: 18px;margin-top:10px;margin-left: 37.62px;" >
        <span id="max_free_sell_ratio_name" style="color:#ffffff;" >{{res['max_free_sell_ratio_name']}}</span><span style="color:#ffffff;" >( </span><span id="max_free_sell_ratio_sec" style="color:#ffffff;font-size: 16px;" >{{Number(res['max_free_sell_ratio_sec']).toFixed(2)}}</span><span style="color:#ffffff;font-size: 16px;" >%</span><span style="color:#ffffff;font-size: 18px;" >）</span>
      </div>

    </div>

    <!-- 竞价成交金额 -->
    <div class="dataCard" style="margin-left: 15px; width:160px;height:90px;padding-top: 1.8%;padding-left:3%;" >
      <div style="font-size: 24px;margin-left: 30px;" >
        <span id="jj_trade_amt" style="color: #ffffff;margin: 2px;" >{{Number(res['jj_trade_amt']).toFixed(2)}}</span>
      </div>
      <div style="font-size: 14px;color: #8A999F;margin-top: 10px;" >
        竞价成交金额(亿元)
      </div>
    </div>

    <!-- 减持卖出金额 -->
    <div class="dataCard" style="margin-left: 5px;width:160px;height:90px;padding-top: 1.8%;padding-left:3%;" >
      <div style="font-size: 24px;margin-left: 30px;" >
        <span id="free_sell_amt" style="color: #ffb300;margin: 2px;" >{{Number(res['free_sell_amt']).toFixed(2)}}</span>
      </div>
      <div style="font-size: 14px;color: #8A999F;margin-top: 10px;" >
        减持卖出金额(亿元)
      </div>
    </div>

    <!-- 累计减持卖出金额 -->
    <div class="dataCard" style="margin-left: 5px;width:160px;height:90px;padding-top: 1.8%;" >
      <div style="font-size: 24px;margin-left: 50px;" >
        <span id="csum_free_sell_amt" style="color: #ffffff;margin: 2px;" >{{Number(res['csum_free_sell_amt']).toFixed(2)}}</span>
      </div>
      <div style="margin-left: 8px;margin-top: 10px;font-size: 14px;color: #8A999F;" >
        累计减持卖出金额(亿元)
      </div>
    </div>

    <!-- 减持投资者数量 -->
    <div class="dataCard" style="width:160px;height:90px;padding-top: 1.8%;padding-left:3%;" >
      <div style="font-size: 24px;margin-left: 25px;" >
        <span id="ccrc_cnt" style="color: #ffffff;margin: 2px;" >{{Number(res['ccrc_cnt']).toFixed(0)}}</span>
      </div>
      <div style="margin-top: 10px;margin-left: 5px;font-size: 14px;color: #8A999F;" >
        减持投资者数量
      </div>
    </div>

    <!-- 横条状态栏 -->
    <div class="dataCard" style="width:670px;height:120px;margin-left: 12px;padding-top:3%;padding-left:3%;" >

      <!-- 减持卖出占竞价可卖出量的比例 -->
      <div style="float:left;" >
        <div style="margin-left: 30px;width:100px;font-size: 24px;" >
          <span id="free_sell_vol_ratio" style="color: #ffb300;margin: 2px;" >{{Number(res['free_sell_vol_ratio']).toFixed(2)}}</span><span style="color: #ffb300;" >%</span>
        </div>
        <div style="margin-top: 10px;margin-left: 7px;width:114px; font-size: 14px;color: #8A999F;text-align: center;" >
          减持卖出占竞价可卖出量的比例
        </div>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit" style="margin-left: 11px;" ></div>

      <!-- 累计减持卖出占可卖出量的比例 -->
      <div style="float:left;" >
        <div style="margin-left: 53px;width:100px;font-size: 24px;" >
          <span id="csum_free_sell_vol_ratio" style="color: #ffffff;margin: 2px;" >{{Number(res['csum_free_sell_vol_ratio']).toFixed(2)}}</span><span style="color: #ffffff;" >%</span>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;width:114px; font-size: 14px;color: #8A999F;text-align: center;" >
          累计减持卖出占可卖出量的比例
        </div>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit" style="margin-left: 13px;" ></div>

      <!-- 减持卖出占解禁总量的比例 -->
      <div style="float:left;" >
        <div style="margin-left: 53px;width:100px;font-size: 24px;" >
          <span id="free_sell_vol_ratio2" style="color: #ffffff;margin: 2px;" >{{Number(res['free_sell_vol_ratio2']).toFixed(2)}}</span><span style="color: #ffffff;" >%</span>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;width:114px; font-size: 14px;color: #8A999F;text-align: center;" >
          减持卖出占解禁总量的比例
        </div>
      </div>

      <!-- 分割线 -->
      <div class="cardSplit" style="margin-left: 13px;" ></div>

      <!-- 累计减持卖出占解禁总量的比例 -->
      <div style="float:left;" >
        <div style="margin-left: 53px;width:100px;font-size: 24px;" >
          <span id="csum_free_sell_vol_ratio2" style="color: #ffffff;margin: 2px;" >{{Number(res['csum_free_sell_vol_ratio2']).toFixed(2)}}</span><span style="color: #ffffff;" >%</span>
        </div>
        <div style="margin-top: 10px;margin-left: 30px;width:114px; font-size: 14px;color: #8A999F;text-align: center;" >
          累计减持卖出占解禁总量的比例
        </div>
      </div>

    </div>

    <!-- 底部状态栏 -->
    <div class="dataCard" style="width:670px;margin-left: 12px ;height:70px;padding-top: 1.8%;padding-left:3%;" >
      <div v-if="simple===false" >
        <div style="margin-top: 10px;margin-left: 20px;float:left;font-size: 14px;color: #8A999F;" >
          合计影响上证指数
        </div>

        <div style="float: left;margin-top: 5px;margin-left: 20px;width:135px;font-size: 20px;" >
          <span id="sz_gxds_tot" style="color: #ffffff;" >{{fixdata(res['sz_gxds_tot'], 4)}} </span>
        </div>

        <div style="margin-top: 10px;margin-left: 40px;float:left;font-size: 14px;color: #8A999F;" >
          合计影响科创50
        </div>

        <div style="float: left;margin-top: 5px;margin-left: 20px;font-size: 20px;" >
          <span id="kc_gxds_tot" style="color: #ffffff;" >{{fixdata(res['kc_gxds_tot'], 4)}} </span>
        </div>
      </div>
      <div v-else>
        <div style="margin-top: 10px;margin-left: 170px;float:left;font-size: 14px;color: #8A999F;" >
          合计影响上证指数
        </div>

        <div style="float: left;margin-top: 5px;margin-left: 20px;font-size: 20px;" >
          <span  id="sz_gxds_tot" style="color: #ffffff;" >{{fixdata(res['sz_gxds_tot'], 4)}} </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    import {queryKcbWeb2priOver, channel_host} from '@/api/api'
    import { Disappear } from '@/utils/animation'
    export default {
        name: "priceOverview",
      data () {
        return {
          res:{}
        }
      },
      props:["simple"],
      created(){
        queryKcbWeb2priOver().then((response) => {
          this.res = response.data.results;
        }).catch(function (error) { console.log(error);});
        let kcb_ws = new WebSocket(channel_host+"/ws/web/PriceOverView/");
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
        fixdata(data,n){
          if(data==='-'){return '-';};
          if(String(data).indexOf('%')!==-1){return data;}
          let res = Number(data).toFixed(n);
          return res;
        }
      }
    }
</script>

<style scoped>
  .upred{
    color: #FB192B;
  }
  .downgreen{
    color: #1CC017;
  }
  .dataCard{
    float:left;
    margin: 0.5%;
    font-family: PingFangSC-Semibold;
    background: rgba(25,32,47,0.4);
  }
  .cardSplit{
    width:1px;
    height:60px;
    float:left;
    border: 1px solid #FFFFFF;
    opacity: 0.05;
  }
  .cardSplit_h{
    width:150px;
    height:1px;
    border: 1px solid #FFFFFF;
    opacity: 0.05;
  }
</style>
