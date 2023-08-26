<template>
    <div class="line" style="width:100%;background:url(http://129.211.26.73:8000/static/js/kcbweb2.png)">
      <div style="margin-left:40%;padding-top: 0.7%;">
        <span style="font-family: PingFangSC-Semibold;font-size: 24px;color: #FFFFFF;" >
          科创板首批股票解禁减持监控
        </span>
      </div>
      <div style="margin-top: 35px;">
        <div class="card" style="width:923px;height:475.2px;float:left;" >
          <priceOverview :simple="true" ></priceOverview>
        </div>
        <div style="float:right;margin-right: 47px;" class="card" >
          <div  id="mychart_index" style="height:565px;width:892.5px;" ></div>
        </div>
        <div class="card" style="float:left;margin-left: 1%;margin-top:19px;width:923px;height:483px;" >
          <heatmap></heatmap>
        </div>
        <div style="float:right;margin-right:47px;margin-top: 19px;width:908px;" >
          <imp_table></imp_table>
        </div>
        <div style="height:1005px;"></div>
      </div>



    </div>
</template>

<script>
  // let echarts = require('echarts');
  import {queryKcbWeb2Chart1, channel_host} from '@/api/api';
  import priceOverview from "./Components/priceOverview"
  import contri_table from "./Components/contri_table"
  import imp_table from "./Components/imp_table"
  import heatmap from "./Components/heatmap"
  import * as echarts from 'echarts';
  function showXaxis(index, value) {
    var show_time = ['09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00'];
    if (show_time.includes(value)) {
      return true
    }
    else {
      return false
    }
  }
    export default {
        name: "test-line-chart",
      components: {priceOverview, contri_table,imp_table,heatmap},
      data () {
          return {
            echartIns:undefined,
            echartIns_index:undefined,
            chartData:{
              'lineData':[],
              'barData':[],
              'timeList':[],
              'lastCloseData':0, // 昨收
              'ampliToday':0,
              'curr_trade_vol':0
            },
            chartData_index:{
              'lineData':[],
              'barData':[],
              'timeList':[],
              'lastCloseData':0, // 昨收
              'ampliToday':0,
              'curr_trade_vol':0
            },
            chart:undefined
          }
      },
      methods:{
        drawLineChart(DOMId,data,tit){
          // 获取Dom元素
          let myLine = document.getElementById(DOMId);
          // 初始化echarts
          let echart = echarts.init(myLine, 'light');
          echart.showLoading();
          let options = this.getLatestOpt(data,tit);
          // 绘制echarts
          // echart.clear();
          window.onresize = echart.resize;
          echart.setOption(options, true);
          echart.hideLoading();
          return echart
        },
        initChartData(data){
          data['priceChange'] = data['lineData'][data['lineData'].length-1] - data['lastCloseData']; // 变化
          data['priceChange'] = data['priceChange'].toFixed(2);
          data['rate'] = data['ampliToday'] / data['lastCloseData'] * 100;
          data['rate'] = data['rate'].toFixed(2);
          data['rateChange'] = data['priceChange']/data['lastCloseData'] * 100;
          data['rateChange'] = data['rateChange'].toFixed(2);
          return data
        },
        getTitleColorText(data,standard){
          if(Number(data)>Number(standard)){
            return "{up|"+String(data)+"}"
          }
          else if(Number(data)==Number(standard)){
            return "{equal|"+String(data)+"}"
          }else{
            return "{down|"+String(data)+"}"
          }
        },
        getPerTitleColorText(data,standard){
          if(Number(data)>Number(standard)){
            return "{up|"+String(data)+"%}"
          }
          else if(Number(data)==Number(standard)){
            return "{equal|"+String(data)+"%}"
          }else{
            return "{down|"+String(data)+"%}"
          }
        },
        getLatestOpt(data, tit){
          data = this.initChartData(data);
          let previous;
          let linestyle = {
            color: '#D8D8D8',
            opacity:0.2
          };
          let title = {
            text:" "+String(tit)+"   现价:"+this.getTitleColorText(data['lineData'][data['lineData'].length-1], data["lastCloseData"])+" ( "+this.getTitleColorText((data['lineData'][data['lineData'].length-1]-data["lastCloseData"]).toFixed(2),0)+" , "+this.getPerTitleColorText(data["rateChange"],0)+") 金额:"+String((data["curr_trade_vol"]/100000000).toFixed(2))+'亿' ,
            textStyle:{
              color:"white",
              fontSize: 14,
              fontWeight: 12,
              rich:{
                up:{
                  color: "#FB192B",
                  fontSize: 14
                },
                down:{
                  color: "#1CC017",
                  fontSize: 14
                },
                equal:{
                  color:"white",
                  fontSize: 14
                }
              }
            }
          };
          // 提示窗口
          let tooltip = {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dashed',
                color: '#006cee'
              }
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 35};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj
            }
          };
          //
          let toolbox = {
            top: 20,
            right: 50,
            show:false,
            feature: {
              dataZoom: {
                show: false
              },
              brush: {
                type: ['lineX', 'clear']
              }
            }
          };
          //
          let brush = {
            xAxisIndex: 'all',
            throttleType: 'debounce',
            throttleDelay: 1000,
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(120,140,180,0.1)'
            },
            outOfBrush: {
              colorAlpha: 1
            }
          };
          //
          let grid = [
            {
              left: '70',
              right: '55',
              top: '6%',
              height: '53%',
              containLabel: false
            },
            {
              left: '70',
              right: '55',
              top: '63%',
              height: '27%',
              containLabel: false
            }
          ];
          // x轴
          let xAxis = [
            {
              type: 'category',
              data: data['timeList'],
              boundaryGap: false,
              splitLine: {
                show: true,
                interval: showXaxis,
                lineStyle: linestyle
              },
              axisLine: {show: false},
              axisTick: {show: false},
              axisLabel: {show: false}
            },
            {
              type: 'category',
              gridIndex: 1,
              position: 'bottom',
              data: data['timeList'],
              min: 'dataMin',
              max: 'dataMax',
              boundaryGap: false,
              axisTick: {
                show: true
              },
              splitLine: {
                show: true,
                interval:showXaxis,
                lineStyle: linestyle
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {
                // color: '#7b8fb9',
                color: '#8A999F',
                interval: showXaxis // 横坐标间隔时间
              },
              axisLine: {
                onZero: false,
                lineStyle: linestyle
              }
            },
            {
              type: 'category',
              gridIndex: 0,
              axisLine: {
                onZero: false,
                lineStyle: linestyle
              }
            }
          ];
          // y轴
          let yAxis = [
            //  左轴
            {
              scale: true,
              position: 'left',
              splitNumber: 0,
              splitLine: {
                show: true,
                lineStyle: linestyle
              },
              axisLine: {
                show: true,
                lineStyle: linestyle
              },
              axisLabel: {
                inside: false,
                color:  function (value, index) {
                  if (value == data['lastCloseData']){return 'white'}
                  return value > data['lastCloseData'] ? '#FB192B' : '#1CC017';
                }
              },
                min: (data['lastCloseData'] - data['ampliToday']).toFixed(0), // 最小
                max: (data['lastCloseData'] + data['ampliToday']).toFixed(0) // 最大
            },
            // 左下轴
            {
              type: 'value',
              gridIndex: 1,
              splitNumber: 2,
              splitLine: {show: true,lineStyle: linestyle},
              axisLine: {
                show: true,
                lineStyle: linestyle
              },
              axisLabel: {
                color: 'white',
                inside: false,
                showMaxLabel:false,
                formatter: function (value, index) {
                  if (index === 0) {
                    return 0
                  }
                  return (Number(value) / 100000000).toFixed(0) + '亿'
                },
                showMinLabel: false
              }
            },
            // 右轴
            {
              scale: true,
              position: 'right',
              splitNumber: 1,
              splitLine: {
                show: true,
                lineStyle: linestyle
              },
              axisLine: {
                show: true,
                lineStyle:linestyle
              },
              axisLabel: {
                color:  function (value, index) {
                  if (value == 0){return 'white'}
                  return value > 0 ? '#FB192B' : '#1CC017';
                },
                inside: false,
                formatter: function (value) {
                  return value + '%'
                }
              },
              min: 0 - data['rate'], // 最小
              max: data['rate'] // 最大
            }
          ];
          // 获取系列数据及参数
          let series = [
            {
              name: '最新价',
              type: 'line',
              data: data['lineData'],
              smooth: true,
              lineStyle: {
                normal: {
                  color:'rgb(255, 255, 255)',
                  width:0.8
                }
              },
              areaStyle:{
                normal: {
                  color:new echarts.graphic.LinearGradient(0,0,0,1,
                    [
                      {offset:0,color:'rgba(255, 255, 255, 0.2)'},
                      {offset:1,color:'rgba(255, 255, 255, 0)'},
                    ]
                    ,false),
                }
              }
            },
            {
              name: '成交金额',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data['barData'],
              itemStyle: {
                normal: {
                  color: function (params) {
                    let volumesColor = '';
                    if (params.dataIndex === 0) {
                      if (params.data >= data['lastCloseData']) {
                        // volumesColor = '#1d655f'
                        volumesColor = '#1CC017'
                      } else {
                       // volumesColor = '#782d2d'
                        volumesColor = '#FB192B'
                      }
                    } else {
                      if (previous >= params.data) {
                         // volumesColor = '#1d655f'
                        volumesColor = '#1CC017'
                      } else {
                        // volumesColor = '#782d2d'
                        volumesColor = '#FB192B'
                      }
                    }
                    previous = params.data;
                    return volumesColor
                  }
                }
              }
            }
          ];
          // 获取echarts画图参数
          let options = {
            // animation:false,
            title:title,
            axisPointer: {
              link: {xAxisIndex: 'all'}
            },
            tooltip: tooltip,
            toolbox: toolbox,
            brush: brush,
            grid: grid,
            xAxis: xAxis,
            yAxis: yAxis,
            series: series
          };
          return options
        },
        renewChartData_index(){
          queryKcbWeb2Chart1({'code':'000001'}).then((response) => {
            let newchartData = response.data.results;
            let opt = this.getLatestOpt(newchartData,'上证指数');
            this.echartIns_index.setOption(opt);
          }).catch(function (error) { console.log(error);});
        }
      },
      created (){
      },
      mounted (){
        queryKcbWeb2Chart1({'code':'000001'}).then((response) => {
          this.chartData_index = response.data.results;
          this.echartIns_index =  this.drawLineChart('mychart_index', this.chartData_index,'上证指数');
        }).catch(function (error) { console.log(error);});

        let kcb_ws2 = new WebSocket(channel_host+"/ws/web/KcbLine000001/");
        kcb_ws2.onopen = function () {
          console.log('数据刷新已开启');
        };
        kcb_ws2.onmessage = (evt) => {
          var received_msg = evt.data;
          var msg = JSON.parse(received_msg)['message'];
          this.chartData_index = msg;
          this.echartIns_index =  this.drawLineChart('mychart_index', this.chartData_index,'上证指数');
        };
        kcb_ws2.onclose = function () {
          // 关闭 websocket
          console.log("数据刷新已关闭");
        };
      }
    }
</script>

<style scoped>
  .card{
    border: 1px solid #2B364E;
    border-radius: 2px;
    border-radius: 2px;
    margin-left: 1%;
  }
  .line  >>> .el-table__header-wrapper{
    height:36px;
  }
  .line  >>> .el-table--border:after,.line  >>> .el-table--group:after,.line  >>> .el-table:before{
    background: #19202F;
  }
  .line  >>> .el-table td,.line  >>> .el-table th.is-leaf {
    border: 1px solid #19202F;
  }
  .line  >>>.el-table--border td,.line  >>> .el-table--border th,.line  >>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border: 1px solid #19202F;
  }
  .line  >>> .el-table--border, .line  >>>.el-table--group{
    border: 1px solid #19202F;
  }
  .line  >>>.el-table th, .line  >>>.el-table tr {
    background-color: #19202F;
  }
</style>
