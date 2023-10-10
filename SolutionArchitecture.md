### **Solution Architecture Walkthrough**

![image](/images/readMe/image4.png "Inserting image...")

Call and text recordings are uploaded to the web application. Those
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

-   Application Insights - this resource gives details on application
    usage

-   App Service Plan - there will be two of these resources in you resource group. These resources define a set of compute resources for a web app to run. You should not have to make any changes to these resources after deployment.

-   Azure AI service multi-service account - this is a cognitive
    services API. You should not have to make any updates to this
    resource after deployment.

-   Application insights - there will be two of these resources in your resource group. These application are performace managment services for your web application. 

-   Search service - this resource holds all of the information required
    to surface the search results in the UI. It contains the index (named conversational-index) and
    indexers (named conversational-km-indexer) that aid in creating the search results. You can go here to
    configure your skillsets and semantic search, add fields to the search index, and debug
    input processing errors.

-   Service Bus Namespace - There will be two of these resources in your resource group. These resources are a scoping container for addressing
    Service Bus resources within your application. You should not have
    to make any updates to this resource after deployment.

-   Storage account - this resource stores the containers that hold the
    information the search service needs to work. You can upload .json
    files to the conversationkm-full container and .wav files to the
    audio-input container. The other containers in the list are
    automatically populated through the azure functions. You should not
    have to make any updates to any folders in this resource besides
    conversationkm-full and audio-input.

-   Azure Function Apps - There will be (4) function apps in your
    resource group

    -   generatedresourcegroupname - holds (6) functions that help
        process the conversation files. No updates are expected to be
        made to resource.

        -   AudioMerge - take from Fabrizio repo

        -   build-search-infra - creates the index for the search

        -   CustomDimensions - take from Fabrizio repo

        -   EvaluateConversation - take from Fabrizio repo

        -   MessagesMerge - take from Fabrizio repo

        -   TelemetryDataExtractor - take from Fabrizio repo

    -   generatedresourcegroupname-openai - holds the three functions
        necessary to summarize the pull information from the uploladed
        files. No updates are expected to be made to resource.

        -   Start Processing - grabs the latest json file and triggers
            the document processing to begin.

        -   Process Document - calls the the open ai api on the newly
            uploaded document and returns a summary, satisfcation
            rating, and any other attributes requested in the prompt.

        -   Push to Search - pushes the results from Process Document to
            the search index

    -   Start Transcription - converts .wav files into the expected
        .json format.

    -   Fetch Transcription - kicks off audio transcription process

-   Event Grid System Topic - a type of topic that represents events published by Azure services. You should not have to make any updates
    to this resource after deployment.

-   App service - hosts and contains the domain for your instance of
    this accelerator. clicking here will allow you to interact with the
    solution and search your conversations.

-   Speech Service- provides text to speech, speech translation, and speaker recognition features. You should not have to make any updates to this resource. 

-   Failure Anomolies - There will be two of these resources in your resource group. This is an automatic alert rule created by Azure when you enable application insights for your App Service. It's montiors your application for unusual or abnormal behavior related to failures. 

-   Key Vault - a cloud service for securley storing and accessing secrets, keys, and certificates. You should not have to make any updates to
    this resource after deployment.

