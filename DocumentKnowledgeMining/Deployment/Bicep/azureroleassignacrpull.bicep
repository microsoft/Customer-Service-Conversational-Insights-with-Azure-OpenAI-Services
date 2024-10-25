@description('Name of the AKS cluster')
param aksName string

@description('Name of the Azure Container Registry')
param acrName string

resource aks 'Microsoft.ContainerService/managedClusters@2021-03-01' existing = {
  name: aksName
  scope: resourceGroup()
}

resource acr 'Microsoft.ContainerRegistry/registries@2021-09-01' existing = {
  name: acrName
  scope: resourceGroup()
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(aks.id, 'acrpull')
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull role
    principalId: aks.identity.principalId
  }
}

output aksName string = aks.name
output acrName string = acr.name
