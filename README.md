
#Process steps recovery mechanism
##Requirements:

- Install [Node.js](https://nodejs.org/) v10.15+
- Install and IDE (Recommend: [Visual Studio Code](https://code.visualstudio.com/download))
### Initialize postgre db

####Install psql

On windows: Get the  [Windows installer.](https://www.postgresql.org/download/windows/)

####Log in psql with default user(postgres)
```sh

$ psql postgres
postgres=# \conninfo

You are connected to database "postgres" as user "your_username" via socket in "/tmp" at port "5432".
```
####Create a user for the app to connect to the db

```sh

postgres=# CREATE ROLE me WITH LOGIN PASSWORD 'password';
postgres=# ALTER ROLE me CREATEDB;
```

####Log out the user postgres and log in with the user  *me* 
```sh
postgres=> \q
$ psql -d postgres -U me
postgres=> CREATE DATABASE process;

```
####Connect to the newly created database
```sh
postgres=> \c process
process=> CREATE TABLE process_instance (process_id VARCHAR PRIMARY KEY ,process_instance_id VARCHAR,saved_date VARCHAR,url VARCHAR,steps JSON);

```

####Install the dependencies
```sh
$ npm install
```

####Start the server
```sh
$ npm server.js
```
