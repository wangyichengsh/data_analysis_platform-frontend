import request from '@/utils/request'

export const queryToken2Token = ngsp_token => { return request.get(`api/ngsp_token/`, { params: { ngsp_token: ngsp_token }}) }

export const queryHistory = page => { return request.get(`api/history/`, { params: { page: page }}) }

export const login = params => { return request.post(`api/api-token-auth/`, params) }

export const passwdchg = params => { return request.post(`api/password_change/`, params) }

export const queryUser = params => { return request.get(`api/user/`, params) }

export const queryParentDetail = parentId => { return request.get(`api/parenttask/`, { params: { id: parentId }}) }

export const queryParentVersion = parentId => { return request.get(`api/version/`, { params: { parent_task: parentId }}) }

export const queryVersionId = (parentId, versionId) => { return request.get(`api/version/`, { params: { parent_task: parentId, version_id: versionId }}) }

export const queryVersionSeq = (seqId, versionId) => { return request.get(`api/version/`, { params: { demand_seq: seqId, version_id: versionId }}) }

export const querySonVersion = sonId => { return request.get(`api/version/`, { params: { son_task: sonId }}) }

export const queryTaskList = (page, searchText, status) => { return request.get(`api/parenttask/`, { params: { page: page, search: searchText, status: status, is_valid: true }}) }

export const queryModelTaskList = (page, searchText) => { return request.get(`api/task/`, { params: { page: page, search: searchText, if_model: true, is_valid: true }}) }

export const queryMyTask = (page, searchText, status, creater) => { return request.get(`api/parenttask/`, { params: { page: page, search: searchText, status: status, is_valid: true, create_by: creater }}) }

export const UpdateParent = (parentId, params) => { return request.patch(`api/parenttask/${parentId}/`, params) }

export const UpdateVersion = (versionId, params) => { return request.patch(`api/version/${versionId}/`, params) }

export const queryTaskDetail = taskId => { return request.get(`api/task/`, { params: { id: taskId }}) }

export const createVersion = (parentId, params) => { return request.post(`api/createversion/${parentId}/`, params) }

export const renewVersion = (parentId, params) => { return request.post(`api/renewversion/${parentId}/`, params) }

export const deleteVersion = params => { return request.post(`api/deleteversion/`, params) }

export const UpdateSon = (sonId, params) => { return request.patch(`api/task/${sonId}/`, params) }

export const queryInput = taskId => { return request.get(`api/input/`, { params: { task: taskId }}) }

export const createInput = params => { return request.post(`api/input/`, params) }

export const UpdateInput = (inputId, params) => { return request.patch(`api/input/${inputId}/`, params) }

export const DeleteInput = inputId => { return request.delete(`api/input/${inputId}/`) }

export const queryInputDetail = inputId => { return request.get(`api/input/`, { params: { id: inputId }}) }

export const queryFileInput = inputId => { return request.get(`api/inputfilesheet/`, { params: { input: inputId }}) }

export const createFileTable = params => { return request.post(`api/inputfilesheet/`, params) }

export const updateFileInput = (inputId, params) => { return request.patch(`api/inputfilesheet/${inputId}/`, params) }

export const queryFileSimple = inputId => { return request.get(`api/inputfilesimple/`, { params: { input: inputId }}) }

export const deleteFileInput = inputId => { return request.delete(`api/inputfilesheet/${inputId}/`) }

export const createFileColumn = params => { return request.post(`api/inputfilecolumn/`, params) }

export const updateFileColumn = (inputId, params) => { return request.patch(`api/inputfilecolumn/${inputId}/`, params) }

export const deleteFileColumn = inputId => { return request.delete(`api/inputfilecolumn/${inputId}/`) }

export const queryOutput = taskId => { return request.get(`api/outputsheet/`, { params: { task: taskId }}) }

export const queryOutputColumn = outputId => { return request.get(`api/outputcolumn/`, { params: { id: outputId }}) }

export const changeOutputColumn = (outputId, params) => { return request.patch(`api/outputcolumn/${outputId}/`, params) }

export const queryOutputSimple = taskId => { return request.get(`api/outputsimple/`, { params: { task: taskId }}) }

export const queryOutputSheet = sheetId => { return request.get(`api/outputsimple/`, { params: { id: sheetId }}) }

export const createOutputSheet = params => { return request.post(`api/outputsheet/`, params) }

export const deleteOutputSheet = outputId => { return request.delete(`api/outputsheet/${outputId}/`) }

export const updateOutput = (outputId, params) => { return request.patch(`api/outputsheet/${outputId}/`, params) }

export const renewOutput = (taskId, params) => { return request.post(`api/renewoutput/${taskId}/`, params) }

export const createOutputColumn = params => { return request.post(`api/outputcolumn/`, params) }

export const updateOutputColumn = (outputId, params) => { return request.patch(`api/outputcolumn/${outputId}/`, params) }

export const deleteOutput = outputId => { return request.delete(`api/outputcolumn/${outputId}/`) }

export const querySql = taskId => { return request.get(`api/sqlcode/`, { params: { task: taskId }}) }

export const ChangeSql = params => { return request.post(`api/sqlcode/`, params) }

export const UpdateSql = (sqlId, params) => { return request.patch(`api/sqlcode/${sqlId}/`, params) }

export const DeleteSql = sqlId => { return request.delete(`api/sqlcode/${sqlId}/`) }

export const queryExec = params => { return request.get(`api/execfunc/`, params) }

export const tempSql = (inputId, params) => { return request.post(`api/tempsql/${inputId}/`, params) }

export const createDemand = params => { return request.post(`api/demand/`, params) }

export const Demandquery = (demandId) => { return request.get(`api/parenttask/${demandId}/`) }

export const Demandsimplequery = (demandId) => { return request.get(`api/parenttasksimple/${demandId}/`) }

export const Filequery = (idList) => { return request.get(`api/file/`, { params: { id: idList }}) }

export const SeqFilequery = (seq_id) => { return request.get(`api/seqfile/${seq_id}/`) }

export const UpdateDemand = (demandId, params) => { return request.patch(`api/parenttask/${demandId}/`, params) }

export const ChgDemandStatus = (demandId, params) => { return request.post(`api/demandstatus/${demandId}/`, params) }

export const createTask = params => { return request.post(`api/sontask/`, params) }

export const querySonTask = demandId => { return request.get(`api/sontask/`, { params: { demand_id: demandId }}) }

export const queryResFile = taskId => { return request.get(`api/resfile/`, { params: { task_id: taskId }}) }

export const deleteResFile = fileId => { return request.delete(`api/resfile/`, { params: { file_id: fileId }}) }

export const newVersion = params => { return request.post(`api/version/`, params) }

export const queryTaskDeve = params => { return request.get(`api/taskindeve/`, params) }

export const extDemand = params => { return request.post(`api/extdemand/`, params) }

export const markchange = params => { return request.post(`api/changehistory/`, params) }

export const querychange = params => { return request.get(`api/changehistory/`, params) }

export const createFeed = params => { return request.post(`api/feedrecord/`, params) }

export const updateFeed = (feedId, params) => { return request.patch(`api/feedrecord/${feedId}/`, params) }

export const getFeedById = feedId => { return request.get(`api/feedrecord/`, { params: { id: feedId }}) }

export const hasNewFeed = demandId => { return request.get(`api/newfeed/${demandId}/`) }

export const hasNewFeedTask = taskId => { return request.get(`api/newfeedtask/${taskId}/`) }

export const getOutputFeed = demandId => { return request.get(`api/feedrecord/`, { params: { demind_seq: demandId, model_name: 'OutputColumn' }}) }

export const getOutputFeed_unconfirm = demandId => { return request.get(`api/feedrecord/`, { params: { demind_seq: demandId, model_name: 'OutputColumn', if_feed: false }}) }

export const getDemandFeed = demandId => { return request.get(`api/feedrecord/`, { params: { demind_seq: demandId, model_name: 'ParentTask' }}) }

export const getDemandFeed_unconfirm = demandId => { return request.get(`api/feedrecord/`, { params: { demind_seq: demandId, model_name: 'ParentTask', if_feed: false }}) }

export const confirmSonTask = params => { return request.post(`api/confirmsontask/`, params) }

export const getDeveQueue_Task = params => { return request.get(`api/devequeue/`, { params: { model_name: 'Task' }}) }

export const getDeveQueue_ParentTask = params => { return request.get(`api/devequeue/`, { params: { model_name: 'ParentTask' }}) }

export const addDeveQueue_Task = params => { return request.post(`api/devequeue/`, params) }

export const addDeveQueue_ParentTask = params => { return request.post(`api/devequeue/`, params) }

export const delDeveQueue = model_name => { return request.delete(`api/devequeue/`, { params: { model_name: model_name }}) }

export const queryFeedList = (page, searchText) => { return request.get(`api/feedpage/`, { params: { page: page, search: searchText }}) }
