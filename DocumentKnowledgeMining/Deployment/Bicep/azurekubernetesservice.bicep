// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

@description('Provide a globally unique name of your Azure kubernetes Cluster')
param aksName string = 'aks-'

@description('Provide a location for aks.')
param location string = resourceGroup().location

resource aks 'Microsoft.ContainerService/managedClusters@2024-05-01' = {
  name: aksName
  location: location

  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    dnsPrefix: aksName
    enableRBAC: true
    kubernetesVersion: '1.30.4'
    agentPoolProfiles: [
      {
        name: 'agentpool'
        count: 2
        vmSize: 'Standard_D4ds_v5'
        mode: 'System'
        osType: 'Linux'
        type: 'VirtualMachineScaleSets'
      }
    ]
    }
}



output createdAksName string = aksName
output createdServicePrincipalId string = aks.identity.principalId
output createdAksId string = aks.id
