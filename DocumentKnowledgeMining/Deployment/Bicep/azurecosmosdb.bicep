param cosmosDbAccountName string
param location string = resourceGroup().location

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: cosmosDbAccountName
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    apiProperties: {
      serverVersion: '4.2' // Specify the MongoDB server version
    }
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
  }
}

output cosmosDbAccountName string = cosmosDbAccount.name
