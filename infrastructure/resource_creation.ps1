# Azure Login
az login

# Load Config
$config = Get-Content '.\config.json' | ConvertFrom-Json


# Subscription selection
$subscription_id = $config.subscription_id
az account set --subscription $subscription_id


# Variable setting
    # Resource Group
    $resource_group = $config.resource_group
    $location = $config.location
    
    # Azure Storage Account
    $storage_account = $config.storage_account
    $access_tier = $config.access_tier
    $kind = $config.kind
    $cognitive_search_data_source_container = $config.cognitive_search_data_source_container
    $telemetry_raw_data_container = $config.telemetry_raw_data_container

    # Azure Functions
    $function = $config.function

    #Azure Bot Service
    $cognitive_services = $config.cognitive_services
    $cognitive_services_kind = $config.cognitive_services_kind

    # Azure Cognitive Search
    $cognitive_search = $config.cognitive_search
    $cognitive_search_sku = $config.cognitive_search_sku
    $cognitive_search_api_Version = $config.cognitive_search_api_Version
    $cognitive_search_index = $config.cognitive_search_index
    
  
    $cognitive_search_skillset = $config.cognitive_search_skillset
    $cognitive_search_knowledge_store_container_object = $config.cognitive_search_knowledge_store_container_object
    $cognitive_search_knowledge_store_container_files = $config.cognitive_search_knowledge_store_container_files
    $cognitive_search_knowledge_store_table_document = $config.cognitive_search_knowledge_store_table_document
    $cognitive_search_knowledge_store_table_keyphrases = $config.cognitive_search_knowledge_store_table_keyphrases
    
    $cognitive_search_indexer = $config.cognitive_search_indexer



# Create Resource Group
az group create --location $location --name $resource_group


# Azure Storage Account 
    # Create Storage Account
    az storage account create --name $storage_account --resource-group $resource_group --access-tier $access_tier --kind $kind

        # Create a container to store continuos export from Application Insights
        az storage container create --account-name $storage_account --name $cognitive_search_data_source_container        
        az storage container create --account-name $storage_account --name $telemetry_raw_data_container

    # Get Connection String
    $storage_connection_string = az storage account show-connection-string -n $storage_account -g $resource_group --query connectionString --output tsv

# Azure Functions
az functionapp create --resource-group $resource_group --os-type Linux --consumption-plan-location $location --runtime python --runtime-version 3.7 --functions-version 3 --name $function --storage-account $storage_account

# Cognitive Services
    # Create Cognitive Services
    az cognitiveservices account create --kind $cognitive_services_kind --location $location --name $cognitive_services --resource-group $resource_group --sku S0 --yes

    $cognitive_services_key = az cognitiveservices account keys list --resource-group $resource_group --name $cognitive_services --query key1 -o tsv

# Deploy Azure Function
Start-Sleep -Seconds 60 
Set-Location ..\GBB.ConversationalKM.Python

$function_config = Get-Content '.\TelemetryDataExtractor\function.json' | ConvertFrom-Json
$function_config.bindings[0].path = $telemetry_raw_data_container + "/{name}"
$function_config = $function_config | ConvertTo-Json -Depth 3
Set-Content -Path '.\TelemetryDataExtractor\function.json' -Value $function_config

func azure functionapp publish $function
#func azure functionapp publish $function --publish-local-settings -o --overwrite-settings -y
Set-Location ..\infrastructure


# Read AppSetting for Azure Function
Set-Location ..\GBB.ConversationalKM.Python
$appsettings = Get-Content '.\local.settings.json' | ConvertFrom-Json

$appsettings.Values.AzureWebJobsStorage = $storage_connection_string
$appsettings.Values.dimensions = $config.appsettings.dimensions
$appsettings.Values.defined_events = $config.appsettings.defined_events
$appsettings.Values.conversationalkm_STORAGE = $storage_connection_string
$appsettings.Values.telemetry_processed = $config.cognitive_search_data_source_container
$appsettings.Values.COGNITIVE_SERVICES_API = $cognitive_services_key
$appsettings.Values.profanity_lang = $config.appsettings.profanity_lang
$appsettings.Values.cognitive_services_region = $config.location
$appsettings.Values.ner_hotel_file = $config.appsettings.ner_hotel_file
$appsettings.Values.table_sample_data = $config.table_sample_data

$appsettings = $appsettings | ConvertTo-Json -Depth 3

Set-Content -Path '.\local.settings.json' -Value $appsettings

func azure functionapp publish $function --publish-local-settings -o --overwrite-settings -y

Set-Location ..\infrastructure


# Get Function URLs for Azure Cognitive Search Skillset 
$func_data = func azure functionapp list-functions $function --show-keys

$func_url = @{}
for ($i = 0; $i -le $func_data.Count -1 ; $i++){
    If ($func_data[$i].Contains("[httpTrigger]")){
        $func_url[$func_data[$i].Trim().Replace(" - [httpTrigger]", "")] = $func_data[$i+1].Trim().Replace("Invoke url: ","")
    }
}


# Azure Cognitive Search
    # Create Cognitive Search
    az search service create --name $cognitive_search --resource-group $resource_group --sku $cognitive_search_sku
  

        # Get Azure Cogntive Search Key
        $cognitive_search_key = az search admin-key show --resource-group $resource_group --service-name $cognitive_search -o tsv --query primaryKey

        # Azure Cognitive Search Request Header and Parameters
        $header = @{'Content-Type' = 'application/json'; 'api-key' = $cognitive_search_key}

            # Create Data Source
            #POST https://[service name].search.windows.net/datasources?api-version=[api-version]  
            #    Content-Type: application/json  
            #    api-key: [admin key]  

            $connection_string = az storage account show-connection-string --resource-group $resource_group --name $storage_account --query connectionString -o tsv

            $json_datasource = Get-Content '.\datasource.json' | ConvertFrom-Json
            $json_datasource.name = $storage_account
            $json_datasource.credentials.connectionString = $connection_string
            $json_datasource.container.name = $cognitive_search_data_source_container
            $json_datasource = $json_datasource | ConvertTo-Json

            $cognitive_search_api_endpoint_datasource = "https://"+ $cognitive_search + ".search.windows.net/datasources?api-version=" + $cognitive_search_api_Version
            Invoke-WebRequest -Uri $cognitive_search_api_endpoint_datasource -Method 'POST'  -Body $json_datasource -Headers $header


            # Create Index
            # POST https://[servicename].search.windows.net/indexes?api-version=[api-version]  
            #   Content-Type: application/json   
            #   api-key: [admin key] 

            $json_index = Get-Content '.\index.json' | ConvertFrom-Json
            $json_index.name = $cognitive_search_index
            $json_index = $json_index | ConvertTo-Json -Depth 8

            $cognitive_search_api_endpoint_index = "https://"+ $cognitive_search + ".search.windows.net/indexes?api-version=" + $cognitive_search_api_Version
            Invoke-WebRequest -Uri $cognitive_search_api_endpoint_index -Method 'POST' -Body $json_index -Headers $header


            # Create Skillset
            #PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2019-05-06
            #  Content-Type: application/json  
            #  api-key: [admin key]

            $json_skillset = Get-Content '.\skillset.json' | ConvertFrom-Json
            $json_skillset.name = $cognitive_search_skillset
            ForEach ($skill in $json_skillset.skills){
                    If ($skill.'@odata.type' -eq "#Microsoft.Skills.Custom.WebApiSkill"){
                        $skill.uri = $func_url[$skill.name]
                    }
                }
            $json_skillset.cognitiveServices.key = $cognitive_services_key
            $json_skillset.knowledgeStore.storageConnectionString = $connection_string
            $json_skillset.knowledgeStore.projections[0].objects[0].storageContainer = $cognitive_search_knowledge_store_container_object
            $json_skillset.knowledgeStore.projections[0].files[0].storageContainer = $cognitive_search_knowledge_store_container_files
            $json_skillset.knowledgeStore.projections[0].tables[0].tableName = $cognitive_search_knowledge_store_table_document
            $json_skillset.knowledgeStore.projections[0].tables[1].tableName = $cognitive_search_knowledge_store_table_keyphrases
            $json_skillset = $json_skillset | ConvertTo-Json -Depth 8

            Set-Content -Path '.\skillset.json' -Value $json_skillset

            $cognitive_search_api_endpoint_skillset = "https://"+ $cognitive_search + ".search.windows.net/skillsets/" + $cognitive_search_skillset + "?api-version=" + $cognitive_search_api_Version +"-Preview"
            Invoke-WebRequest -Uri $cognitive_search_api_endpoint_skillset -Method 'PUT' -Body $json_skillset -Headers $header



            # Create Indexer
            #POST https://[service name].search.windows.net/indexers?api-version=2019-05-06
            #    Content-Type: application/json  
            #    api-key: [admin key]  

            $json_indexer = Get-Content '.\indexer.json' | ConvertFrom-Json
            $json_indexer.name = $cognitive_search_indexer
            $json_indexer.dataSourceName = $storage_account
            $json_indexer.skillsetName = $cognitive_search_skillset
            $json_indexer.targetIndexName = $cognitive_search_index
            $json_indexer = $json_indexer | ConvertTo-Json -Depth 5


            $cognitive_search_api_endpoint_indexer = "https://"+ $cognitive_search + ".search.windows.net/indexers?api-version=" + $cognitive_search_api_Version
            Invoke-WebRequest -Uri $cognitive_search_api_endpoint_indexer -Method 'POST' -Body $json_indexer -Headers $header


return
