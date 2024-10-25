@description('Name of the storage account')
param storageAccountName string

@description('Location for the storage account')
param location string = resourceGroup().location

@description('The SKU of the storage account')
param skuName string = 'Standard_LRS'

@description('The kind of the storage account')
param kind string = 'StorageV2'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: skuName
  }
  kind: kind
  properties: {
    accessTier: 'Hot'
  }
}

output storageAccountName string = storageAccount.name
output storageAccountId string = storageAccount.id
