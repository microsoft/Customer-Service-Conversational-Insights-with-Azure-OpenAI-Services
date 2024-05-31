**Run below code to build bicep.json after changes**

az bicep build --file main.bicep


**Creates Resource group**
az group create --name CKM-v2-BK-001 --location eastus
**Deploys bicep template**
az deployment group create --resource-group CKM-v2-BK-001 --template-file master.bicep