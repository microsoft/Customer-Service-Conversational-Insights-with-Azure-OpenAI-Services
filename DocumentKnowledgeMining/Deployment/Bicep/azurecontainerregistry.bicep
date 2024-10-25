// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


param acrName string = 'acr-'

@description('Provide a location for the registry.')
param location string = resourceGroup().location

@description('Provide a tier of your Azure Container Registry.')
param acrSku string = 'Basic'

resource acrResource 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = {
  name: acrName
  location: location
  sku: {
    name: acrSku
  }
  properties: {
    adminUserEnabled: true
  }
}

output createdAcrName string = acrName
output createdAcrId string = acrResource.id
output acrEndpoint string = acrResource.properties.loginServer

