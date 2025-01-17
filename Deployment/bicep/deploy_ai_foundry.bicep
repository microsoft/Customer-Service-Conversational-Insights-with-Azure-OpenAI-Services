// Creates Azure dependent resources for Azure AI studio
param solutionName string
param solutionLocation string
param managedIdentityObjectId string

// @description('Azure region of the deployment')
// param location string = resourceGroup().location

// @description('Tags to add to the resources')
// param tags object = {}

// @description('AI services name')
// param aiServicesName string

// @description('Application Insights resource name')
// param applicationInsightsName string

// @description('Container registry name')
// param containerRegistryName string

// @description('The name of the Key Vault')
// param keyvaultName string

// @description('Name of the storage account')
// param storageName string

// @description('Storage SKU')
// param storageSkuName string = 'Standard_LRS'

var storageName = '${solutionName}hubstorage'
var storageSkuName = 'Standard_LRS'
var aiServicesName = '${solutionName}-aiservices'
var aiServicesName_cu = '${solutionName}-aiservices_cu'
var location_cu = 'westus'
var aiServicesName_m = '${solutionName}-aiservices_m'
var location_m = solutionLocation
var applicationInsightsName = '${solutionName}-appinsights'
var containerRegistryName = '${solutionName}acr'
var keyvaultName = '${solutionName}-kv'
var location = 'eastus2' //solutionLocation
var aiHubName = '${solutionName}-aihub'
var aiHubFriendlyName = aiHubName
var aiHubDescription = 'Test'
var aiProjectName = '${solutionName}-aiproject'
var aiProjectFriendlyName = aiProjectName
var aiSearchName = '${solutionName}-search'
var aiModelDeployments = [
  {
    name: 'gpt-4o-mini'
    model: 'gpt-4o-mini'
    sku: {
      name: 'GlobalStandard'
      capacity: 100
    }
    raiPolicyName: 'Microsoft.Default'
  }
  // {
  //   name: 'gpt-4o'
  //   model: 'gpt-4o'
  //   sku: {
  //     name: 'Standard'
  //     capacity: 20
  //   }
  //   raiPolicyName: 'Microsoft.Default'
  // }
  {
    name: 'text-embedding-ada-002'
    model: 'text-embedding-ada-002'
    sku: {
      name: 'Standard'
      capacity: 80
    }
    raiPolicyName: 'Microsoft.Default'
  }
]

var containerRegistryNameCleaned = replace(containerRegistryName, '-', '')

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    DisableIpMasking: false
    DisableLocalAuth: false
    Flow_Type: 'Bluefield'
    ForceCustomerStorageForProfiler: false
    ImmediatePurgeDataOn30Days: true
    IngestionMode: 'ApplicationInsights'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Disabled'
    Request_Source: 'rest'
  }
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2021-09-01' = {
  name: containerRegistryNameCleaned
  location: location
  sku: {
    name: 'Premium'
  }
  properties: {
    adminUserEnabled: true
    dataEndpointEnabled: false
    networkRuleBypassOptions: 'AzureServices'
    networkRuleSet: {
      defaultAction: 'Deny'
    }
    policies: {
      quarantinePolicy: {
        status: 'enabled'
      }
      retentionPolicy: {
        status: 'enabled'
        days: 7
      }
      trustPolicy: {
        status: 'disabled'
        type: 'Notary'
      }
    }
    publicNetworkAccess: 'Disabled'
    zoneRedundancy: 'Disabled'
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: keyvaultName
  location: solutionLocation
  properties: {
    createMode: 'default'
    accessPolicies: [
      {        
        objectId: managedIdentityObjectId        
        permissions: {
          certificates: [
            'all'
          ]
          keys: [
            'all'
          ]
          secrets: [
            'all'
          ]
          storage: [
            'all'
          ]
        }
        tenantId: subscription().tenantId
      }
    ]
    enabledForDeployment: true
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: true
    enableSoftDelete: false
    enableRbacAuthorization: true
    enablePurgeProtection: true
    publicNetworkAccess: 'enabled'
    // networkAcls: {
    //   bypass: 'AzureServices'
    //   defaultAction: 'Deny'
    // }
    sku: {
      family: 'A'
      name: 'standard'
    }
    softDeleteRetentionInDays: 7
    tenantId: subscription().tenantId
  }
}

@description('This is the built-in Key Vault Administrator role.')
resource kvAdminRole 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentityObjectId, kvAdminRole.id)
  properties: {
    principalId: managedIdentityObjectId
    roleDefinitionId:kvAdminRole.id
    principalType: 'ServicePrincipal' 
  }
}

var storageNameCleaned = replace(storageName, '-', '')

resource aiServices 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: aiServicesName
  location: location
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    apiProperties: {
      statisticsEnabled: false
    }
  }
}

resource aiServices_m 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: aiServicesName_m
  location: location_m
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    apiProperties: {
      statisticsEnabled: false
    }
  }
}

resource aiServices_CU 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: aiServicesName_cu
  location: location_cu
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    apiProperties: {
      statisticsEnabled: false
    }
  }
}

@batchSize(1)
resource aiServicesDeployments 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for aiModeldeployment in aiModelDeployments: {
  parent: aiServices_m
  name: aiModeldeployment.name
  properties: {
    model: {
      format: 'OpenAI'
      name: aiModeldeployment.model
    }
    raiPolicyName: aiModeldeployment.raiPolicyName
  }
  sku:{
    name: aiModeldeployment.sku.name
    capacity: aiModeldeployment.sku.capacity
  }
}]

resource aiSearch 'Microsoft.Search/searchServices@2023-11-01' = {
    name: aiSearchName
    location: solutionLocation
    sku: {
      name: 'basic'
    }
    properties: {
      replicaCount: 1
      partitionCount: 1
      hostingMode: 'default'
      publicNetworkAccess: 'enabled'
      networkRuleSet: {
        ipRules: []
      }
      encryptionWithCmk: {
        enforcement: 'Unspecified'
      }
      disableLocalAuth: false
      authOptions: {
        apiKeyOnly: {}
      }
      semanticSearch: 'free'
    }
  }

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageNameCleaned
  location: location
  sku: {
    name: storageSkuName
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowCrossTenantReplication: false
    allowSharedKeyAccess: true
    encryption: {
      keySource: 'Microsoft.Storage'
      requireInfrastructureEncryption: false
      services: {
        blob: {
          enabled: true
          keyType: 'Account'
        }
        file: {
          enabled: true
          keyType: 'Account'
        }
        queue: {
          enabled: true
          keyType: 'Service'
        }
        table: {
          enabled: true
          keyType: 'Service'
        }
      }
    }
    isHnsEnabled: false
    isNfsV3Enabled: false
    keyPolicy: {
      keyExpirationPeriodInDays: 7
    }
    largeFileSharesState: 'Disabled'
    minimumTlsVersion: 'TLS1_2'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
  }
}

// resource storageAccounts_default 'Microsoft.Storage/storageAccounts/blobServices@2022-09-01' = {
//   parent: storage
//   name: 'default'
//   properties: {
//     cors: {
//       corsRules: []
//     }
//     deleteRetentionPolicy: {
//       allowPermanentDelete: false
//       enabled: false
//     }
//   }
// }


// resource storageAccounts_default_data 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
//   parent: storageAccounts_default
//   name: 'data'
//   properties: {
//     defaultEncryptionScope: '$account-encryption-key'
//     denyEncryptionScopeOverride: false
//     publicAccess: 'None'
//   }
// }

// resource storageAccounts_default_input 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
//   parent: storageAccounts_default
//   name: 'graphrag'
//   properties: {
//     defaultEncryptionScope: '$account-encryption-key'
//     denyEncryptionScopeOverride: false
//     publicAccess: 'None'
//   }
// }

@description('This is the built-in Storage Blob Data Contributor.')
resource blobDataContributor 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
}

resource storageroleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentityObjectId, blobDataContributor.id)
  properties: {
    principalId: managedIdentityObjectId
    roleDefinitionId:blobDataContributor.id
    principalType: 'ServicePrincipal' 
  }
}

resource aiHub 'Microsoft.MachineLearningServices/workspaces@2023-08-01-preview' = {
  name: aiHubName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    // organization
    friendlyName: aiHubFriendlyName
    description: aiHubDescription

    // dependent resources
    keyVault: keyVault.id
    storageAccount: storage.id
    applicationInsights: applicationInsights.id
    containerRegistry: containerRegistry.id
  }
  kind: 'hub'

  resource aiServicesConnection 'connections@2024-07-01-preview' = {
    name: '${aiHubName}-connection-AzureOpenAI'
    properties: {
      category: 'AzureOpenAI'
      target: aiServices.properties.endpoint
      authType: 'ApiKey'
      isSharedToAll: true
      credentials: {
        key: aiServices.listKeys().key1
      }
      metadata: {
        ApiType: 'Azure'
        ResourceId: aiServices.id
      }
    }
    dependsOn: [
      aiServicesDeployments,aiSearch
    ]
  }
  
  resource aiSearchConnection 'connections@2024-07-01-preview' = {
    name: '${aiHubName}-connection-AzureAISearch'
    properties: {
      category: 'CognitiveSearch'
      target: 'https://${aiSearch.name}.search.windows.net'
      authType: 'ApiKey'
      isSharedToAll: true
      credentials: {
        key: aiSearch.listAdminKeys().primaryKey
      }
      metadata: {
        type:'azure_ai_search'
        ApiType: 'Azure'
        ResourceId: aiSearch.id
        ApiVersion:'2024-05-01-preview'
        DeploymentApiVersion:'2023-11-01'
      }
    }
  }
  dependsOn: [
    aiServicesDeployments,aiSearch
  ]
}

resource aiHubProject 'Microsoft.MachineLearningServices/workspaces@2024-01-01-preview' = {
  name: aiProjectName
  location: location
  kind: 'Project'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    friendlyName: aiProjectFriendlyName
    hubResourceId: aiHub.id
  }
}

var serverlessModelName = 'Phi-3-medium-4k-instruct'
var phi3serverlessName = '${solutionName}-${serverlessModelName}'
resource phi3serverless 'Microsoft.MachineLearningServices/workspaces/serverlessEndpoints@2024-10-01' = {
  parent: aiHubProject
  location: location
  name: phi3serverlessName
  properties: {
    authMode: 'Key'
    contentSafety: {
      contentSafetyStatus: 'Enabled'
    }
    modelSettings: {
      modelId: 'azureml://registries/azureml/models/${serverlessModelName}'
    }
  }
  sku: {
    name: 'Consumption'
    tier: 'Free'
  }
}

resource tenantIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'TENANT-ID'
  properties: {
    value: subscription().tenantId
  }
}

// resource adlsAccountNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-NAME'
//   properties: {
//     value: storageName
//   }
// }

// resource adlsAccountContainerEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-CONTAINER'
//   properties: {
//     value: 'data'
//   }
// }

// resource adlsAccountKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-KEY'
//   properties: {
//     value: storage.listKeys().keys[0].value
//   }
// }

resource azureOpenAIInferenceEndpoint 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-INFERENCE-ENDPOINT'
  properties: {
    value: phi3serverless.properties.inferenceEndpoint.uri
  }
}

resource azureOpenAIInferenceKey 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-INFERENCE-KEY'
  properties: {
    value: listKeys(phi3serverless.id, '2024-10-01').primaryKey
  }
}

resource azureOpenAIApiKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-KEY'
  properties: {
    value: aiServices_m.listKeys().key1
  }
}

resource azureOpenAIApiVersionEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-PREVIEW-API-VERSION'
  properties: {
    value: '2024-02-15-preview'
  }
}

resource azureOpenAIEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: aiServices_m.properties.endpoint
  }
}

resource azureOpenAICUEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-ENDPOINT'
  properties: {
    value: aiServices_CU.properties.endpoint
  }
}

resource azureOpenAICUApiKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-KEY'
  properties: {
    value: aiServices_CU.listKeys().key1
  }
}

resource azureOpenAICUApiVersionEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-CU-VERSION'
  properties: {
    value: '?api-version=2024-12-01-preview'
  }
}

resource azureSearchAdminKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SEARCH-KEY'
  properties: {
    value: aiSearch.listAdminKeys().primaryKey
  }
}

resource azureSearchServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SEARCH-ENDPOINT'
  properties: {
    value: 'https://${aiSearch.name}.search.windows.net'
  }
}

resource azureSearchServiceEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SEARCH-SERVICE'
  properties: {
    value: aiSearch.name
  }
}

resource azureSearchIndexEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SEARCH-INDEX'
  properties: {
    value: 'transcripts_index'
  }
}

resource cogServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-ENDPOINT'
  properties: {
    value: aiServices.properties.endpoint
  }
}

resource cogServiceKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-KEY'
  properties: {
    value: aiServices.listKeys().key1
  }
}

resource cogServiceNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-NAME'
  properties: {
    value: aiServicesName
  }
}

resource azureSubscriptionIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-SUBSCRIPTION-ID'
  properties: {
    value: subscription().subscriptionId
  }
}

resource resourceGroupNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-RESOURCE-GROUP'
  properties: {
    value: resourceGroup().name
  }
}

resource azureLocatioEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-LOCATION'
  properties: {
    value: solutionLocation
  }
}

output keyvaultName string = keyvaultName
output keyvaultId string = keyVault.id
// output storageName string = storageName
// output storageContainer string = 'data'

output aiServicesTarget string = aiServices_m.properties.endpoint
output aiServicesName string = aiServicesName_m
output aiServicesId string = aiServices_m.id

output aiInfereceEndpoint string = phi3serverless.properties.inferenceEndpoint.uri

output aiSearchName string = aiSearchName
output aiSearchId string = aiSearch.id
output aiSearchTarget string = 'https://${aiSearch.name}.search.windows.net'
output aiSearchService string = aiSearch.name

// output aifoundryOutput object = {
//   id: aiHub.id
//   keyvault: keyVault.id
// }


// output aiHubID string = aiHub.id
// output aiProjectID string = aiHubProject.id
// // output aiservicesID string = aiServices.id
// // output aiservicesTarget string = aiServices.properties.endpoint
// // output storageId string = storage.id
// output keyvaultId string = keyVault.id
// // output containerRegistryId string = containerRegistry.id
// // output applicationInsightsId string = applicationInsights.id
