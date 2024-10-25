
param parentResourceName string
param model object
param name string
resource openAIService 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: parentResourceName
}

resource gpt4Deployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' =  {
  parent: openAIService
  name: name
  sku: {
    name: 'Standard'
    capacity: model.capacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: model.name
      version: model.version
    }
  }
}

output openAIServiceId string = openAIService.id
output deployedModelName string = name
output deployedModelId string = model.name


