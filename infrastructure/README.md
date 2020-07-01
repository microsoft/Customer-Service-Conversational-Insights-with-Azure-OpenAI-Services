Pre-Requirements:
-   [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
-   [Azure Function Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash#v2)
-   [Powershell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7)


The "resource_creation.ps1" script creates the following resources:

YOU CAN CONFIGURE YOUR OWN RESOURCES IN config.json FILE

-   Azure Storage Account
    -   store conversational data processed in a specific container
    -   store Azure Function logs and deployment data

-   Azure Function
    -   process telemetry data to collapse all messages and events from same conversation in single JSON document
    -   skill to enrich telemetry data

-   Azure Cognitive Services
    -   resource to call Azure Cognitive Services for pre-defined skillset in the Azure Cognitive Services Pipeline

-   Azure Cognitive Search
    -   Data Source: pointer to Azure Blob Storage with raw conversational data
    -   Index: index to store data enriched by Cognitive Pipeline, with fields definition
    -   Skillset: sequence of cognitive skills to be applied to raw data to extract insights
    -   Indexer: perform mapping between skillset output and index and run on predefined schedule to perform continuous indexing

# Required variable for configuration

    $subscription_id = "YOUR_SUBSCRIPTION_ID"

    Resource Group
    -   $resource_group = "YOUR_RESOURCE_GROUP_NAME" 
    -   $location = "YOUR_LOCATION" # Resource Group location e.g. westeurope
    
    Azure Storage Account
    -   $storage_account = "YOUR_STORAGE_ACCOUNT_NAME" # Azure Storage Account name
    -   $cognitive_search_data_source_container = "YOUR_CONTAINER_NAME" # Container name for processed telemetry data

    Azure Functions
    -   $function = "YOUR_FUNCTION_NAME" # Azure Function Name

    Azure Cognitive Service
    -   $cognitive_services = "YOUR_COGNITIVE_SERVICE_NAME" # Azure Cognitive Services Name

    Azure Cognitive Search
    -   $cognitive_search = "YOUR_COGNITIVE_SEARCH_NAME" # Azure Cognitive Search Name
    -   $cognitive_search_sku = 'standard' # Azure Cognitive Search SKU
    -   $cognitive_search_index = 'conversational-km-index' # Azure Cognitive Search Index name
    -   $cognitive_search_indexer = 'conversational-km-indexer' # Azure Cognitive Search Indexer name
    -   $cognitive_search_skillset = "conversational-km-skillset" # Azure Cognitive Search Skillset name

    -   $cognitive_search_knowledge_store_container_object = "knowledge-store" # Azure Blob Storage container for object projection
    -   $cognitive_search_knowledge_store_container_files = "knowledge-store-images" # Azure Blob Storage container for images
    -   $cognitive_search_knowledge_store_table_document = "documentstable" # Azure Blob Storage Table for documents projections
    -   $cognitive_search_knowledge_store_table_keyphrases = "keyphrasestable" # Azure Blob Storage Table for keyphrases projection
    
