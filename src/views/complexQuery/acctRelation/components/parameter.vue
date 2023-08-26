<template>
  <div class="parameter-container">
    <div>
      <div class="label label-required">日期</div>
      <el-date-picker
        v-model="value.period"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
      <div class="label label-required">4级-N日内</div>
      <el-input-number
        v-model="value.lvl4_n"
        class="input-num-lvl4-n"
        :min="0"
      />
    </div>

    <div class="input-container">
      <div class="label label-required">账户代码</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.acct_id"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

    <div class="input-container">
      <div class="label">股票代码</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.sec_code"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

    <div class="input-container">
      <div class="label">无效IP</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.ip"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

    <div class="input-container">
      <div class="label">无效MAC</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.mac"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

    <div class="input-container">
      <div class="label">无效联系电话</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.mobile"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

    <div class="input-container">
      <div class="label">无效硬盘序列号</div>
      <div class="input-text-area">
        <el-input
          class="text-input"
          v-model="value.hardware"
          type="textarea"
          rows="5"
        />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Paramter",
  props: ["value"],
  data () {
    return {
      parameter: {
        period: {
          start_date: '',
          end_date: '',
        },
        acct_id: '',
        sec_code: '',
        ip: '',
        mac: '',
        mobile: '',
        hardware: '',
        lvl4_n: 3
      }
    }
  }
}
</script>

<style>
.parameter-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.input-container {
  padding-left: 10px;
  width: 100%;
  height: 100%;
}
.button-container {
  position: relative;
}

.input-num-lvl4-n {
  width: 350px;
}
.input-num-lvl4-n > .el-input {
  width: 350px !important;
}
.text-input > .el-textarea__inner {
  padding: 5px;
  resize: none;
  width: 180px;
}
.input-container {
  width: 190px;
}
.label {
  margin-top: 5px;
  color: #909399;
  font-size: 14px;
  padding-bottom: 5px;
}
.label-required {
  color: black;
  font-weight: bolder;
}
</style>