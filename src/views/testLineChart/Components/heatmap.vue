<template>
    <div class="heatmap" >
      <div style="margin-top:1.7%;margin-left:1.7%;font-family: PingFangSC-Semibold;font-size: 16px;color: #FFFFFF;" >
        减持热力图
        <div style="margin-left:5px;margin-top:10px;width:890px;height:400px;" >
            <div :id="String(index)+'_heatmap'" :class="{'maxBack':item['free_sell_vol_ratio']>=40,
                            'bigBack':item['free_sell_vol_ratio']>=30&&item['free_sell_vol_ratio']<40,
                             'middleBack':item['free_sell_vol_ratio']>=20&&item['free_sell_vol_ratio']<30,
                             'smallBack':item['free_sell_vol_ratio']>=10&&item['free_sell_vol_ratio']<20,
                             'miniBack':item['free_sell_vol_ratio']<10,}" style="float: left;width:178px; height:80px;" v-for="(item,index) in heatdata" >
              <div style="margin-left: 20px;margin-top:16px;" >
                <div style="font-size: 16px;" ><span :id="String(index)+'_sec_name'" >{{item['sec_name']}}</span><span>( </span><span :id="String(index)+'_free_sell_vol_ratio'" >{{Number(item['free_sell_vol_ratio']).toFixed(2)}}</span><span>% )</span> </div>
                <div style="font-size:14px;margin-top: 10px;" >
                  <span  >
                    <span :id="String(index)+'_sec_rf'" :class="{
                      'upred':item['sec_rf']>0,
                      'norm':item['sec_rf']===0,
                      'downgreen':item['sec_rf']<0}">{{Number(item['sec_rf']).toFixed(2)}}%</span>
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>

    </div>
</template>

<script>
  import {queryKcbWeb2heatMap, channel_host} from '@/api/api'
  import { Disappear } from '@/utils/animation'
    export default {
        name: "heatmap",
        data(){
          return{
            heatdata:[]
          }
        },
      created(){
        queryKcbWeb2heatMap().then((response) => {
          this.heatdata = response.data.results;
        }).catch(function (error) { console.log(error);});
        let kcb_ws = new WebSocket(channel_host+"/ws/web/Heatmap/");
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

<style scoped>
  .upred{
    color: #FB192B;
  }
  .downgreen{
    color: #1CC017;
  }
  .norm{
    color: #ffffff;
  }
  .maxBack{
    background: rgba(18,45,106,0.5);
  }
  .bigBack{
    background: rgba(0,68,164,0.5);
  }
  .middleBack{
    background: rgba(0,91,191,0.5);
  }
  .smallBack{
    background: rgba(56,116,219,0.5);
  }
  .miniBack{
    background: rgba(90,141,248,0.5);
  }
</style>
