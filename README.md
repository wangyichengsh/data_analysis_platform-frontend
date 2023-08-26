Data Analyisi Platform Frontend
==============================
A system allowed SQL developers customize query web pages including inputs,outputs and SQL etc.

[Demo](http://129.211.26.73:8080) (You can login in as a [developer](http://129.211.26.73:8080/login?password=deve%401234%21&username=deve1) or as a [user](http://129.211.26.73:8080/login?password=12345678%21&username=user1)) 

Installation
============
```bash
npm install 
```



Configuration
=============
Modify `.env.development` or `.env.production` depend on whether you want Run or Build, as following: 
```
VUE_APP_BASE_API = 'http://backend.host:port/api/'
VUE_APP_HOST = 'http://backend.host:port'
VUE_APP_BK_HOST = 'http://backend.host:port'
VUE_APP_FILE_HOST = 'http://backend.host:port'
VUE_APP_CHANNEL_HOST = 'ws://websockets.host:port'
VUE_APP_RECORD_JOB = '0'
```

Run
===
```bash
npm run dev
```



Build
=====
```bash
npm run build:prod
```

