# Setup local environment

Install:

- Node 18
- Yarn
- Volta (optional) - https://volta.sh/

### Add your PAT into %USERPROFILE%.npmrc
//pkgs.dev.azure.com/DAISolutions/656d482e-cfa0-467f-9172-5aaa4eee03ec/_packaging/KM-artifacts/npm/registry/:_password="{Base64 encoded PAT with read rights goes here}"

### Install dependencies
``yarn install`` 

If you have timeouts increase the timeout time with this command 
``yarn config set network-timeout 600000``
600000ms = 10 minutes

### Execute locally (app and mock server)
``yarn run dev`` 

### Execute locally (app only)
``yarn run start`` 


## Local mock server requisites

## Installation

nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
To install execute:
``yarn global add nodemon``

### Start local mock server independently from the frontend app
``yarn run server-mocks`` 