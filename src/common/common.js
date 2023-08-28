export  function formatDate(date){
  if(date === null){
    return ""
  }
  let d = new Date(date);
  if(String(d.getMinutes()).length==2) {
    return d.toLocaleDateString() + " " + d.getHours() + ":" + d.getMinutes()
  }else{
    return d.toLocaleDateString() + " " + d.getHours() + ":" + "0"+d.getMinutes()
  }
}

export const DemandstateMap = {'conforming':'conforming',
  'wait':'waiting',
  'conformed':'conformed',
  'developing':'developing',
  'accepting':'accepting',
  'finished':'finished',
  'cancel':'cancelled',
  'check':'checking',
  'failed':'dismissed'
};

export const demandStatus =[
  //{'key':'check','value':'审核中'},
 // {'key':'failed','value':'审核不通过'},
  {'key':'wait','value':'waiting'},
  {'key':'conforming','value':'conforming'},
  {'key':'conformed','value':'conformed'},
  {'key':'developing','value':'developing'},
  {'key':'accepting','value':'accepting'},
  {'key':'finished','value':'finished'},
  {'key':'cancel','value':'cancelled'}
];

export const page_size = "20";

export const typeMap = {'file':'file','module':'query'};

export const stateMap= {'confirming':'confirming','ranking':'queued', 'developing':'developing', 'finished':'finished', 'repairing':'bug fixing'};

export const mapPriority ={'1':'Emergency',1:'Emergency',
  '2':'Normal',2:'Normal',
  '0':'Two Sessions',0:'Two Sessions'
};

export const demandPriority =[
  {'key':'1','value':'Emergency'},
  {'key':'2','value':'Normal'}
];

export function mapheader(header){
  if(header==='title'){
    return 'Title';
  }
  else if(header==='type'){
    return 'Type';
  }
  else if(header==='priority'){
    return 'Priority';
  }
  else if(header==='desc'){
    return 'Description';
  }
  else if(header==='requirment_files'){
    return 'Accessory';
  }
  else if(header==='reason'){
    return 'Accordance';
  }
  else if(header==='reason_file'){
    return 'Accordance Accessory';
  }
  else if(header==='deadline'){
    return 'Deadline';
  }
  else if(header==='status'){
    return 'Status';
  }
  else if(header==='checkreason'){
    return 'Confirm Reason';
  }
  else {
    return 'Unkown';
  }
}

