using './deploy_managed_identity.bicep'

param solutionName = ''
param solutionLocation = ''
param miName = '${solutionName }-managed-identity'

