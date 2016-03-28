# RESTful API with Node.JS
This is a testing project for first time with Node.js  

### How to setup Express Module  
**Ref:** http://expressjs.com/en/starter/installing.html  

### Express application generator  
**Ref:** http://expressjs.com/en/starter/generator.html  

***Install express generator***
```sh
$ npm install express-generator -g  
```
***Generate myapp***
```sh
$ express myapp  
```
***Enter myapp directory***
```sh
$ cd myapp  
```
***Install npm***
```sh
$ npm install  
```
***Start Service***
```sh
$ DEBUG=myapp:* npm start  
```

### Install MySQL
**Ref:** https://github.com/felixge/node-mysql  
```sh
$ npm install mysql
```

### Install Redis 
**Ref:** http://redis.io/download  
```sh
$ wget http://download.redis.io/releases/redis-3.0.7.tar.gz  
$ tar xzf redis-3.0.7.tar.gz  
$ cd redis-3.0.7  
$ make  
```

### Run Redis
```sh
$ src/redis-server  
```

### Install Redis Module
**Ref:** http://www.sitepoint.com/using-redis-node-js/  
**Ref:** https://www.npmjs.com/package/redis-cluster  
```sh
$ npm install redis  
```

### Install Memcached Server  
***Ref:** http://www.hacksparrow.com/install-memcached-on-mac-os-x.html  
```sh
$ brew install memcached  
```

### Run Memcached  
```sh
$ memcached -d -p 11211  
```

### Install Memcached Module
**Ref:** https://www.npmjs.com/package/memcached
```sh
$ npm install memcached
```