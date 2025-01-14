param solutionName string
param solutionLocation string
param identity string

var projectname = solutionName 
// '${solutionName}-aiproject'
resource aiHubProject 'Microsoft.MachineLearningServices/workspaces@2024-01-01-preview' existing = {
  name: projectname
}

var phi3serverlessName = '${solutionName}-phi3-serverless'
resource phi3serverless 'Microsoft.MachineLearningServices/workspaces/serverlessEndpoints@2024-10-01' = {
  parent: aiHubProject
  location: solutionLocation
  name: phi3serverlessName
  properties: {
    authMode: 'Key'
    contentSafety: {
      contentSafetyStatus: 'Enabled'
    }
    modelSettings: {
      modelId: 'azureml://registries/azureml/models/Phi-3-medium-4k-instruct'
    }
  }
  sku: {
    name: 'Consumption'
    tier: 'Basic'
  }
}

output phi3serverlessEndpoint string = phi3serverless.properties.inferenceEndpoint.uri
output phi3serverlessKey string = listKeys(phi3serverless.id, '2024-10-01').primaryKey
