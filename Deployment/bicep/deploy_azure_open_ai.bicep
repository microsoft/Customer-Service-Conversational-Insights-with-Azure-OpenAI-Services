@minLength(3)
@maxLength(15)
@description('Solution Name')
param solutionName string
param solutionLocation string

param accounts_ckm_openai_name string = '${ solutionName }-openai'

resource accounts_ckm_openai_name_resource 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: accounts_ckm_openai_name
  location: solutionLocation
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: accounts_ckm_openai_name
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
  }
}

// resource accounts_ckm_openai_name_gpt_35_turbo 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
//   parent: accounts_ckm_openai_name_resource
//   name: 'gpt-35-turbo-16k'
//   sku: {
//     name: 'Standard'
//     capacity: 30
//   }
//   properties: {
//     model: {
//       format: 'OpenAI'
//       name: 'gpt-35-turbo-16k'
//       version: '0613'
//     }
//     versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
//     raiPolicyName: 'Microsoft.Default'
//   }
//   //dependsOn:[accounts_ckm_openai_name_resource]
// }

resource accounts_ckm_openai_name_gpt_4 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: accounts_ckm_openai_name_resource
  name: 'gpt-4'
  sku: {
    name: 'Standard'
    capacity: 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    raiPolicyName: 'Microsoft.Default'
  }
  //dependsOn:[accounts_ckm_openai_name_resource]
}

var openaiKey = accounts_ckm_openai_name_resource.listKeys().key1

output openAIOutput object = {
openAPIKey : openaiKey
openAPIVersion:accounts_ckm_openai_name_resource.apiVersion
openAPIEndpoint: accounts_ckm_openai_name_resource.properties.endpoint
openAIAccountName:accounts_ckm_openai_name
}
