param searchServiceName string
param location string

resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: searchServiceName
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
  }
}

output searchServiceName string = searchService.name
output searchServiceId string = searchService.id

