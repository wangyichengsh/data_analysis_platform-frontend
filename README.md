Data Analyisi Platform Frontend
==============================
A system allowed SQL developers customize query web pages including inputs,outputs and SQL etc.

[Demo](http://4.206.106.246) (You can login in as a [developer](http://4.206.106.246/login?password=deve%401234%21&username=deve1) or as a [user](http://4.206.106.246/login?password=12345678%21&username=user1)) 

[User guide](/docs/user_guide.md) 

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


User Guide
==========
[user guide](/docs/user_guide.md) 
