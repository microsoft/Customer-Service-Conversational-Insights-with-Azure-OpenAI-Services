@description('Specifies the location for resources.')
param solutionLocation string
param keyVaultName string
param baseUrl string
param managedIdentityObjectId string
param storageAccountName string
param containerName string
// param identity string
// param baseUrl string

// param azureOpenAIApiKey string
// param azureOpenAIEndpoint string
// param azureSearchAdminKey string
// param azureSearchServiceEndpoint string

// resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
//   name: keyVaultName
// }

// param storageAccountName string = keyVault.getSecret('ADLS-ACCOUNT-NAME')
// var containerName = keyVault.getSecret('ADLS-ACCOUNT-CONTAINER')
// // var storageAccountKey = keyVault.getSecret('')
// var azureOpenAIApiKey = keyVault.getSecret('AZURE-OPENAI-KEY')
// var azureOpenAIEndpoint = keyVault.getSecret('AZURE-OPENAI-ENDPOINT')
// var azureSearchAdminKey = keyVault.getSecret('AZURE-SEARCH-KEY')
// var azureSearchServiceEndpoint = keyVault.getSecret('AZURE-SEARCH-ENDPOINT')

resource copy_demo_Data 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  kind:'AzureCLI'
  name: 'copy_demo_Data'
  location: solutionLocation // Replace with your desired location
  identity:{
    type:'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityObjectId}' : {}
    }
  }
  properties: {
    azCliVersion: '2.50.0'
    primaryScriptUri: '${baseUrl}Deployment/scripts/copy_kb_files.sh' // deploy-azure-synapse-pipelines.sh
    arguments: '${storageAccountName} ${containerName} ${baseUrl}' // Specify any arguments for the script
    timeout: 'PT1H' // Specify the desired timeout duration
    retentionInterval: 'PT1H' // Specify the desired retention interval
    cleanupPreference:'OnSuccess'
  }
}

// arguments: '${storageAccountName} ${containerName} ${storageAccountKey} ${baseUrl} ${azureOpenAIApiKey} ${azureOpenAIEndpoint} ${azureSearchAdminKey} ${azureSearchServiceEndpoint}' // Specify any arguments for the script
