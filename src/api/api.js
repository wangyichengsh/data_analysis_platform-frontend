import axios from 'axios'


let host = process.env.VUE_APP_HOST;
export const bk_host = process.env.VUE_APP_BK_HOST;
export const file_host = process.env.VUE_APP_FILE_HOST;
export const channel_host = process.env.VUE_APP_CHANNEL_HOST;
export const first_record = process.env.VUE_APP_RECORD_JOB;


export const queryToken2Token = ngsp_token => { return axios.get(`${host}/api/ngsp_token/`, { params: { ngsp_token: ngsp_token } }) };

export const queryHistory = (page, start_time, end_time) => { return axios.get(`${host}/api/history/`, { params: { page: page, start_time: start_time, end_time: end_time } }) };

export const queryUserHistory = (page, start_time, end_time, user) => { return axios.get(`${host}/api/history/`, { params: { page: page, start_time: start_time, end_time: end_time, user: user } }) };

export const login = params => { return axios.post(`${host}/api/api-token-auth/`, params) };

export const passwdchg = params => { return axios.post(`${host}/api/password_change/`, params) };

export const queryUser = params => { return axios.get(`${host}/api/user/`, params) };

export const queryParentDetail = parentId => { return axios.get(`${host}/api/parenttask/`, { params: { id: parentId } }) };

export const queryParentVersion = parentId => { return axios.get(`${host}/api/version/`, { params: { parent_task: parentId } }) };

export const queryVersionId = (parentId, versionId) => { return axios.get(`${host}/api/version/`, { params: { parent_task: parentId, version_id: versionId } }) };

export const queryVersionSeq = (seqId, versionId) => { return axios.get(`${host}/api/version/`, { params: { demand_seq: seqId, version_id: versionId } }) };

export const querySonVersion = sonId => { return axios.get(`${host}/api/version/`, { params: { son_task: sonId } }) };

export const queryTaskList = (page, searchText, status) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, is_valid: true } }) };

export const queryDemand = (page, searchText, status, proiority) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, priority: proiority, is_valid: true } }) };

export const queryDemand_order = (page, searchText, status, proiority, order, all) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, priority: proiority, is_valid: true, ordering: order ,all:all} }) };

export const queryUnDemand = (page, searchText) => { return axios.get(`${host}/api/unfinished/`, { params: { page: page, search: searchText, is_valid: true } }) };

export const queryModelTaskList = (page, searchText) => { return axios.get(`${host}/api/task/`, { params: { page: page, search: searchText, if_model: true, is_valid: true } }) };

export const queryMyTask = (page, searchText, status, creater) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, is_valid: true, create_by: creater } }) };

export const queryMyDemand = (page, searchText, status, proiority, creater) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, priority: proiority, is_valid: true, create_by: creater } }) };

export const queryMyDemand_order = (page, searchText, status, proiority, creater, order, all) => { return axios.get(`${host}/api/parenttask/`, { params: { page: page, search: searchText, status: status, priority: proiority, is_valid: true, create_by: creater, ordering: order, all:all } }) };

export const UpdateParent = (parentId, params) => { return axios.patch(`${host}/api/parenttask/${parentId}/`, params) };

export const UpdateVersion = (versionId, params) => { return axios.patch(`${host}/api/version/${versionId}/`, params) };

export const queryTaskDetail = taskId => { return axios.get(`${host}/api/task/`, { params: { id: taskId } }) };

export const createVersion = (parentId, params) => { return axios.post(`${host}/api/createversion/${parentId}/`, params) };

export const renewVersion = (parentId, params) => { return axios.post(`${host}/api/renewversion/${parentId}/`, params) };

export const deleteVersion = params => { return axios.post(`${host}/api/deleteversion/`, params) };

export const UpdateSon = (sonId, params) => { return axios.patch(`${host}/api/task/${sonId}/`, params) };

export const queryInput = taskId => { return axios.get(`${host}/api/input/`, { params: { task: taskId } }) };

export const createInput = params => { return axios.post(`${host}/api/input/`, params) };

export const UpdateInput = (inputId, params) => { return axios.patch(`${host}/api/input/${inputId}/`, params) };

export const DeleteInput = inputId => { return axios.delete(`${host}/api/input/${inputId}/`) };

export const queryInputDetail = inputId => { return axios.get(`${host}/api/input/`, { params: { id: inputId } }) };

export const queryFileInput = inputId => { return axios.get(`${host}/api/inputfilesheet/`, { params: { input: inputId } }) };

export const createFileTable = params => { return axios.post(`${host}/api/inputfilesheet/`, params) };

export const updateFileInput = (inputId, params) => { return axios.patch(`${host}/api/inputfilesheet/${inputId}/`, params) };

export const queryFileSimple = inputId => { return axios.get(`${host}/api/inputfilesimple/`, { params: { input: inputId } }) };

export const deleteFileInput = inputId => { return axios.delete(`${host}/api/inputfilesheet/${inputId}/`) };

export const createFileColumn = params => { return axios.post(`${host}/api/inputfilecolumn/`, params) };

export const updateFileColumn = (inputId, params) => { return axios.patch(`${host}/api/inputfilecolumn/${inputId}/`, params) };

export const deleteFileColumn = inputId => { return axios.delete(`${host}/api/inputfilecolumn/${inputId}/`) };

export const queryOutput = taskId => { return axios.get(`${host}/api/outputsheet/`, { params: { task: taskId } }) };

export const queryOutputColumn = outputId => { return axios.get(`${host}/api/outputcolumn/`, { params: { id: outputId } }) };

export const changeOutputColumn = (outputId, params) => { return axios.patch(`${host}/api/outputcolumn/${outputId}/`, params) };

export const queryOutputSimple = taskId => { return axios.get(`${host}/api/outputsimple/`, { params: { task: taskId } }) };

export const queryOutputSheet = sheetId => { return axios.get(`${host}/api/outputsimple/`, { params: { id: sheetId } }) };

export const createOutputSheet = params => { return axios.post(`${host}/api/outputsheet/`, params) };

export const deleteOutputSheet = outputId => { return axios.delete(`${host}/api/outputsheet/${outputId}/`) };

export const updateOutput = (outputId, params) => { return axios.patch(`${host}/api/outputsheet/${outputId}/`, params) };

export const renewOutput = (taskId, params) => { return axios.post(`${host}/api/renewoutput/${taskId}/`, params) };

export const createOutputColumn = params => { return axios.post(`${host}/api/outputcolumn/`, params) };

export const updateOutputColumn = (outputId, params) => { return axios.patch(`${host}/api/outputcolumn/${outputId}/`, params) };

export const deleteOutput = outputId => { return axios.delete(`${host}/api/outputcolumn/${outputId}/`) };

export const querySql = taskId => { return axios.get(`${host}/api/sqlcode/`, { params: { task: taskId } }) };

export const ChangeSql = params => { return axios.post(`${host}/api/sqlcode/`, params) };

export const UpdateSql = (sqlId, params) => { return axios.patch(`${host}/api/sqlcode/${sqlId}/`, params) };

export const DeleteSql = sqlId => { return axios.delete(`${host}/api/sqlcode/${sqlId}/`) };

export const queryExec = params => { return axios.get(`${host}/api/execfunc/`, params) };

export const tempSql = (inputId, params) => { return axios.post(`${host}/api/tempsql/${inputId}/`, params) };

export const execSqlTest = (taskId, params) => { return axios.post(`${host}/api/exectest/${taskId}/`, params) };

export const createDemand = params => { return axios.post(`${host}/api/demand/`, params) };

export const Demandquery = (demandId) => { return axios.get(`${host}/api/parenttask/${demandId}/`) };

export const Demandsimplequery = (demandId) => { return axios.get(`${host}/api/parenttasksimple/${demandId}/`) };

export const Filequery = (idList) => { return axios.get(`${host}/api/file/`, { params: { id: idList } }) };

export const SeqFilequery = (seq_id) => { return axios.get(`${host}/api/seqfile/${seq_id}/`) };

export const UpdateDemand = (demandId, params) => { return axios.patch(`${host}/api/parenttask/${demandId}/`, params) };

export const ChgDemandStatus = (demandId, params) => { return axios.post(`${host}/api/demandstatus/${demandId}/`, params) };

export const createTask = params => { return axios.post(`${host}/api/sontask/`, params) };

export const querySonTask = demandId => { return axios.get(`${host}/api/sontask/`, { params: { demand_id: demandId } }) };

export const queryResFile = taskId => { return axios.get(`${host}/api/resfile/`, { params: { task_id: taskId } }) };

export const deleteResFile = fileId => { return axios.delete(`${host}/api/resfile/`, { params: { file_id: fileId } }) };

export const newVersion = params => { return axios.post(`${host}/api/version/`, params) };

export const queryTaskDeve = params => { return axios.get(`${host}/api/taskindeve/`, params) };

export const extDemand = params => { return axios.post(`${host}/api/extdemand/`, params) };

export const markchange = params => { return axios.post(`${host}/api/changehistory/`, params) };

export const querychange = params => { return axios.get(`${host}/api/changehistory/`, params) };

export const createFeed = params => { return axios.post(`${host}/api/feedrecord/`, params) };

export const updateFeed = (feedId, params) => { return axios.patch(`${host}/api/feedrecord/${feedId}/`, params) };

export const getFeedById = feedId => { return axios.get(`${host}/api/feedrecord/`, { params: { id: feedId } }) };

export const hasNewFeed = demandId => { return axios.get(`${host}/api/newfeed/${demandId}/`) };

export const hasNewFeedTask = taskId => { return axios.get(`${host}/api/newfeedtask/${taskId}/`) };

export const getOutputFeed = demandId => { return axios.get(`${host}/api/feedrecord/`, { params: { demind_seq: demandId, model_name: "OutputColumn" } }) };

export const getOutputFeed_unconfirm = demandId => { return axios.get(`${host}/api/feedrecord/`, { params: { demind_seq: demandId, model_name: "OutputColumn", if_feed: false } }) };

export const getDemandFeed = demandId => { return axios.get(`${host}/api/feedrecord/`, { params: { demind_seq: demandId, model_name: "ParentTask" } }) };

export const getDemandFeed_unconfirm = demandId => { return axios.get(`${host}/api/feedrecord/`, { params: { demind_seq: demandId, model_name: "ParentTask", if_feed: false } }) };

export const confirmSonTask = params => { return axios.post(`${host}/api/confirmsontask/`, params) };

export const getDeveQueue_Task = params => { return axios.get(`${host}/api/devequeue/`, { params: { model_name: "Task" } }) };

export const getDeveQueue_ParentTask = params => { return axios.get(`${host}/api/devequeue/`, { params: { model_name: "ParentTask" } }) };

export const addDeveQueue_Task = params => { return axios.post(`${host}/api/devequeue/`, params) };

export const addDeveQueue_ParentTask = params => { return axios.post(`${host}/api/devequeue/`, params) };

export const delDeveQueue = model_name => { return axios.delete(`${host}/api/devequeue/`, { params: { model_name: model_name } }) };

export const queryFeedList = (page, searchText) => { return axios.get(`${host}/api/feedpage/`, { params: { page: page, search: searchText } }) };

export const queryResults = params => { return axios.post(`${host}/api/showres/`, params) };

export const queryOneHistory = (id) => { return axios.get(`${host}/api/history/`, { params: { id: id } }) };

export const queryKcbData = params => { return axios.post(`${host}/api/kcbview/`, params) };

export const queryKcbNewData = params => { return axios.post(`${host}/api/kcbnew/`, params) };

export const queryKcbNewPlusData = params => { return axios.post(`${host}/api/kcbnewplus/`, params) };

export const queryKcbBottomData = params => { return axios.post(`${host}/api/kcbbottom/`, params) };

export const queryKcbWeb2Chart1 = params => { return axios.post(`${host}/api/kcbweb2/index/`, params) };

export const queryKcbWeb2priOver = params => { return axios.post(`${host}/api/kcbweb2/priceoverview/`, params) };

export const queryKcbWeb2heatMap = params => { return axios.post(`${host}/api/kcbweb2/heatmap/`, params) };

export const queryKcbWeb2simpleTable = params => { return axios.post(`${host}/api/kcbweb2/simpletable/`, params) };

export const queryKcbWeb2simpleTableTwo = params => { return axios.post(`${host}/api/kcbweb2/simpletable2/`, params) };
