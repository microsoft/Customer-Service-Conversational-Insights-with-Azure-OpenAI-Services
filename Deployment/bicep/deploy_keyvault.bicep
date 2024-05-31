// ========== Key Vault ========== //
targetScope = 'resourceGroup'

@minLength(3)
@maxLength(15)
@description('Solution Name')
param solutionName string

@description('Solution Location')
param solutionLocation string

param utc string = utcNow()

@description('Name')
param kvName string = '${ solutionName }-kv-${uniqueString(utc)}'

@description('Object Id. The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault.')
param objectId string

@description('Create Mode')
param createMode string = 'default'

@description('Enabled For Deployment. Property to specify whether Azure Virtual Machines are permitted to retrieve certificates stored as secrets from the key vault.')
param enableForDeployment bool = true

@description('Enabled For Disk Encryption. Property to specify whether Azure Disk Encryption is permitted to retrieve secrets from the vault and unwrap keys.')
param enableForDiskEncryption bool = true

@description('Enabled For Template Deployment. Property to specify whether Azure Resource Manager is permitted to retrieve secrets from the key vault.')
param enableForTemplateDeployment bool = true

@description('Enable Purge Protection. Property specifying whether protection against purge is enabled for this vault.')
param enablePurgeProtection bool = true

@description('Enable RBAC Authorization. Property that controls how data actions are authorized.')
param enableRBACAuthorization bool = true

@description('Enable Soft Delete. Property to specify whether the "soft delete" functionality is enabled for this key vault.')
param enableSoftDelete bool = false

@description('Soft Delete Retention in Days. softDelete data retention days. It accepts >=7 and <=90.')
param softDeleteRetentionInDays int = 30

@description('Public Network Access, Property to specify whether the vault will accept traffic from public internet.')
@allowed([
  'enabled'
  'disabled'
])
param publicNetworkAccess string = 'enabled'

@description('SKU')
@allowed([
  'standard'
  'premium'
])
param sku string = 'standard'

@description('Tenant Id')
param tenantId string

@description('Vault URI. The URI of the vault for performing operations on keys and secrets.')
var vaultUri = 'https://${ kvName }.vault.azure.net/'

param managedIdentityObjectId string

// param clientId string
// @secure()
// param clientSecret string
// param environmentUrl string
// param environmentId string
//param adlsAccountName string
//@secure()
//param adlsAccountKey string
@secure()
param azureOpenAIApiKey string
param azureOpenAIApiVersion string
param azureOpenAIEndpoint string
// @secure()
// param azureSearchAdminKey string
// param azureSearchServiceEndpoint string
// param azureSearchServiceName string
// param azureSearchArticlesIndex string
// param azureSearchGrantsIndex string
// param azureSearchDraftsIndex string
param cogServiceEndpoint string
@secure()
param cogServiceKey string
param cogServiceName string

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: kvName
  location: solutionLocation
  tags: {
    app: solutionName
    location: solutionLocation
  }
  properties: {
    accessPolicies: [
      {        
        objectId: objectId        
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
        tenantId: tenantId
      }
    ]
    createMode: createMode
    enabledForDeployment: enableForDeployment
    enabledForDiskEncryption: enableForDiskEncryption
    enabledForTemplateDeployment: enableForTemplateDeployment
    enablePurgeProtection: enablePurgeProtection
    enableRbacAuthorization: enableRBACAuthorization
    enableSoftDelete: enableSoftDelete
    softDeleteRetentionInDays: softDeleteRetentionInDays
    provisioningState: 'RegisteringDns'
    publicNetworkAccess: publicNetworkAccess
    sku: {
      family: 'A'
      name: sku
    }    
    tenantId: tenantId
    vaultUri: vaultUri
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


// resource clientIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'SPN-CLIENTID'
//   properties: {
//     value: clientId
//   }
// }

// resource clientSecretEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'SPN-CLIENTSECRET'
//   properties: {
//     value: clientSecret
//   }
// }

// resource environmentUrlEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ENVIRONMENT-URL'
//   properties: {
//     value: environmentUrl
//   }
// }

// resource environmentIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ENVIRONMENT-ID'
//   properties: {
//     value: environmentId
//   }
// }

resource tenantIdEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'TENANT-ID'
  properties: {
    value: tenantId
  }
}

// resource adlsAccountNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-NAME'
//   properties: {
//     value: adlsAccountName
//   }
// }

// resource adlsAccountKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'ADLS-ACCOUNT-KEY'
//   properties: {
//     value: adlsAccountKey
//   }
// }


resource azureOpenAIApiKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-KEY'
  properties: {
    value: azureOpenAIApiKey
  }
}

resource azureOpenAIApiVersionEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-VERSION'
  properties: {
    value: azureOpenAIApiVersion
  }
}

resource azureOpenAIEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: azureOpenAIEndpoint
  }
}

// resource azureSearchAdminKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-KEY'
//   properties: {
//     value: azureSearchAdminKey
//   }
// }

// resource azureSearchServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-ENDPOINT'
//   properties: {
//     value: azureSearchServiceEndpoint
//   }
// }

// resource azureSearchServiceEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-SERVICE'
//   properties: {
//     value: azureSearchServiceName
//   }
// }

// resource azureSearchArticlesIndexEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-INDEX-ARTICLES'
//   properties: {
//     value: azureSearchArticlesIndex
//   }
// }

// resource azureSearchGrantsIndexEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-INDEX-GRANTS'
//   properties: {
//     value: azureSearchGrantsIndex
//   }
// }

// resource azureSearchDraftsIndexEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
//   parent: keyVault
//   name: 'AZURE-SEARCH-INDEX-DRAFTS'
//   properties: {
//     value: azureSearchDraftsIndex
//   }
// }


resource cogServiceEndpointEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-ENDPOINT'
  properties: {
    value: cogServiceEndpoint
  }
}

resource cogServiceKeyEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-KEY'
  properties: {
    value: cogServiceKey
  }
}

resource cogServiceNameEntry 'Microsoft.KeyVault/vaults/secrets@2021-11-01-preview' = {
  parent: keyVault
  name: 'COG-SERVICES-NAME'
  properties: {
    value: cogServiceName
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

output keyvaultOutput object = {
  id: keyVault.id
  name: kvName
  uri: vaultUri
  resource:keyVault
}
