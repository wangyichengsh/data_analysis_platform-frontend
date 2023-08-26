<template>
  <div
    class="demandDetail"
    v-loading="loading"
  >
    <a id="downloadFile"></a>
    <div class="breadcrums">
      <a>{{ title }}</a>
    </div>
    <div class="content">
      <el-steps
        v-if="String(priority)!=='1'"
        :active="stepStatus"
        simple
      >
        <el-step title="waiting"></el-step>
        <el-step title="confirming"></el-step>
        <el-step title="confirmed"></el-step>
        <el-step title="developing"></el-step>
        <el-step title="checking"></el-step>
        <el-step
          title="finished"
          v-if="status!=='cancel'"
        ></el-step>
        <el-step
          title="cancelled"
          v-if="status==='cancel'"
        ></el-step>
      </el-steps>
      <el-steps
        v-if="String(priority)==='1' && status!=='failed' "
        :active="stepStatus"
        simple
      >
        <el-step title="checking"></el-step>
        <el-step title="waiting"></el-step>
        <el-step title="confirming"></el-step>
        <el-step title="confirmed"></el-step>
        <el-step title="developing"></el-step>
        <el-step title="accepting"></el-step>
        <el-step
          title="finished"
          v-if="status!=='cancel'"
        ></el-step>
        <el-step
          title="cancelled"
          v-if="status==='cancel'"
        ></el-step>
      </el-steps>
      <el-steps
        v-if="String(priority)==='1' && status==='failed' "
        :active="stepStatus"
        simple
      >
        <el-step title="check failed"></el-step>
        <el-step title="waiting"></el-step>
        <el-step title="confirming"></el-step>
        <el-step title="confirmed"></el-step>
        <el-step title="developing"></el-step>
        <el-step title="accepting"></el-step>
        <el-step
          title="finished"
          v-if="status!=='cancel'"
        ></el-step>
        <el-step
          title="cancelled"
          v-if="status==='cancel'"
        ></el-step>
      </el-steps>
      <div
        class="param"
        style="height:60px;"
      >
        <label class="paramTitle">Title:</label>
        <el-input
          style="height:25px;"
          type="text"
          v-model="title"
        ></el-input>
        <div
          style="float:right;"
          v-if="create_by==userId"
        >
          <button
            class="default"
            @click="cancelDemand"
            style="float:right ;background-color: red;"
            v-if="status!='cancel'&& status!='finished'"
          >cancel</button>
        </div>
      </div>
      <div class="param">
        <label class="paramTitle">Type:</label>
        <el-select v-model="type">
          <el-option-group
            label="query"
            key="query"
          >
            <el-option
              label="research"
              value="research"
            ></el-option>
            <el-option
              label="routine"
              value="routine"
            ></el-option>
          </el-option-group>
          <el-option-group
            label="file"
            key="file"
          >
            <el-option
              label="inquiry"
              value="inquiry"
            ></el-option>
            <el-option
              label="measure"
              value="measure"
            ></el-option>
          </el-option-group>
        </el-select>
      </div>
      <div class="param">
        <label class="paramTitle">Priority:</label>
        <el-select v-model="priority">
          <el-option
            v-for="i in demandPriority"
            :label="i.value"
            :value="i.key"
          ></el-option>
          <!--<el-option  label="两会专用" value="0"></el-option>-->
          <!--<el-option  label="特急" value="1"></el-option>-->
          <!--<el-option  label="一般" value="2"></el-option>-->
        </el-select>
        <div>
          <span
            style="color:red;"
            v-if="priority==='1'"
          >It will be checked by tech department</span>
        </div>
      </div>
      <div class="param">
        <label class="paramTitle">Description:</label>
        <el-input
          type="textarea"
          row="1"
          v-model="desc"
        ></el-input>
      </div>
      <div class="param">
        <label class="paramTitle">Accessory:</label>
        <el-upload
          class="demandfile"
          ref="demandfile"
          :data="demandType"
          :action="bk_host+'/api/fileupload/'"
          :on-remove="handleDemandRemove"
          multiple
          :auto-upload="true"
          :on-success="addDemandFile"
          :on-preview="showfile"
          :file-list="demandFileList"
        >
          <el-button
            size="small"
            type="primary"
          >choose file</el-button>
        </el-upload>
      </div>
      <div class="param">
        <label class="paramTitle">Accordance:</label>
        <el-input
          type="textarea"
          row="1"
          v-model="reason"
        ></el-input>
      </div>
      <div class="param">
        <label class="paramTitle">Accordance Accessory:</label>
        <el-upload
          class="reasonfile"
          ref="reasonfile"
          :data="reasonType"
          :action="bk_host+'/api/fileupload/'"
          :on-remove="handleReasonRemove"
          multiple
          :auto-upload="true"
          :on-success="addReasonFile"
          :on-preview="showfile"
          :file-list="reasonFileList"
        >
          <el-button
            size="small"
            type="primary"
          >choose file</el-button>
        </el-upload>
      </div>
      <div
        class="param"
        v-if="priority==='1' || priority==='0'"
      >
        <label class="paramTitle">Deadline:</label>
        <input
          type="date"
          v-model="deadline"
        >
      </div>
      <div
        class="param"
        v-if="isStaff!==true"
      >
        <label class="paramTitle">Status:</label>
        <span>{{ DemandstateMap[status] }}</span>
      </div>
      <div
        class="param"
        v-if="isStaff===true"
      >
        <label class="paramTitle">Status:</label>
        <el-select v-model="status">
          <el-option
            disabled
            label="checking"
            value="check"
          ></el-option>
          <el-option
            disabled
            label="waiting"
            value="wait"
          ></el-option>
          <el-option
            label="confirming"
            value="conforming"
          ></el-option>
          <el-option
            disabled
            label="confirmed"
            value="conformed"
          ></el-option>
          <el-option
            label="developing"
            value="developing"
          ></el-option>
          <el-option
            label="accepting"
            value="accepting"
          ></el-option>
          <el-option
            disabled
            label="finished"
            value="finished"
          ></el-option>
          <el-option
            disabled
            label="cancelled"
            value="cancel"
          ></el-option>
        </el-select>
        <button
          class="default"
          style="margin-left: 10px;"
          @click="changeStatus"
        >change status</button>
      </div>
      <div class="submit-row">
        <button
          class="default"
          @click="finishedDemand"
          v-if="status!='cancel'&& status!='finished' && userId==create_by "
        >close</button>
        <button
          class="default"
          v-if="status!='cancel' "
          @click="changeDemand"
        >change</button>
      </div>

      <div class="feed">
        <div class="param">
          <label class="paramTitle">feedback</label>
          <el-button
            size="mini"
            v-if="isStaff"
          >
            <router-link :to="{ name: 'demandFeed',query:{demandId:demandId}}">create feedback</router-link>
          </el-button>
        </div>
        <el-tabs
          type="border-card"
          style="margin-top: 1%;"
        >
          <el-tab-pane label="unresponsive feedback">
            <div>
              <label
                class="paramTitle"
                style="margin:20px;"
              >requirement feedback</label>
              <el-table
                :data="DemandFeed_un"
                style="width: 80%;margin: 20px;"
              >
                <el-table-column
                  prop="id"
                  width="50px"
                  label="ID"
                >
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedtoTime"
                  width="150px"
                  label="create time"
                >
                </el-table-column>
                <el-table-column
                  prop="feedto"
                  label="question"
                >
                </el-table-column>
                <el-table-column
                  :formatter="feedtofinduser"
                  width="80px"
                  label="creator"
                >
                </el-table-column>
                <el-table-column
                  label="operation"
                  width="110"
                >
                  <template slot-scope="scope">
                    <el-button size="mini">
                      <router-link :to="{ name: 'demandFeed',query:{feedId:scope.row.id, demandId:demandId}}">edit</router-link>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <label
                class="paramTitle"
                style="margin:20px;"
              >output field feedback</label>
              <el-table
                :data="OutputFeed_un"
                style="width: 80%;margin: 20px;"
              >
                <el-table-column
                  prop="id"
                  width="50px"
                  label="ID"
                >
                </el-table-column>
                <el-table-column
                  prop="task_name"
                  label="task name"
                >
                </el-table-column>
                <el-table-column
                  prop="table_name"
                  label="table name"
                >
                </el-table-column>
                <el-table-column
                  prop="model_title"
                  label="field name"
                >
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'taskDetail',query:{parentId:demandId, versionId:task2version[scope.row.task_id], task:scope.row.task_id, activeName:scope.row.parent_id}}">{{scope.row.model_title}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedtoTime"
                  width="150px"
                  label="create time"
                >
                </el-table-column>
                <el-table-column
                  prop="feedto"
                  label="question"
                >
                </el-table-column>
                <el-table-column
                  :formatter="feedtofinduser"
                  width="80px"
                  label="creator"
                >
                </el-table-column>
                <el-table-column
                  label="operation"
                  width="110"
                >
                  <template slot-scope="scope">
                    <el-button size="mini">
                      <router-link :to="{ name: 'outputFeed',query:{feedId:scope.row.id, demandId:demandId}}">edit</router-link>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="all">
            <div>
              <label
                class="paramTitle"
                style="margin:20px;"
              >requirement</label>
              <el-table
                :data="DemandFeed"
                style="width: 80%;margin: 20px;"
              >
                <el-table-column
                  prop="id"
                  width="50px"
                  label="ID"
                >
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedtoTime"
                  width="150px"
                  label="create time"
                >
                </el-table-column>
                <el-table-column
                  prop="feedto"
                  label="question"
                >
                </el-table-column>
                <el-table-column
                  :formatter="feedtofinduser"
                  width="80px"
                  label="creator"
                >
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedbackTime"
                  width="150px"
                  label="response time"
                >
                </el-table-column>
                <<el-table-column
                  prop="feedback"
                  label="response"
                >
                  </el-table-column>
                  <el-table-column
                    :formatter="tablefinduser"
                    width="80px"
                    label="respondent"
                  >
                  </el-table-column>
                  <el-table-column
                    label="operation"
                    width="110"
                  >
                    <template slot-scope="scope">
                      <el-button size="mini">
                        <router-link :to="{ name: 'demandFeed',query:{feedId:scope.row.id, demandId:demandId}}">edit</router-link>
                      </el-button>
                    </template>
                  </el-table-column>
              </el-table>
            </div>
            <div>
              <label
                class="paramTitle"
                style="margin:20px;"
              >output field feedback</label>
              <el-table
                :data="OutputFeed"
                style="width: 80%;margin: 20px;"
              >
                <el-table-column
                  prop="id"
                  width="50px"
                  label="ID"
                >
                </el-table-column>
                <el-table-column
                  prop="task_name"
                  label="task name"
                >
                </el-table-column>
                <el-table-column
                  prop="table_name"
                  label="table name"
                >
                </el-table-column>
                <el-table-column
                  prop="model_title"
                  label="field name"
                >
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'taskDetail',query:{parentId:demandId, versionId:task2version[scope.row.task_id], task:scope.row.task_id, activeName:scope.row.parent_id}}">{{scope.row.model_title}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedtoTime"
                  width="150px"
                  label="create time"
                >
                </el-table-column>
                <el-table-column
                  prop="feedto"
                  label="question"
                >
                </el-table-column>
                <el-table-column
                  :formatter="feedtofinduser"
                  width="80px"
                  label="creator"
                >
                </el-table-column>
                <el-table-column
                  prop="feedback"
                  label="response"
                >
                </el-table-column>
                <el-table-column
                  :formatter="formatFeedbackTime"
                  width="150px"
                  label="response time"
                >
                </el-table-column>
                <el-table-column
                  :formatter="tablefinduser"
                  width="80px"
                  label="respondent"
                >
                </el-table-column>
                <el-table-column
                  label="operation"
                  width="110"
                >
                  <template slot-scope="scope">
                    <el-button size="mini">
                      <router-link :to="{ name: 'outputFeed',query:{feedId:scope.row.id, demandId:demandId}}">edit</router-link>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="param">
        <label class="paramTitle">task</label>
        <router-link
          v-if="isStaff===true"
          :to="{ name: 'addTask' ,query:{parentId:demandId}}"
        > <button>create task</button></router-link>
      </div>
      <el-tabs
        type="border-card"
        style="margin-top: 2%;"
      >
        <el-tab-pane label="latest version">
          <div>
            <el-card
              class="box-card"
              shadow="hover"
              v-for="task in versionNewList"
              style="width:20%;float:left;margin:5px 10px 5px 10px"
            >
              <div
                slot="header"
                class="clearfix"
                style="height:30px;"
              >
                <span>{{task.son_name}}</span>
                <router-link
                  style="float:right;"
                  :to="{ name: 'taskDetail' ,query:{parentId:task.parent_task,versionId:task.version_id, task:task.son_task}}"
                >detail</router-link>
              </div>
              <div style="height:70px;">
                <div v-if="task.son_type==='file'">file</div>
                <div
                  v-if="task.son_type==='module'"
                  style="margin-bottom: 10px;"
                >query</div>
                <router-link
                  :to="{ name: 'taskExec',query:{taskId:task.son_task} }"
                  v-if="task.if_exec"
                  style="margin-top: 10px;"
                ><button>query page</button></router-link>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="all">
          <div>
            <el-card
              class="box-card"
              shadow="hover"
              v-for="task in versionList"
              style="width:20%;float:left;margin:5px 10px 5px 10px"
            >
              <div
                slot="header"
                class="clearfix"
                style="height:30px;"
              >
                <span>{{task.son_name}}</span>
                <router-link
                  style="float:right;"
                  :to="{ name: 'taskDetail' ,query:{parentId:task.parent_task,versionId:task.version_id, task:task.son_task}}"
                >detail</router-link>
              </div>
              <div style="height:70px;">
                <div v-if="task.son_type==='file'">file</div>
                <div
                  v-if="task.son_type==='module'"
                  style="margin-bottom: 10px;"
                >query</div>
                <router-link
                  :to="{ name: 'taskExec',query:{taskId:task.son_task} }"
                  v-if="task.if_exec"
                ><button>query page</button></router-link>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="submit-row">
        <button
          class="default"
          v-if="status==='conforming'  && isStaff===false"
          @click="conformedDemand"
        >confirm requirement</button>
        <el-button
          class="default"
          v-if="status!=='conforming'  || isStaff===true"
          disabled
          @click="conformedDemand"
        >confirm requirement</el-button>
      </div>
      <div class="history">
        <div class="param">
          <label class="paramTitle">edit history</label>
        </div>
        <div style="margin-top: 20px;">
          <div
            v-for="change in changeHistory"
            style="margin: 5px;"
          >
            <span>{{date2string(change.change_time)}}，</span>
            <span>由 <strong>{{usermap[change.user]}}</strong></span>
            <span v-if="change.field_name!=='requirment_files'&& change.field_name!=='reason_file' && change.field_name!=='status' && change.field_name!=='priority'">edited <strong>{{mapheader(change.field_name)}}</strong>，
              <div style="background: #fbfbfb;padding:1px 0 1px 30px ;margin: 3px;">
                <span v-html="pagformat(change.new)">{{pagformat(change.new)}}</span>
              </div>
            </span>
            <span v-if="change.field_name==='requirment_files'|| change.field_name==='reason_file'">edited <strong>{{mapheader(change.field_name)}}</strong>，
              <span v-for="f in change.add_remove_file">
                <span v-if="f.startsWith('+')"> created <a :href="fileHistory[f.substr(1)]['url']">{{fileHistory[f.substr(1)]['name']}}</a>;</span>
                <span v-if="f.startsWith('-')"> deleted <a :href="fileHistory[f.substr(1)]['url']">{{fileHistory[f.substr(1)]['name']}}</a>;</span>
              </span>
            </span>
            <span v-if="change.field_name==='status'">edited <strong>{{mapheader(change.field_name)}}</strong>，
              <div style="background: #fbfbfb;padding:1px 0 1px 30px ;margin: 3px;">
                <span>
                  <p>{{DemandstateMap[change.new]}}</p>
                </span>
              </div>
            </span>
            <span v-if="change.field_name==='priority'">edited <strong>{{mapheader(change.field_name)}}</strong>，
              <div style="background: #fbfbfb;padding:1px 0 1px 30px ;margin: 3px;">
                <span>
                  <p>{{mapPriority[change.new]}}</p>
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bk_host, file_host, queryUser, Demandquery, Filequery, UpdateDemand, ChgDemandStatus, createDemand, queryParentVersion, querySonTask, extDemand, markchange, querychange, Demandsimplequery, SeqFilequery, getOutputFeed, getDemandFeed, hasNewFeed, confirmSonTask, getOutputFeed_unconfirm, getDemandFeed_unconfirm } from '../../api/api'
import { getLocalStore, clearLocalStore, setLocalStore } from '@/utils/storageUtil';
import { mapheader, DemandstateMap, mapPriority, demandPriority } from '@/common/common'
import ElButton from "element-ui/packages/button/src/button";
export default {
  components: { ElButton },
  name: "demand-detail",
  data () {
    return {
      bk_host,
      username: getLocalStore('name'),
      userId: "",
      isStaff: false,
      demandId: "",
      seq: "",
      title: "",
      rawtitle: "",
      create_by: "",
      type: "",
      rawtype: "",
      priority: "",
      rawpriority: "",
      desc: "",
      rawdesc: '',
      reason: "",
      rawreason: '',
      deadline: "",
      rawdeadline: '',
      status: "",
      stepStatus: 0,
      rawstatus: "",
      create_time: "",
      demandType: { 'type': 'req_file' },
      reasonType: { 'type': 'req_reason_file' },
      demandFileList: [],
      rawdemandFileList: [],
      demandPostList: [],
      reasonFileList: [],
      rawreasonFileList: [],
      reasonPostList: [],
      versionList: [],
      versionNewList: [],
      usermap: {},
      changeHistory: [],
      fileHistory: {},
      OutputFeed: [],
      OutputFeed_un: [],
      DemandFeed: [],
      DemandFeed_un: [],
      task2version: {},
      allconfirm: false,
      DemandstateMap,
      mapPriority,
      demandPriority,
      loading: false
    }
  },
  created () {
    this.demandId = this.$route.query.demandId;
    Demandsimplequery(this.demandId).then((response) => {
      this.seq = response.data.seq;
      getOutputFeed(this.seq).then((response) => {
        this.OutputFeed = response.data;
      }).catch(function (error) { console.log(error); });
      getDemandFeed(this.seq).then((response) => {
        this.DemandFeed = response.data;
      }).catch(function (error) { console.log(error); });
      getOutputFeed_unconfirm(this.seq).then((response) => {
        this.OutputFeed_un = response.data;
      }).catch(function (error) { console.log(error); });
      getDemandFeed_unconfirm(this.seq).then((response) => {
        this.DemandFeed_un = response.data;
      }).catch(function (error) { console.log(error); });
      SeqFilequery(this.seq).then((response) => {
        var filelist = response.data;
        for (var i in filelist) {
          this.fileHistory[filelist[i].id] = { 'url': file_host + '/' + filelist[i].file_path, 'name': filelist[i].file_name };
        }
      }).catch(function (error) { console.log(error); });
      this.getHistory();
    }).catch(function (error) { console.log(error); });
    queryUser({ params: { username: getLocalStore('name') } }).then((response) => {
      this.isStaff = response.data[0].is_staff;
      this.userId = response.data[0].id;
      if (this.isStaff !== true) {

        if (this.seq === '') {
          setTimeout(this.thisHasNewFeed, 1000);
        } else {
          this.thisHasNewFeed()
        }

      }
    }).catch(function (error) { console.log(error); });
    queryUser().then((response) => {
      for (var user in response.data) {
        this.usermap[response.data[user].id] = response.data[user].full_name;
      }
    }).catch(function (error) { console.log(error); });
    queryParentVersion(this.demandId).then((response) => {
      this.versionList = response.data;
      for (let t in this.versionList) {
        this.task2version[this.versionList[t].son_task] = this.versionList[t].version_id;
      }
    }).catch(function (error) { console.log(error); });
    querySonTask(this.demandId).then((response) => {
      this.versionNewList = response.data;
    }).catch(function (error) { console.log(error); });
    Demandquery(this.demandId).then((response) => {
      this.seq = response.data.seq;
      this.create_by = response.data.create_by;
      this.title = response.data.title;
      this.rawtitle = response.data.title;
      this.type = response.data.type;
      this.rawtype = response.data.type;
      this.priority = String(response.data.priority);
      this.rawpriority = String(response.data.priority);
      this.desc = response.data.desc;
      this.rawdesc = response.data.desc;
      this.reason = response.data.reason;
      this.rawreason = response.data.reason;
      this.deadline = response.data.deadline;
      this.rawdeadline = response.data.deadline;
      this.status = response.data.status;
      this.stepStatus = this.mapStep(this.status);
      this.rawstatus = response.data.status;
      this.create_time = response.data.create_time;
      var requirment_files = response.data.requirment_files;
      if (requirment_files.length > 0) {
        var id = requirment_files.join(',');
        Filequery(id).then((response) => {
          var filelist = response.data;
          for (var i in filelist) {
            this.demandFileList.push({
              'id': filelist[i].id,
              'url': file_host + '/' + filelist[i].file_path,
              'name': filelist[i].file_name
            });
            this.demandPostList.push(filelist[i].id);
            this.rawdemandFileList.push(filelist[i].id);
          }
        }).catch(function (error) { console.log(error); });
      }
      var reason_file = response.data.reason_file;
      if (reason_file.length > 0) {
        var id = reason_file.join(',');
        Filequery(id).then((response) => {
          var filelist = response.data;
          for (var i in filelist) {
            this.reasonFileList.push({ 'id': filelist[i].id, 'url': file_host + '/' + filelist[i].file_path, 'name': filelist[i].file_name });
            this.reasonPostList.push(filelist[i].id);
            this.rawreasonFileList.push(filelist[i].id);
          }
        }).catch(function (error) { console.log(error); });
      }
    }).catch(function (error) { console.log(error); });
  },
  methods: {
    thisHasNewFeed () {
      hasNewFeed(this.seq).then((response) => {
        this.allconfirm = response.data['newfeed'];
        if (response.data['newfeed']) {
          this.$confirm('有问题待反馈!', '提示', {
            confirmButtonText: '确认',
            type: 'warning'
          })
        }
      }).catch(function (error) { console.log(error); });
    },
    formatFeedtoTime (row, column) {
      if (row.feedto_time === null) {
        return ""
      }
      let d = new Date(row.feedto_time);
      let hour = Number(d.getHours());
      if (hour < 10) { hour = '0' + String(hour) }
      let min = Number(d.getMinutes());
      if (min < 10) { min = '0' + String(min) }
      return d.toLocaleDateString() + " " + hour + ":" + min
    },
    formatFeedbackTime (row, column) {
      if (row.feedback_time === null) {
        return ""
      }
      let d = new Date(row.feedback_time);
      let hour = Number(d.getHours());
      if (hour < 10) { hour = '0' + String(hour) }
      let min = Number(d.getMinutes());
      if (min < 10) { min = '0' + String(min) }
      return d.toLocaleDateString() + " " + hour + ":" + min
    },
    date2string (d) {
      let da = d.split('.');
      return da[0];
    },
    tablefinduser (row, column) {
      let user_id = row.feedback_user;
      return this.usermap[user_id]
    },
    feedtofinduser (row, column) {
      let user_id = row.feedto_user;
      return this.usermap[user_id]
    },
    mapStep (stat) {
      var res;
      if (stat === 'wait') {
        res = 0;
      }
      else if (stat === 'conforming') {
        res = 1;
      }
      else if (stat === 'conformed') {
        res = 2;
      }
      else if (stat === 'developing') {
        res = 3;
      }
      else if (stat === 'accepting') {
        res = 4;
      }
      else if (stat === 'finished') {
        res = 5;
      }
      else if (stat === 'cancel') {
        res = 5;
      }
      else if (stat === 'check' || stat === 'failed') {
        res = -1;
      }
      if (String(this.priority) === '1') {
        res = res + 1
      }
      return res
    },
    mapheader,
    pagformat (p) {
      let res = '';
      let p_l = p.split('\n');
      for (let i in p_l) {
        res += '<p>' + p_l[i] + '</p>';
      }
      return res
    },
    handleDemandRemove (file, fileList) {
      if (file.hasOwnProperty('id')) {
        var id = file.id;
      }
      else {
        var id = file.response.id;
      }
      var ind = this.demandPostList.indexOf(id);
      this.demandPostList.splice(ind, ind + 1);
    },
    handleReasonRemove (file, fileList) {
      if (file.hasOwnProperty('id')) {
        var id = file.id;
      }
      else {
        var id = file.response.id;
      }
      var ind = this.reasonPostList.indexOf(id);
      this.reasonPostList.splice(ind, ind + 1);
    },
    addDemandFile (response, file, fileList) {
      this.demandPostList.push(response.id);
    },
    addReasonFile (response, file, fileList) {
      this.reasonPostList.push(response.id);
    },
    showfile (file) {
      var downloadFile = document.getElementById('downloadFile');
      if (file.hasOwnProperty('response')) {
        downloadFile.setAttribute('href', file_host + '/' + file.response.path);
        downloadFile.setAttribute('download', file.response.raw_name);
        downloadFile.click()
      }
      if (file.hasOwnProperty('url')) {
        downloadFile.setAttribute('href', file.url);
        downloadFile.setAttribute('download', file.name);
        downloadFile.click()
      }
    },
    changeStatus () {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      var param = {
        'status': this.status
      };
      if (this.status !== this.rawstatus) {
        let params = {
          'user': this.userId,
          'model_name': 'ParentTask',
          'change_id': this.seq,
        };
        params['field_name'] = 'status';
        params['old'] = this.rawstatus;
        params['new'] = this.status;
        markchange(params).then((response) => {
          if (response.status == 201) {
            this.$message({
              type: 'info',
              message: '更新成功'
            });
          }
          else { console.log(response); }
        }).catch(function (error) { console.log(error); });
        ChgDemandStatus(this.demandId, param).then((response) => {
          if (response.status == 200) {
            console.log(response);
            location.reload();          }
          else { console.log(response); }
        }).catch(function (error) { console.log(error); });
      }
    },
    cancelDemand () {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      this.$confirm('取消该需求?', '提示', {
        confirmButtonText: '确认取消',
        cancelButtonText: '不要取消',
        type: 'warning'
      }).then(() => {
        var d = new Date();
        var param = {
          'status': 'cancel',
          'canceled_time': d.toJSON(),
          'canceled_by': this.userId
        };
        if ('cancel' !== this.rawstatus) {
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': this.seq,
          };
          params['field_name'] = 'status';
          params['old'] = this.rawstatus;
          params['new'] = 'cancel';
          markchange(params).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          ChgDemandStatus(this.demandId, param).then((response) => {
            if (response.status == 200) { location.reload(); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未取消'
        });
      });
    },
    finishedDemand () {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      this.$confirm('该需求已完成?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '并没有',
        type: 'warning'
      }).then(() => {
        let d = new Date();
        let param = {
          'status': 'finished',
          'closed_time': d.toJSON(),
        };
        if ('finished' !== this.rawstatus) {
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': this.seq,
          };
          params['field_name'] = 'status';
          params['old'] = this.rawstatus;
          params['new'] = 'finished';
          markchange(params).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          ChgDemandStatus(this.demandId, param).then((response) => {
            if (response.status == 200) { location.reload(); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未完成'
        });
      });
    },
    conformedDemand () {
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      if (this.allconfirm) {
        this.$message({
          type: 'info',
          message: '有反馈未填写！'
        });
        return;
      }
      this.$confirm('需求细节及反馈已确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '并没有',
        type: 'warning'
      }).then(() => {
        let d = new Date();
        let param = {
          'status': 'conformed',
          'confirm_time': d.toJSON(),
          'confirm_by': this.userId
        };
        if ('conforming' === this.rawstatus) {
          let params = {
            'user': this.userId,
            'model_name': 'ParentTask',
            'change_id': this.seq,
          };
          params['field_name'] = 'status';
          params['old'] = this.rawstatus;
          params['new'] = 'conformed';
          markchange(params).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          ChgDemandStatus(this.demandId, param).then((response) => {
            if (response.status == 200) { location.reload(); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
          let confirm_param = { 'demand_id': this.demandId };
          confirmSonTask(confirm_param).then((response) => {
            if (response.status == 200) { console.log(response.data); }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未确认'
        });
      });
    },
    getHistory () {
      querychange({ params: { model_name: 'ParentTask', change_id: this.seq } }).then((response) => {
        this.changeHistory = response.data;
      }).catch(function (error) { console.log(error); });
    },
    changeDemand () {
      this.loading = true;
      if (getLocalStore('name') === null) {
        this.$message({
          type: 'info',
          message: '登入过期'
        });
        this.$router.push({ name: 'login' });
      }
      this.$confirm('变更该需求?', '提示', {
        confirmButtonText: '确认变更',
        cancelButtonText: '不要变更',
        type: 'warning'
      }).then(() => {
        //生成更新json
        let c_params = {
          'title': this.title,
          'seq': this.seq,
          'type': this.type,
          'priority': this.priority,
          'desc': this.desc,
          'requirment_files': this.demandPostList,
          'reason': this.reason,
          'reason_file': this.reasonPostList,
          'create_by': this.create_by
        };
        if (this.status === 'failed') {
          c_params['status'] = 'check';
        }
        if (this.status === 'failed' && String(this.priority) !== '1') {
          c_params['status'] = 'wait';
        }
        if (String(this.priority) === '1') {
          if (String(this.deadline).length === 0 || String(this.deadline) === 'null') {
            this.$message({
              type: 'info',
              message: '截止时间不能为空'
            });
            return;
          }
          c_params['deadline'] = this.deadline;
          if (this.priority !== this.rawpriority) {
            c_params['status'] = 'check';
          }
        }
        //检查是否有参数变化
        let change = false;
        let params = {
          'user': this.userId,
          'model_name': 'ParentTask',
          'change_id': this.seq,
        };
        if (this.title !== this.rawtitle) {
          change = true;
          let params_title = JSON.parse(JSON.stringify(params));
          params_title['field_name'] = 'title';
          params_title['old'] = this.rawtitle;
          params_title['new'] = this.title;
          markchange(params_title).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        if (this.type !== this.rawtype) {
          change = true;
          let params_type = JSON.parse(JSON.stringify(params));
          params_type['field_name'] = 'type';
          params_type['old'] = this.rawtype;
          params_type['new'] = this.type;
          markchange(params_type).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        if (this.priority !== this.rawpriority) {
          change = true;
          let params_priority = JSON.parse(JSON.stringify(params));
          params_priority['field_name'] = 'priority';
          params_priority['old'] = this.rawpriority;
          params_priority['new'] = this.priority;
          markchange(params_priority).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        if (this.desc !== this.rawdesc) {
          change = true;
          let params_desc = JSON.parse(JSON.stringify(params));
          params_desc['field_name'] = 'desc';
          params_desc['old'] = this.rawdesc;
          params_desc['new'] = this.desc;
          markchange(params_desc).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        if (this.reason !== this.rawreason) {
          change = true;
          let params_reason = JSON.parse(JSON.stringify(params));
          params_reason['field_name'] = 'reason';
          params_reason['old'] = this.rawreason;
          params_reason['new'] = this.reason;
          markchange(params_reason).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        if (this.deadline !== this.rawdeadline) {
          change = true;
          let params_deadline = JSON.parse(JSON.stringify(params));
          params_deadline['field_name'] = 'deadline';
          params_deadline['old'] = this.rawdeadline;
          params_deadline['new'] = this.deadline;
          markchange(params_deadline).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        let demandFileString = this.demandPostList.join(',');
        let rawdemandFileString = this.rawdemandFileList.join(',');
        if (demandFileString !== rawdemandFileString) {
          change = true;
          let params_demandFileString = JSON.parse(JSON.stringify(params));
          params_demandFileString['field_name'] = 'requirment_files';
          params_demandFileString['old'] = rawdemandFileString;
          params_demandFileString['new'] = demandFileString;
          markchange(params_demandFileString).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }
        let reasonFileString = this.reasonPostList.join(',');
        let rawreasonFileString = this.rawreasonFileList.join(',');
        if (reasonFileString !== rawreasonFileString) {
          change = true;
          let params_reasonFileString = JSON.parse(JSON.stringify(params));
          params_reasonFileString['field_name'] = 'reason_file';
          params_reasonFileString['old'] = rawreasonFileString;
          params_reasonFileString['new'] = reasonFileString;
          markchange(params_reasonFileString).then((response) => {
            if (response.status == 201) { }
            else { console.log(response); }
          }).catch(function (error) { console.log(error); });
        }

        //若变化则更新状态
        if (change === true) {
          if (this.status === 'wait' || this.status === 'conforming' || this.status === 'conformed' || this.status === 'check' || this.status === 'failed') {
            UpdateDemand(this.demandId, c_params).then((response) => {
              if (response.status === 200) {
                this.$router.push({ name: 'taskList' });
              }
              else { console.log(response); }
            }).catch(function (error) { console.log(error); });
          }
          else if (this.status === 'finished') {
            createDemand(c_params).then((response) => {
              var status = response.data.status;
              if (status !== 'success') { alert(response.data.msg); }
              else {
                var copy_to = response.data.id;
                var param = { 'copyFrom': this.demandId, 'copyTo': copy_to };
                extDemand(param).then((response) => {
                  var status = response.data.status;
                  if (status !== 'success') { alert(response.data.msg); }
                  else { this.$router.push({ name: 'taskList' }); }
                }).catch(function (error) { console.log(error); });
              }
            }).catch(function (error) { console.log(error); });
          }
          else {
            var unvalid = { 'is_valid': false };
            UpdateDemand(this.demandId, unvalid).then((response) => {
              if (response.status === 200) {
                createDemand(c_params).then((response) => {
                  var status = response.data.status;
                  if (status !== 'success') {
                    alert(response.data.msg);
                  }
                  else {
                    var copy_to = response.data.id;
                    var param = { 'copyFrom': this.demandId, 'copyTo': copy_to };
                    extDemand(param).then((response) => {
                      var status = response.data.status;
                      if (status !== 'success') { alert(response.data.msg); }
                      else { this.$router.push({ name: 'taskList' }); }
                    }).catch(function (error) { console.log(error); });
                  }
                }).catch(function (error) { console.log(error); });
              }
              else { console.log(response); }
            }).catch(function (error) { console.log(error); });
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '未变更'
        });
      });
    }
  }
}
</script>

<style scoped>
.el-textarea {
  width: 50%;
}
</style>
