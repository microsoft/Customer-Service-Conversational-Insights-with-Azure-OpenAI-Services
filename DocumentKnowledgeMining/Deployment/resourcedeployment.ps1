# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

#https://patorjk.com/software/taag
function startBanner() {
    Write-Host "  _____                                        _                                               "
    Write-Host " |  __ \                                      | |                                              "
    Write-Host " | |  | | ___   ___ _   _ _ __ ___   ___ _ __ | |_                                             "
    Write-Host " | |  | |/ _ \ / __| | | | '_ ` _ \ /  _ \ '_ \| __|                                           "
    Write-Host " | |__| | (_) | (__| |_| | | | | | |  __/ | | | |_                                             "
    Write-Host " |_____/ \___/ \___|\__,_|_| |_| |_|\___|_| |_|\__|  __  __ _       _                          "
    Write-Host " | |/ /                   | |        | |            |  \/  (_)     (_)                         "
    Write-Host " | ' / _ __   _____      _| | ___  __| | __ _  ___  | \  / |_ _ __  _ _ __   __ _              "
    Write-Host " |  < | '_ \ / _ \ \ /\ / / |/ _ \/ _`  |/ _`  |/ _ \ | |\/| | | '_ \| | '_ \ / _`  |          "
    Write-Host " | . \| | | | (_) \ V  V /| |  __/ (_| | (_| |  __/ | |  | | | | | | | | | | (_| |             "
    Write-Host " |_|\_\_| |_|\___/ \_/\_/ |_|\___|\__,_|\__, |\___| |_|  |_|_|_| |_|_|_| |_|\__, |             "
    Write-Host "   _____       _       _   _             __/ |                  _            __/ |             "
    Write-Host "  / ____|     | |     | | (_)           |___/ /\               | |          |___/ |            "
    Write-Host " | (___   ___ | |_   _| |_ _  ___  _ __      /  \   ___ ___ ___| | ___ _ __ __ _| |_ ___  _ __ "
    Write-Host "  \___ \ / _ \| | | | | __| |/ _ \| '_ \    / /\ \ / __/ __/ _ \ |/ _ \ '__/ _` | __/ _  \| '__|"
    Write-Host "  ____) | (_) | | |_| | |_| | (_) | | | |  / ____ \ (_| (_|  __/ |  __/ | | (_| | || (_) | |   "
    Write-Host " |_____/ \___/|_|\__,_|\__|_|\___/|_| |_| /_/    \_\___\___\___|_|\___|_|  \__,_|\__\___/|_|   "
    Write-Host "                                                                                               "
    Write-Host "                                                                                               "
}

#https://patorjk.com/software/taag
function successBanner(){
    Write-Host "   _____                              __       _           "
    Write-Host "  / ____|                            / _|     | |          "
    Write-Host " | (___  _   _  ___ ___ ___  ___ ___| |_ _   _| |          "
    Write-Host "  \___ \| | | |/ __/ __/ _ \/ __/ __|  _| | | | |          "
    Write-Host "  ____) | |_| | (_| (_|  __/\__ \__ \ | | |_| | |          "
    Write-Host " |_____/ \__,_|\___\___\___||___/___/_|  \__,_|_|      _   "
    Write-Host " |  __ \           | |                                | |  "
    Write-Host " | |  | | ___ _ __ | | ___  _   _ _ __ ___   ___ _ __ | |_ "
    Write-Host " | |  | |/ _ \ '_ \| |/ _ \| | | | '_ ` _ \  / _ \ '_ \| __|"
    Write-Host " | |__| |  __/ |_) | | (_) | |_| | | | | | |  __/ | | | |_ "
    Write-Host " |_____/ \___| .__/|_|\___/ \__, |_| |_| |_|\___|_| |_|\__|"
    Write-Host "             | |             __/ |                         "
    Write-Host "             |_|            |___/                          "     
}

# Function to prompt for parameters with kind messages
function PromptForParameters {
    param(
        [string]$subscriptionID,
        [string]$location,
        [string]$modelLocation,
        [string]$email
    )

    Clear-Host

    # Display banner
    
    startBanner

    $availableRegions = @(
        'EastUS', 'EastUS2', 'WestUS', 'WestUS2', 'WestUS3', 'CentralUS', 'NorthCentralUS', 'SouthCentralUS', 
        'WestEurope', 'NorthEurope', 'SoutheastAsia', 'EastAsia', 'JapanEast', 'JapanWest', 
        'AustraliaEast', 'AustraliaSoutheast', 'CentralIndia', 'SouthIndia', 'CanadaCentral', 
        'CanadaEast', 'UKSouth', 'UKWest', 'FranceCentral', 'FranceSouth', 'KoreaCentral', 
        'KoreaSouth', 'GermanyWestCentral', 'GermanyNorth', 'NorwayWest', 'NorwayEast', 
        'SwitzerlandNorth', 'SwitzerlandWest', 'UAENorth', 'UAECentral', 'SouthAfricaNorth', 
        'SouthAfricaWest', 'BrazilSouth', 'BrazilSoutheast', 'QatarCentral', 'ChinaNorth', 
        'ChinaEast', 'ChinaNorth2', 'ChinaEast2'
    )

    $availableModelRegions = @(
        'EastUS', 'EastUS2', 'SwedenCentral', 'WestUS3'
    )

    if (-not $subscriptionID) {
        Write-Host "Please enter your Azure subscription ID to deploy your resources" -ForegroundColor Cyan
        $subscriptionID = Read-Host -Prompt '> '
    }

    if (-not $location) {
        Write-Host "Please enter the Azure Data Center Region to deploy your resources" -ForegroundColor Cyan
        Write-Host "Available regions are:" -ForegroundColor Cyan
        Write-Host ($availableRegions -join ', ') -ForegroundColor Yellow
        $location = Read-Host -Prompt '> '
    }

    if (-not $modelLocation) {
        Write-Host "Please enter the Azure Data Center Region to deploy your GPT model" -ForegroundColor Cyan
        Write-Host "Available regions are:" -ForegroundColor Cyan
        Write-Host ($availableModelRegions -join ', ') -ForegroundColor Yellow
        $modelLocation = Read-Host -Prompt '> '
    }

    if (-not $email) {
        Write-Host "Please enter your email address for certificate management" -ForegroundColor Cyan
        $email = Read-Host -Prompt '> '
    }

    return @{
        subscriptionID = $subscriptionID
        location = $location
        modelLocation = $modelLocation
        email = $email
    }
}

# Prompt for parameters with kind messages
$params = PromptForParameters -subscriptionID $subscriptionID -location $location -modelLocation $modelLocation -email $email
# Assign the parameters to variables
$subscriptionID = $params.subscriptionID
$location = $params.location
$modelLocation = $params.modelLocation
$email = $params.email

function LoginAzure([string]$subscriptionID) {
        Write-Host "Log in to Azure.....`r`n" -ForegroundColor Yellow
        az login
        az account set --subscription $subscriptionID
        Write-Host "Switched subscription to '$subscriptionID' `r`n" -ForegroundColor Yellow
}

function DeployAzureResources([string]$location, [string]$modelLocation) {
    Write-Host "Started Deploying Knowledge Mining Solution Accelerator Service Azure resources.....`r`n" -ForegroundColor Yellow
    
    try {
        # Generate a random number between 0 and 99999
        $randomNumber = Get-Random -Minimum 0 -Maximum 99999
        # Pad the number with leading zeros to ensure it is 5 digits long
        $randomNumberPadded = $randomNumber.ToString("D5")
        # Make deployment name unique by appending random number
        $deploymentName = "KM_SA_Deployment$randomNumberPadded"

        # Perform a what-if deployment to preview changes
        Write-Host "Evaluating Deployment resource availabilities to preview changes..." -ForegroundColor Yellow
        $whatIfResult = az deployment sub what-if --template-file .\main.bicep --location $location --name $deploymentName --parameters modeldatacenter=$modelLocation

        if ($LASTEXITCODE -ne 0) {
            Write-Host "There might be something wrong with your deployment." -ForegroundColor Red
            Write-Host $whatIfResult -ForegroundColor Red
            exit 1            
        }
        # Proceed with the actual deployment
        Write-Host "Proceeding with Deployment..." -ForegroundColor Yellow
        $deploymentResult = az deployment sub create --template-file .\main.bicep --location $location --name $deploymentName --parameters modeldatacenter=$modelLocation

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Deployment failed. Stopping execution." -ForegroundColor Red
            Write-Host $deploymentResult -ForegroundColor Red
            exit 1
        }

        $joinedString = $deploymentResult -join "" 
        $jsonString = ConvertFrom-Json $joinedString 
        
        return $jsonString
    } catch {
        Write-Host "An error occurred during the deployment process:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host $_.InvocationInfo.PositionMessage -ForegroundColor Red
        Write-Host $_.ScriptStackTrace -ForegroundColor Red
        exit 1
    }
}

function DisplayResult([pscustomobject]$jsonString) {
    $resourcegroupName = $jsonString.properties.outputs.gs_resourcegroup_name.value
    $storageAccountName = $jsonString.properties.outputs.gs_storageaccount_name.value
    $azsearchServiceName = $jsonString.properties.outputs.gs_azsearch_name.value
    $aksName = $jsonString.properties.outputs.gs_aks_name.value
    $containerRegistryName = $jsonString.properties.outputs.gs_containerregistry_name.value
    $azcognitiveserviceName = $jsonString.properties.outputs.gs_azcognitiveservice_name.value
    $azopenaiServiceName = $jsonString.properties.outputs.gs_openaiservice_name.value
    $azcosmosDBName = $jsonString.properties.outputs.gs_cosmosdb_name.value
    $azappConfigEndpoint = $jsonString.properties.outputs.gs_appconfig_endpoint.value    

    # Display banner
    Write-Host "********************************************************************************" -ForegroundColor Blue
    Write-Host "*                 Deployed Azure Resources Information                         *" -ForegroundColor Blue
    Write-Host "********************************************************************************" -ForegroundColor Blue
    Write-Host "* Subscription Id: " -ForegroundColor Yellow -NoNewline; Write-Host "$subscriptionID" -ForegroundColor Green
    Write-Host "* Knowledge Mining Digital Asset resource group: " -ForegroundColor Yellow -NoNewline; Write-Host "$resourcegroupName" -ForegroundColor Green
    Write-Host "* Azure Kubernetes Account " -ForegroundColor Yellow -NoNewline; Write-Host "$aksName" -ForegroundColor Green
    Write-Host "* Azure Container Registry " -ForegroundColor Yellow -NoNewline; Write-Host "$containerRegistryName" -ForegroundColor Green
    Write-Host "* Azure Search Service " -ForegroundColor Yellow -NoNewline; Write-Host "$azsearchServiceName" -ForegroundColor Green
    Write-Host "* Azure Open AI Service " -ForegroundColor Yellow -NoNewline; Write-Host "$azopenaiServiceName" -ForegroundColor Green
    Write-Host "* Azure Cognitive Service " -ForegroundColor Yellow -NoNewline; Write-Host "$azcognitiveserviceName" -ForegroundColor Green
    Write-Host "* Azure Storage Account " -ForegroundColor Yellow -NoNewline; Write-Host "$storageAccountName" -ForegroundColor Green
    Write-Host "* Azure Cosmos DB " -ForegroundColor Yellow -NoNewline; Write-Host "$azcosmosDBName" -ForegroundColor Green
    Write-Host "* Azure App Configuration Endpoint " -ForegroundColor Yellow -NoNewline; Write-Host "$azappConfigEndpoint" -ForegroundColor Green
}

# Function to replace placeholders in a template with actual values
function Invoke-PlaceholdersReplacement($template, $placeholders) {
    foreach ($key in $placeholders.Keys) {
        $template = $template -replace $key, $placeholders[$key]
    }
    return $template
}
# Function to get the external IP address of a service
function Get-ExternalIP {
    param (
        [string]$serviceName,
        [string]$namespace
    )
    $externalIP = kubectl get svc $serviceName -n $namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
    return $externalIP
}

# Function to generate a dynamic banner
function Show-Banner {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Title
    )

    # Calculate the banner width based on the title length with padding
    $padding = 6
    $bannerWidth = $Title.Length + ($padding * 2) + 4
    $borderLine = "*" * $bannerWidth

    # Create the padded title
    $borderLength = $borderLine.Length
    $paddedTitle = "* " + (" " * $padding) + $Title + (" " * $padding) + " *"

    # Check if the title length is odd or even and adjust the padding. the boderLine width and the paddedTitle width should be the same
    if ($paddedTitle.Length -lt $borderLength) {
        $paddedTitle += " "
    } else {
        $paddedTitle = $paddedTitle.Substring(0, $bannerWidth - 1) + "*"
    }
    
    # # Check if the title length is odd or even and adjust the padding
    # if ($paddedTitle.Length -lt $borderLength) {
    #     $paddedTitle += " "
    # }
    
    # # Adjust the padded title length to match the banner width
    # $paddedTitle = $paddedTitle.Substring(0, $bannerWidth - 1) + "*"

    # Display the banner
    Write-Host $borderLine -ForegroundColor Blue
    Write-Host $paddedTitle -ForegroundColor Blue
    Write-Host $borderLine -ForegroundColor Blue
}

class DeploymentResult {
    [string]$ResourceGroupName
    [string]$ResourceGroupId
    [string]$StorageAccountName
    [string]$StorageAccountConnectionString
    [string]$AzSearchServiceName
    [string]$AzSearchServicEndpoint
    [string]$AzSearchAdminKey
    [string]$AksName
    [string]$AksMid
    [string]$AzContainerRegistryName
    [string]$AzCognitiveServiceName
    [string]$AzCognitiveServiceKey
    [string]$AzCognitiveServiceEndpoint
    [string]$AzOpenAiServiceName
    [string]$AzGPT4oModelName
    [string]$AzGPT4oModelId
    [string]$AzGPTEmbeddingModelName
    [string]$AzGPTEmbeddingModelId
    [string]$AzOpenAiServiceEndpoint
    [string]$AzOpenAiServiceKey
    [string]$AzCosmosDBName
    [string]$AzCosmosDBConnectionString
    [string]$AzAppConfigEndpoint
    [string]$AzAppConfigName

    DeploymentResult() {
        # Resource Group
        $this.ResourceGroupName = ""
        $this.ResourceGroupId = ""
        # Storage Account
        $this.StorageAccountName = ""
        $this.StorageAccountConnectionString = ""
        # Azure Search
        $this.AzSearchServiceName = ""
        $this.AzSearchServicEndpoint = ""
        $this.AzSearchAdminKey = ""
        # AKS
        $this.AksName = ""
        $this.AksMid = ""
        # Container Registry
        $this.AzContainerRegistryName = ""
        # Cognitive Service - Azure AI Intelligence Document Service
        $this.AzCognitiveServiceName = ""
        $this.AzCognitiveServiceEndpoint = ""
        $this.AzCognitiveServiceKey = ""
        # Open AI Service
        $this.AzOpenAiServiceName = ""
        $this.AzOpenAiServiceEndpoint = ""
        $this.AzOpenAiServiceKey = ""
        # Model - GPT4o
        $this.AzGPT4oModelName = ""
        $this.AzGPT4oModelId = ""
        # Model - Embedding
        $this.AzGPTEmbeddingModelName = ""
        $this.AzGPTEmbeddingModelId = ""
        # Cosmos DB
        $this.AzCosmosDBName = ""
        $this.AzCosmosDBConnectionString = ""
        # App Configuration
        $this.AzAppConfigEndpoint = ""
        # App Config Name
        $this.AzAppConfigName = ""

    }

    [void]MapResult([pscustomobject]$jsonString) {
        # Add your code here
        $this.ResourceGroupName = $jsonString.properties.outputs.gs_resourcegroup_name.value
        $this.ResourceGroupId = $jsonString.properties.outputs.gs_resourcegroup_id.value
        # Storage Account
        $this.StorageAccountName = $jsonString.properties.outputs.gs_storageaccount_name.value
        # Azure Search
        $this.AzSearchServiceName = $jsonString.properties.outputs.gs_azsearch_name.value
        $this.AzSearchServicEndpoint =  "https://$($this.AzSearchServiceName).search.windows.net"
        # Azure Kubernetes
        $this.AksName = $jsonString.properties.outputs.gs_aks_name.value
        $this.AksMid = $jsonString.properties.outputs.gs_aks_serviceprincipal_id.value
        # Azure Container Registry
        $this.AzContainerRegistryName = $jsonString.properties.outputs.gs_containerregistry_name.value

        # Azure Cognitive Service - Azure AI Document Intelligence Service
        $this.AzCognitiveServiceName = $jsonString.properties.outputs.gs_azcognitiveservice_name.value
        $this.AzCognitiveServiceEndpoint = $jsonString.properties.outputs.gs_azcognitiveservice_endpoint.value

        # Azure Open AI Service
        $this.AzOpenAiServiceName = $jsonString.properties.outputs.gs_openaiservice_name.value
        $this.AzOpenAiServiceEndpoint = $jsonString.properties.outputs.gs_openaiservice_endpoint.value
        $this.AzOpenAiServiceKey = $jsonString.properties.outputs.gs_openaiservice_key.value
        # Azure Cosmos DB
        $this.AzCosmosDBName = $jsonString.properties.outputs.gs_cosmosdb_name.value
        # Azure Open AI Service Models
        $this.AzGPT4oModelName = $jsonString.properties.outputs.gs_openaiservicemodels_gpt4o_model_name.value
        $this.AzGPT4oModelId = $jsonString.properties.outputs.gs_openaiservicemodels_gpt4o_model_id.value
        $this.AzGPTEmbeddingModelName = $jsonString.properties.outputs.gs_openaiservicemodels_text_embedding_model_name.value
        $this.AzGPTEmbeddingModelId = $jsonString.properties.outputs.gs_openaiservicemodels_text_embedding_model_id.value
        # Azure App Configuration
        $this.AzAppConfigEndpoint = $jsonString.properties.outputs.gs_appconfig_endpoint.value
        # App Config Name 
        $this.AzAppConfigName = "appconfig" + $this.ResourceGroupName

    }
}

function Check-Docker {
    try {
         # Try to get Docker info to check if Docker daemon is running
         $dockerInfo = docker info 2>&1
        if ($dockerInfo -match "ERROR: error during connect") {
            return $false
        } else {
            return $true
        }
    } catch {
        Write-Host "An error occurred while checking Docker status." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $false    }
}

# Check if Docker is running before proceeding
if (-not (Check-Docker)) {
    Write-Host "Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

###########################################################################
#
# Deployment Main Script
#
###########################################################################

try {
    ###############################################################
    # Step 1 : Deploy Azure resources
    Show-Banner -Title "Step 1 : Deploy Azure resources"
    ###############################################################
    $deploymentResult = [DeploymentResult]::new()
    LoginAzure($subscriptionID)
    # Deploy Azure Resources
    Write-Host "Deploying Azure resources in $location region.....`r`n" -ForegroundColor Yellow

    $resultJson = DeployAzureResources -location $location -modelLocation $modelLocation
    # Map the deployment result to DeploymentResult object
    $deploymentResult.MapResult($resultJson)
    # Display the deployment result
    DisplayResult($resultJson)

    ###############################################################
    # Step 2 : Get Secrets from Azure resources
    Show-Banner -Title "Step 2 : Get Secrets from Azure resources"
    ###############################################################
    # Get the storage account key
    $storageAccountKey = az storage account keys list --account-name $deploymentResult.StorageAccountName --resource-group $deploymentResult.ResourceGroupName --query "[0].value" -o tsv
    ## Construct the connection string manually
    $storageAccountConnectionString = "DefaultEndpointsProtocol=https;AccountName=$($deploymentResult.StorageAccountName);AccountKey=$storageAccountKey;EndpointSuffix=core.windows.net"
    ## Assign the connection string to the deployment result object
    $deploymentResult.StorageAccountConnectionString = $storageAccountConnectionString    
    # Get MongoDB connection string
    $deploymentResult.AzCosmosDBConnectionString = az cosmosdb keys list --name $deploymentResult.AzCosmosDBName --resource-group $deploymentResult.ResourceGroupName --type connection-strings --query "connectionStrings[0].connectionString" -o tsv
    # Get Azure Cognitive Service API Key
    $deploymentResult.AzCognitiveServiceKey = az cognitiveservices account keys list --name $deploymentResult.AzCognitiveServiceName --resource-group $deploymentResult.ResourceGroupName --query "key1" -o tsv
    # Get Azure Search Service Admin Key
    $deploymentResult.AzSearchAdminKey = az search admin-key show --service-name $deploymentResult.AzSearchServiceName --resource-group $deploymentResult.ResourceGroupName --query "primaryKey" -o tsv
    # Get Azure Open AI Service API Key
    $deploymentResult.AzOpenAiServiceKey = az cognitiveservices account keys list --name $deploymentResult.AzOpenAiServiceName --resource-group $deploymentResult.ResourceGroupName --query "key1" -o tsv

    Write-Host "Secrets have been retrieved successfully." -ForegroundColor Green

    ######################################################################################################################
    # Step 3 : Update App Configuration files with Secrets and information for AI Service and Kernel Memory Service.
    Show-Banner -Title "Step 3 : Update App Configuration files with Secrets and information for AI Service and Kernel Memory Service."
    ######################################################################################################################
    # Step 3-1 Loading aiservice's configution file template then replace the placeholder with the actual values
    # Define the placeholders and their corresponding values for AI service configuration
    
    $aiServicePlaceholders = @{
        '{gpt-4o-mini-endpoint}' = $deploymentResult.AzOpenAiServiceEndpoint
        '{gpt-4o-mini-apikey}' = $deploymentResult.AzOpenAiServiceKey
        '{azureaisearch-apikey}' = $deploymentResult.AzSearchAdminKey
        '{documentintelligence-apikey}' = $deploymentResult.AzCognitiveServiceKey 
        '{cosmosmongo-connection-string}' = $deploymentResult.AzCosmosDBConnectionString 
        '{azureblobs-connection-string}' = $deploymentResult.StorageAccountConnectionString 
        '{azureblobs-account}' = $deploymentResult.StorageAccountName
        '{azureaisearch-endpoint}' = $deploymentResult.AzSearchServicEndpoint 
        '{gpt-4o-mini-modelname}' = $deploymentResult.AzGPT4oModelId  
        '{gpt-4o-endpoint}' =  $deploymentResult.AzOpenAiServiceEndpoint 
        '{textembedding-endpoint}' = $deploymentResult.AzOpenAiServiceEndpoint
        '{azureopenaiembedding-endpoint}' = $deploymentResult.AzOpenAiServiceEndpoint
        '{azureopenaitext-endpoint}' = $deploymentResult.AzOpenAiServiceEndpoint
        '{azureopenaitext-deployment}' = $deploymentResult.AzGPT4oModelId 
        '{gpt-4o-key}' = $deploymentResult.AzOpenAiServiceKey
        '{textembedding-key}' = $deploymentResult.AzOpenAiServiceKey
        '{azureopenaiembedding-apikey}' = $deploymentResult.AzOpenAiServiceKey
        '{azureopenaitext-apikey}' = $deploymentResult.AzOpenAiServiceKey
        '{textembedding-modelname}' = $deploymentResult.AzGPTEmbeddingModelName
        '{azureaidocintel-apikey}' =  $deploymentResult.AzCognitiveServiceKey 
        '{cosmosmongo-chat-history-collection}' = "ChatHistory"
        '{cosmosmongo-chat-history-database}' = "DPS"
        '{cosmosmongo-document-manager-collection}' = "Documents"
        '{cosmosmongo-document-manager-database}' = "DPS"
        '{azureaidocintel-endpoint}' = $deploymentResult.AzCognitiveServiceEndpoint 
        '{documentintelligence-endpoint}' = $deploymentResult.AzCognitiveServiceEndpoint 
        '{azureblobs-container}' = "smemory"
        '{azurequeues-account}' = $deploymentResult.StorageAccountName
        '{azurequeues-connection-string}' = $deploymentResult.StorageAccountConnectionString
        '{gpt-4o-modelname}' = $deploymentResult.AzGPT4oModelName 
        '{azureopenaiembedding-deployment}' = $deploymentResult.AzGPTEmbeddingModelName 
        '{kernelmemory-endpoint}' = "http://kernelmemory-service" 
        }

    ## Load and update the AI service configuration template
    $aiServiceConfigTemplate = Get-Content -Path .\appconfig\aiservice\appconfig.jsonl -Raw
    $aiServiceConfigTemplate = Invoke-PlaceholdersReplacement $aiServiceConfigTemplate $aiServicePlaceholders

    ## Save the updated AI service configuration file
    $aiServiceConfigPath = ".\appconfig\aiservice\appsettings.dev.jsonl"
    $aiServiceConfigTemplate | Set-Content -Path $aiServiceConfigPath -Force
    Write-Host "Knowledge Mining Solution Accelerator Service Application Configuration file has been updated successfully." -ForegroundColor Green

    ## Set error action preference to silently continue
    $ErrorActionPreference = "SilentlyContinue"
    ## Get the current script directory dynamically
    $scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition

    ## Construct the relative path to the JSON file
    $filePath = Join-Path $scriptDirectory ".\appconfig\aiservice\appsettings.dev.jsonl"

    ## Other variables
    $appConfigName = $deploymentResult.AzAppConfigName -replace "rg-", "-"

    ## Output the file path for verification
    #write-host "Using file path: $filePath"

    ## Execute the az appconfig kv import command using PowerShell
    az appconfig kv import `
        --name $appConfigName `
        --source file `
        --path $filePath `
        --format json `
        --separator "," `
        --content-type "application/x-ndjson" `
        --yes

    ## Check if the file exists and delete it
    if (Test-Path $aiServiceConfigPath) {
        Remove-Item $aiServiceConfigPath -Force
        #Write-Host "File '$aiServiceConfigPath' has been deleted."
    } else {
        Write-Host "File '$aiServiceConfigPath' does not exist."
    }
    $ErrorActionPreference = "Continue"

    
    ######################################################################################################################
    # Step 4 : Configure Kubernetes Infrastructure
    Show-Banner -Title "Step 4 : Configure Kubernetes Infrastructure"
    ######################################################################################################################
    # 0. Attach Container Registry to AKS
    Write-Host "Attach Container Registry to AKS" -ForegroundColor Green

    $maxRetries = 10
    $retryCount = 0
    $delay = 30 # Delay in seconds

    while ($retryCount -lt $maxRetries) {
        try {
            # Attempt to update the AKS cluster
            az aks update --name $deploymentResult.AksName --resource-group $deploymentResult.ResourceGroupName --attach-acr $deploymentResult.AzContainerRegistryName
            Write-Host "AKS cluster updated successfully."
            break
        } catch {
            $errorMessage = $_.Exception.Message
            if ($errorMessage -match "OperationNotAllowed" -and $errorMessage -match "Another operation \(Updating\) is in progress") {
                Write-Host "Operation not allowed: Another operation is in progress. Retrying in $delay seconds..."
                Start-Sleep -Seconds $delay
                $retryCount++
            } else {
                Write-Host "An unexpected error occurred: $errorMessage" -ForegroundColor Red
                throw $_
            }
        }
    }

    if ($retryCount -eq $maxRetries) {
        Write-Host "Max retries reached. Failed to update the AKS cluster." -ForegroundColor Red
        exit 1
    }
    
    #az aks update --name $deploymentResult.AksName --resource-group $deploymentResult.ResourceGroupName --attach-acr $deploymentResult.AzContainerRegistryName
    $kubenamespace = "ns-km"

    # 1. Get the Kubernetes resource group
    try {
        Write-Host "Getting the Kubernetes resource group..." -ForegroundColor Cyan
        $aksResourceGroupName = $(az aks show --resource-group $deploymentResult.ResourceGroupName --name $deploymentResult.AksName --query nodeResourceGroup --output tsv)
        Write-Host "Kubernetes resource group: $aksResourceGroupName" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to get the Kubernetes resource group." -ForegroundColor Red
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
        exit 1
    }


    # 2.Connect to AKS cluster
    try {
        Write-Host "Connecting to AKS cluster..." -ForegroundColor Cyan
        az aks get-credentials --resource-group $deploymentResult.ResourceGroupName --name $deploymentResult.AksName --overwrite-existing
        Write-Host "Connected to AKS cluster." -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to connect to AKS cluster." -ForegroundColor Red
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
        exit 1
    }
    
    # 3.Create namespace for AI Service
    kubectl create namespace $kubenamespace
    
    Write-Host "Enable Add routing addon for AKS" -ForegroundColor Yellow
    
    # 4.approuting enable and enable addons for http_application_routing
    try {
        Write-Host "Enabling application routing addon for AKS..." -ForegroundColor Cyan
        Import-Module .\kubernetes\enable_approuting.psm1
        Enable-AppRouting -ResourceGroupName $deploymentResult.ResourceGroupName -ClusterName $deploymentResult.AksName
        Write-Host "Application routing addon enabled." -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to enable application routing addon." -ForegroundColor Red
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
        exit 1
    }
    
    # 5. Get the public IP address for the default public ingress controller
    #    https://learn.microsoft.com/en-us/azure/aks/app-routing

    $appRoutingNamespace = "app-routing-system"
    while ($true) {
        $externalIP = Get-ExternalIP -serviceName 'nginx' -namespace $appRoutingNamespace
        if ($externalIP -and $externalIP -ne "<none>") {
            Write-Host "Get EXTERNAL-IP for nginx in $appRoutingNamespace namespace is: $externalIP"
            break
        } else {
            Write-Host "Waiting for EXTERNAL-IP to be assigned..."
            Start-Sleep -Seconds 10
        }
    }

    # 6. Assign DNS Name to the public IP address
    #  6-1. Get Az Network resource Name with the public IP address
    Write-Host "Assign DNS Name to the public IP address" -ForegroundColor Green
    $publicIpName=$(az network public-ip list --query "[?ipAddress=='$externalIP'].name" --output tsv)

    #  6-2. Generate Unique backend API fqdn Name - esgdocanalysis-3 digit random number with padding 0
    $dnsName = "kmgs$($(Get-Random -Minimum 0 -Maximum 9999).ToString("D4"))"

    #  6-3. Assign DNS Name to the public IP address
    az network public-ip update --resource-group $aksResourceGroupName --name $publicIpName --dns-name $dnsName
    #  6-4. Get FQDN for the public IP address    
    $fqdn = az network public-ip show --resource-group $aksResourceGroupName --name $publicIpName --query "dnsSettings.fqdn" --output tsv
    Write-Host "FQDN for the public IP address is: $fqdn" -ForegroundColor Green

    # 7. Assign the role for aks system assigned managed identity to App Configuration Data Reader role with the scope of Resourcegroup
    Write-Host "Assign the role for aks system assigned managed identity to App Configuration Data Reader role" -ForegroundColor Green
    # Get vmss resource group name
    $vmssResourceGroupName = $(az aks show --resource-group $deploymentResult.ResourceGroupName --name $deploymentResult.AksName --query nodeResourceGroup --output tsv)
    # Get vmss name
    $vmssName = $(az vmss list --resource-group $vmssResourceGroupName --query "[0].name" --output tsv)
    # Create System Assigned Managed Identity
    $systemAssignedIdentity = $(az vmss identity assign --resource-group $vmssResourceGroupName --name $vmssName --query systemAssignedIdentity --output tsv)
    
    
    
    # Assign the role for aks system assigned managed identity to App Configuration Data Reader role with the scope of Resourcegroup
    az role assignment create --assignee $systemAssignedIdentity --role "App Configuration Data Reader" --scope $deploymentResult.ResourceGroupId

    # Assign the role for aks system assigned managed identity to Azure blob storage Data Contributor role with the scope of Storage Account
    Write-Host "Assign the role for aks system assigned managed identity to App Storage Blob Data Contributor role" -ForegroundColor Green
    az role assignment create --assignee $systemAssignedIdentity --role "Storage Blob Data Contributor" --scope "/subscriptions/$subscriptionID/resourceGroups/$($deploymentResult.ResourceGroupName)/providers/Microsoft.Storage/storageAccounts/$($deploymentResult.StorageAccountName)"

    # Assign the role for aks system assigned managed identity to Azure Queue Data Contributor role with the scope of Storage Account
    Write-Host "Assign the role for aks system assigned managed identity to App Storage Queue Data Contributor role" -ForegroundColor Green
    az role assignment create --assignee $systemAssignedIdentity --role "Storage Queue Data Contributor" --scope "/subscriptions/$subscriptionID/resourceGroups/$($deploymentResult.ResourceGroupName)/providers/Microsoft.Storage/storageAccounts/$($deploymentResult.StorageAccountName)"

    # 8. Update aks nodepools to updated new role
    try {
        Write-Host "Upgrading node pools..." -ForegroundColor Cyan
        $nodePools = $(az aks nodepool list --resource-group $deploymentResult.ResourceGroupName --cluster-name $deploymentResult.AksName --query [].name --output tsv)
        foreach ($nodePool in $nodePools) {
            Write-Host "Upgrading node pool: $nodePool" -ForegroundColor Cyan
            Write-Host "Node pool $nodePool upgrade initiated." -ForegroundColor Green
            az aks nodepool upgrade --resource-group $deploymentResult.ResourceGroupName --cluster-name $deploymentResult.AksName --name $nodePool 
        }
    }
    catch {
        Write-Host "Failed to upgrade node pools." -ForegroundColor Red
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host $_.Exception.StackTrace -ForegroundColor Red
        exit 1
    }

    #########################################################################################################################################
    # Step 5 : Update Kubernetes configuration files with the FQDN, Container Image Path and Email address for the certificate management
    #Write-Host "Step 5 : Update Kubernetes yaml files with Container Image Path and Email address for the certificate management" -ForegroundColor Yellow
    Show-Banner -Title "Step 5 : Update Kubernetes yaml files with Container Image Path and Email address for the certificate management"
    #########################################################################################################################################

    # 5.1 Update deploy.certclusterissuer.yaml.template file and save as deploy.certclusterissuer.yaml
    $certManagerTemplate = Get-Content -Path .\kubernetes\deploy.certclusterissuer.yaml.template -Raw
    $certManagerTemplate = $certManagerTemplate -replace '{{ your-email }}', $email
    $certManagerPath = ".\kubernetes\deploy.certclusterissuer.yaml"
    $certManagerTemplate | Set-Content -Path $certManagerPath -Force

    # 5.2 Update deploy.ingress.yaml.template file and save as deploy.ingress.yaml
    # webfront / apibackend
    $ingressPlaceholders = @{
        '{{ fqdn }}' = $fqdn
    }

    $ingressTemplate = Get-Content -Path .\kubernetes\deploy.ingress.yaml.template -Raw
    $ingress = Invoke-PlaceholdersReplacement $ingressTemplate $ingressPlaceholders
    $ingressPath = ".\kubernetes\deploy.ingress.yaml"
    $ingress | Set-Content -Path $ingressPath -Force
    Write-Host "Ingress Controller configuration file have been updated successfully." -ForegroundColor Green


    # 5.3 Update deploy.deployment.yaml.template file and save as deploy.deployment.yaml
    ## Define Image Tags
    $acrNamespace = "kmgs"
    $acrAIServiceTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/aiservice"
    $acrKernelMemoryTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/kernelmemory"
    $acrFrontAppTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/frontapp"


    $deploymentTemplatePlaceholders = @{
        '{{ aiservice-imagepath }}' = $acrAIServiceTag
        '{{ kernelmemory-imagepath }}' = $acrKernelMemoryTag
        '{{ frontapp-imagepath }}' = $acrFrontAppTag
    }

    $deploymentTemplate = Get-Content -Path .\kubernetes\deploy.deployment.yaml.template -Raw
    $deployment = Invoke-PlaceholdersReplacement $deploymentTemplate $deploymentTemplatePlaceholders
    $deploymentPath = ".\kubernetes\deploy.deployment.yaml"
    $deployment | Set-Content -Path $deploymentPath -Force

    ########################################################################################################################################################
    # Step 6 : Configure AKS (deploy Cert Manager, Ingress Controller) and Deploy Images on the kubernetes cluster
    #Write-Host "Step 6 : Configure AKS (deploy Cert Manager) and Deploy Images on the kubernetes cluster" -ForegroundColor Yellow
    Show-Banner -Title "Step 6 : Configure AKS (deploy Cert Manager) and Deploy Images on the kubernetes cluster"
    ########################################################################################################################################################
    function Wait-ForCertManager {
        Write-Host "Waiting for Cert-Manager to be ready..." -ForegroundColor Cyan
        while ($true) {
            $certManagerPods = kubectl get pods -n cert-manager -l app.kubernetes.io/instance=cert-manager -o jsonpath='{.items[*].status.phase}'
            if ($certManagerPods -eq "Running Running Running") {
                Write-Host "Cert-Manager is running." -ForegroundColor Green
                break
            } else {
                Write-Host "Cert-Manager is not ready yet. Waiting..." -ForegroundColor Yellow
                Start-Sleep -Seconds 10
            }
        }
    }
    
    Write-Host "Deploying Cert Manager" -ForegroundColor Green
    # 6.1. Install Cert Manager and nginx ingress controller in Kubernetes for SSL/TLS certificate
    # Install Cert-Manager
    Write-Host "Deploying...." -ForegroundColor Green
    helm repo add jetstack https://charts.jetstack.io --force-update
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml
    
    # Wait for Cert-Manager to be ready
    Wait-ForCertManager


#======================================================================================================================================================================
    # App Deployment after finishing the AKS infrastructure setup
    
    $appConfigServicePlaceholders = @{
        '{{ appconfig-url }}' = $deploymentResult.AzAppConfigEndpoint
    }

    ##############################
    # Kernel Memory Service
    ##############################
    ## Load and update the kernel memory service configuration template
    $kernelMemoryServiceConfigTemplate = Get-Content -Path .\appconfig\kernelmemory\appsettings.Development.json.template -Raw
    $kernelMemoryServiceConfigTemplate = Invoke-PlaceholdersReplacement $kernelMemoryServiceConfigTemplate $appConfigServicePlaceholders

    ## Save the updated kernel memory service configuration file
    $kernelMemoryServiceConfigPath = ".\appconfig\kernelmemory\appsettings.Development.json"
    $kernelMemoryServiceConfigTemplate | Set-Content -Path $kernelMemoryServiceConfigPath -Force
    Write-Host "Kernel Memory Service Application Configuration file has been updated successfully." -ForegroundColor Green
        
    ###############################
    # AI service
    ###############################
    ## Load and update the ai service configuration template
    $aiServiceConfigTemplate = Get-Content -Path .\appconfig\aiservice\appsettings.Development.json.template -Raw
    $aiServiceConfigTemplate = Invoke-PlaceholdersReplacement $aiServiceConfigTemplate $appConfigServicePlaceholders

    ## Save the updated kernel memory service configuration file
    $aiServiceConfigPath = ".\appconfig\aiservice\appsettings.Development.json"
    $aiServiceConfigTemplate | Set-Content -Path $aiServiceConfigPath -Force
    Write-Host "AI Service Application Configuration file has been updated successfully." -ForegroundColor Green

    ###############################
    # Front App
    ###############################
    
    $frontAppConfigServicePlaceholders = @{
        '{{ backend-fqdn }}' = "https://${fqdn}/backend"
    }
    
    ## Load and update the front app configuration template
    $frontAppConfigTemplate = Get-Content -Path .\appconfig\frontapp\.env.template -Raw
    $frontAppConfigTemplate = Invoke-PlaceholdersReplacement $frontAppConfigTemplate $frontAppConfigServicePlaceholders

    ## Save the updated front app configuration file
    $frontAppConfigPath = ".\appconfig\frontapp\.env"
    $frontAppConfigTemplate | Set-Content -Path $frontAppConfigPath -Force
    Write-Host "Front App Application Configuration file has been updated successfully." -ForegroundColor Green

    # Step 3-3 Copy the configuration files to the source folders
    ## Copy two configuration files to each source folder
    Write-Host "Copying the configuration files to the source folders" -ForegroundColor Green
    Copy-Item -Path $aiServiceConfigPath -Destination "..\App\backend-api\Microsoft.GS.DPS.Host\appsettings.Development.json" -Force
    Copy-Item -Path $kernelMemoryServiceConfigPath -Destination "..\App\kernel-memory\service\Service\appsettings.Development.json" -Force
    Copy-Item -Path $frontAppConfigPath -Destination "..\App\frontend-app\.env" -Force

    ######################################################################################################################
    # Step 7 : docker build and push container images to Azure Container Registry
    Show-Banner -Title "Step 7 : docker build and push container images to Azure Container Registry"
    ######################################################################################################################
    # $acrNamespace = "kmgs"
    # $acrAIServiceTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/aiservice"
    # $acrKernelMemoryTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/kernelmemory"
    # $acrFrontAppTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/frontapp"

    # 1. Login to Azure Container Registry
    az acr login --name $deploymentResult.AzContainerRegistryName
    
    # $acrNamespace = "kmgs"
    # 2. Build and push the images to Azure Container Registry
    #  2-1. Build and push the AI Service container image to  Azure Container Registry
    #$acrAIServiceTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/aiservice"
    docker build ..\App\backend-api\. --no-cache -t $acrAIServiceTag
    docker push $acrAIServiceTag

    #  2-2. Build and push the Kernel Memory Service container image to Azure Container Registry
    #$acrKernelMemoryTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/kernelmemory"
    docker build ..\App\kernel-memory\. --no-cache -t $acrKernelMemoryTag
    docker push $acrKernelMemoryTag

    #  2-3. Build and push the Frontend App Service container image to Azure Container Registry
    #$acrFrontAppTag = "$($deploymentResult.AzContainerRegistryName).azurecr.io/$acrNamespace/frontapp"
    docker build ..\App\frontend-app\. --no-cache -t $acrFrontAppTag
    docker push $acrFrontAppTag

#======================================================================================================================================================================

    # 7.2. Deploy ClusterIssuer in Kubernetes for SSL/TLS certificate
    kubectl apply -f .\kubernetes\deploy.certclusterissuer.yaml

    # 7.3. Deploy Deployment in Kubernetes
    kubectl apply -f .\kubernetes\deploy.deployment.yaml -n $kubenamespace

    # 7.4. Deploy Services in Kubernetes
    kubectl apply -f .\kubernetes\deploy.service.yaml -n $kubenamespace

    # 7.5. Deploy Ingress Controller in Kubernetes for external access
    kubectl apply -f .\kubernetes\deploy.ingress.yaml -n $kubenamespace

    # #####################################################################
    # # Data file uploading
    # Show-Banner -Title "Step 9 : Sample Data Uploading to the Backend API - https://${fqdn}/backend/Documents/ImportDocument"
    # #####################################################################
    # Import-Module .\send-filestoendpoint.psm1
    # Send-FilesToEndpoint -DataFolderPath "..\Data" -EndpointUrl "https://${fqdn}/backend/Documents/ImportDocument"


    #####################################################################
    # Step 8 : Display the deployment result and following instructions
    #####################################################################
    #Write-Host "Deployment has been completed successfully." -ForegroundColor Green
    successBanner

    $messageString = "Please find the deployment details below: `r`n" +
                    "1. Check Front Web Application with this URL - https://${fqdn} `n`r" +
                    "2. Check GPT Model's TPM rate in your resource group - $($deploymentResult.ResourceGroupName) `n`r" +
                    "Please set each value high as much as you can set`n`r" +
                    "`t- Open AI Resource Name - $($deploymentResult.AzOpenAiServiceName) `n`r" +
                    "`t- GPT4o Model - $($deploymentResult.AzGPT4oModelName) `n`r" +
                    "`t- GPT Embedding Model - $($deploymentResult.AzGPTEmbeddingModelName) `n`r"
    Write-Host $messageString -ForegroundColor Yellow
    Write-Host "Don't forget to control the TPM rate for your GPT and Embedding Model in Azure Open AI Studio Deployments section." -ForegroundColor Red
    Write-Host "After controlling the TPM rate for your GPT and Embedding Model, let's start Data file import process with this command." -ForegroundColor Yellow
    Write-Host ".\uploadfiles.ps1 -EndpointUrl https://${fqdn}" -ForegroundColor Green
}
catch {
    Write-Host "An error occurred during deployment." -ForegroundColor Red
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.Exception.StackTrace -ForegroundColor Red
}

