### **Solution Architecture Walkthrough**

![image](/images/readMe/image4.png "Inserting image...")

Call and text recordings are uploaded through the web application. Those
recordings are stored in a storage account and processed and have meta
data applied to them using a set of Azure functions. Once those are
processed, they leave the storage account and are pushed to the search
index. In parallel, an Azure function runs to make a call to the Azure
OpenAI Service to generate summarizations of the phone calls and other
key conversation points. These results are surfaced in the app service
where users can view the complete collections of calls with the
summaries, customer satisfaction score, and keyphrases extracted from
the conversation.

### **Resource Group Walkthrough**

After deploying our template, you should have a resource group that
contains the following resources:

-   App Service Plan - There will be two of these resources in you resource group. 
    These resources define a set of compute resources for a web app to run. 
    You should not have to make any changes to these resources after deployment.

-   Azure AI Services multi-service account - This is a cognitive
    services API. You should not have to make any updates to this
    resource after deployment.

-   Application Insights - There will be two of these resources in your resource group. 
    These applications are performance managment services for your web application. 

-   Search Service - This resource holds all of the information required
    to surface the search results in the UI. It contains the index
    (named conversational-index) and indexers (named conversational-km-indexer) 
    that aid in creating the search results. You can go here to
    configure your skillsets and semantic search, add fields to the search index,
    and debug input processing errors.

-   Service Bus Namespace - There will be two of these resources in your resource group. 
    These resources are a scoping container for addressing
    Service Bus resources within your application. You should not have
    to make any updates to this resource after deployment.

-   Storage account - This resource stores the containers that hold the
    information the search service needs to work. You can upload .json
    files to the conversationkm-full container and .wav files to the
    audio-input container. The other containers in the list are
    automatically populated through the azure functions. You should not
    have to make any updates to any folders in this resource besides
    conversationkm-full and audio-input.

-   Azure Function Apps - There will be four (4) function apps in your
    resource group:

    -   generatedresourcegroupname - Contains multiple functions that help
        process the conversation files. No updates are expected to be
        made to resource.

        - AudioMerge - Performs batch speech transcription.

        - build-search-infra - Creates the index for the search service.

        - CustomDimensions - Extract CustomProperties from conversation messages.

        - EvaluateConversation - Evaluate conversation on different parameters, starting from its messages.

        - MessagesMerge - Collapse all text messages from Agent and User to a single field.

        - TelemetryDataExtractor - Azure Function to extract Bot Telemetry data, 
          collapsing all messages in a single JSON file for any conversation.

        - Named Entity Extracor - Extract named entity extraction.

    -   generatedresourcegroupname-openai - Contains the three functions
        necessary to summarize the pull information from the uploladed
        files. No updates are expected to be made to resource.

        -   Start Processing - Grabs the latest json file and triggers
            the document processing to begin.

        -   Process Document - Calls the the open ai api on the newly
            uploaded document and returns a summary, satisfcation
            rating, and any other attributes requested in the prompt.

        -   Push to Search - Pushes the results from Process Document to
            the search index

    -   Start Transcription - Converts the .wav files into the expected
        .json format.

    -   Fetch Transcription - Kicks off the audio transcription process.

-   Event Grid System Topic - A type of topic that represents events published by Azure services.
    You should not have to make any updates
    to this resource after deployment.

-   App service - Hosts and contains the domain for your instance of
    this accelerator. Clicking here will allow you to interact with the
    solution and search your conversations.

-   Speech service - Provides text to speech, speech translation, and speaker recognition features.
    You should not have to make any updates to this resource. 

-   Failure Anomalies - There will be two of these resources in your resource group. 
    These are automatic alert rules created by Azure when you enable application insights for your App Service. 
    They monitor your application for unusual or abnormal behavior related to failures. 

-   Key vault - A cloud service for securley storing and accessing secrets, keys, and certificates. 
    You should not have to make any updates to
    this resource after deployment.

