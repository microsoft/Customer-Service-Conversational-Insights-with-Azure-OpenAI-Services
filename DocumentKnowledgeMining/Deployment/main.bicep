// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
@description('The Data Center where the model is deployed.')
param modeldatacenter string

targetScope = 'subscription'
var resourceprefix = padLeft(take(uniqueString(deployment().name), 5), 5, '0')
var resourceprefix_name = 'kmgs'

// Create a resource group
resource gs_resourcegroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${resourceprefix_name}${resourceprefix}'
  location: deployment().location
}

// Create a storage account
module gs_storageaccount 'bicep/azurestorageaccount.bicep' = {
  name: 'blob${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    storageAccountName: 'blob${resourceprefix}'
    location: deployment().location
  }
}

// Create a Azure Search Service
module gs_azsearch 'bicep/azuresearch.bicep' = {
  name: 'search-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    searchServiceName: 'search-${resourceprefix}'
    location: deployment().location
  }
}


// Create Container Registry
module gs_containerregistry 'bicep/azurecontainerregistry.bicep' = {
  name: 'acr${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    acrName: 'acr${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// Create AKS Cluster
module gs_aks 'bicep/azurekubernetesservice.bicep' = {
  name: 'aks-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    aksName: 'aks-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
  dependsOn: [
    gs_containerregistry
  ]
}

// Assign ACR Pull role to AKS
// module gs_roleassignacrpull 'bicep/azureroleassignacrpull.bicep' = {
//   name: 'assignAcrPullRole'
//   scope: gs_resourcegroup
//   params: {
//     aksName: gs_aks.outputs.createdAksName
//     acrName: gs_containerregistry.outputs.createdAcrName
//   }
//   dependsOn: [
//     gs_aks
//     gs_containerregistry
//   ]
// }


// Create Azure Cognitive Service
module gs_azcognitiveservice 'bicep/azurecognitiveservice.bicep' = {
  name: 'cognitiveservice-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    cognitiveServiceName: 'cognitiveservice-${resourceprefix_name}${resourceprefix}'
    location: 'eastus'
  }
}

// Create Azure Open AI Service
module gs_openaiservice 'bicep/azureopenaiservice.bicep' = {
  name: 'openaiservice-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    openAIServiceName: 'openaiservice-${resourceprefix_name}${resourceprefix}'
    // GPT-4-32K model & GPT-4o available Data center information.
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4    
    location: modeldatacenter
  }
}

// Due to limited of Quota, not easy to control per each model deployment.
// Set the minimum capacity of each model
// Based on customer's Model capacity, it needs to be updated in Azure Portal.
module gs_openaiservicemodels_gpt4o 'bicep/azureopenaiservicemodel.bicep' = {
  scope: gs_resourcegroup
  name: 'gpt-4o-mini'
  params: {
    parentResourceName: gs_openaiservice.outputs.openAIServiceName
    name:'gpt-4o-mini'
    model: {
        name: 'gpt-4o-mini'
        version: '2024-07-18'
        raiPolicyName: ''
        capacity: 1
        scaleType: 'Standard'
      }
    
  }
  dependsOn: [
    gs_openaiservice
  ]
}

module gs_openaiservicemodels_text_embedding 'bicep/azureopenaiservicemodel.bicep' = {
  scope: gs_resourcegroup
  name: 'text-embedding-large'
  params: {
    parentResourceName: gs_openaiservice.outputs.openAIServiceName
    name:'text-embedding-large'
    model: {
        name: 'text-embedding-3-large'
        version: '1'
        raiPolicyName: ''
        capacity: 1
        scaleType: 'Standard'
      }
    }
    dependsOn: [
      gs_openaiservicemodels_gpt4o
    ]  
}

// Create Azure Cosmos DB Mongo
module gs_cosmosdb 'bicep/azurecosmosdb.bicep' = {
  name: 'cosmosdb-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    cosmosDbAccountName: 'cosmosdb-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// Create Azure App Configuration
module gs_appconfig 'bicep/azureappconfigservice.bicep' = {
  name: 'appconfig-${resourceprefix_name}${resourceprefix}'
  scope: gs_resourcegroup
  params: {
    appConfigName: 'appconfig-${resourceprefix_name}${resourceprefix}'
    location: deployment().location
  }
}

// return all resource names as a output
output gs_resourcegroup_name string = 'rg-${resourceprefix_name}${resourceprefix}'
output gs_storageaccount_name string = gs_storageaccount.outputs.storageAccountName
output gs_azsearch_name string = gs_azsearch.outputs.searchServiceName

output gs_aks_name string = gs_aks.outputs.createdAksName
output gs_aks_serviceprincipal_id string = gs_aks.outputs.createdServicePrincipalId

output gs_containerregistry_name string = gs_containerregistry.outputs.createdAcrName

output gs_azcognitiveservice_name string = gs_azcognitiveservice.outputs.cognitiveServiceName
output gs_azcognitiveservice_endpoint string = gs_azcognitiveservice.outputs.cognitiveServiceEndpoint

output gs_openaiservice_name string = gs_openaiservice.outputs.openAIServiceName
output gs_openaiservice_location string = gs_openaiservice.outputs.oopenAIServiceLocation
output gs_openaiservice_endpoint string = gs_openaiservice.outputs.openAIServiceEndpoint

output gs_openaiservicemodels_gpt4o_model_name string = gs_openaiservicemodels_gpt4o.outputs.deployedModelName
output gs_openaiservicemodels_gpt4o_model_id string = gs_openaiservicemodels_gpt4o.outputs.deployedModelId

output gs_openaiservicemodels_text_embedding_model_name string = gs_openaiservicemodels_text_embedding.outputs.deployedModelName
output gs_openaiservicemodels_text_embedding_model_id string = gs_openaiservicemodels_text_embedding.outputs.deployedModelId
output gs_cosmosdb_name string = gs_cosmosdb.outputs.cosmosDbAccountName

output gs_appconfig_id string = gs_appconfig.outputs.appConfigId
output gs_appconfig_endpoint string = gs_appconfig.outputs.appConfigEndpoint

// return acr url
output gs_containerregistry_endpoint string = gs_containerregistry.outputs.acrEndpoint

//return resourcegroup resource ID
output gs_resourcegroup_id string = gs_resourcegroup.id

