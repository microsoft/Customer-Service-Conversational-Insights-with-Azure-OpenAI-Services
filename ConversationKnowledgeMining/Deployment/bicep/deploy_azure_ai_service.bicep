@minLength(3)
@maxLength(15)
@description('Solution Name')
param solutionName string
param solutionLocation string

param accounts_byc_cogser_name string = '${ solutionName }-cogser'

resource accounts_byc_cogser_name_resource 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: accounts_byc_cogser_name
  location: solutionLocation
  sku: {
    name: 'S0'
  }
  kind: 'CognitiveServices'
  identity: {
    type: 'None'
  }
  properties: {
    apiProperties: {}
    customSubDomainName: accounts_byc_cogser_name
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
  }
}

var cogServiceKey = accounts_byc_cogser_name_resource.listKeys().key1

output cogSearchOutput object = {
cogServiceName:accounts_byc_cogser_name_resource.name
cogServiceKey : cogServiceKey
cogServiceEndpoint: accounts_byc_cogser_name_resource.properties.endpoint
cogServiceRegion: accounts_byc_cogser_name_resource.location
}
