param cognitiveServiceName string
param location string = resourceGroup().location

resource cognitiveService 'Microsoft.CognitiveServices/accounts@2022-03-01' = {
  name: cognitiveServiceName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 's0'
  }
  kind: 'FormRecognizer'
  properties: {
  }
}

output cognitiveServiceId string = cognitiveService.id
output cognitiveServiceName string = cognitiveService.name
output cognitiveServiceEndpoint string = cognitiveService.properties.endpoint
