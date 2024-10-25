param appConfigName string
param location string = resourceGroup().location
param skuName string = 'Standard'

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2023-03-01' = {
  name: appConfigName
  location: location
  sku: {
    name: skuName
  }
}

output appConfigId string = appConfig.id
output appConfigEndpoint string = appConfig.properties.endpoint
