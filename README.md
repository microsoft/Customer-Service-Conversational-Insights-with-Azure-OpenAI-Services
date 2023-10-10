# Conversation Knowledge Mining

MENU: [**OVERVIEW**](#use-case-overview) \| [**GETTING STARTED**](#getting-started) \| [**EXTENSIBILITY**](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/Extensibility.md) \| [**AUDIO DATA**](#audio-data) \|
[**HOW TO USE**](#how-to-use-the-tool) \| [**TROUBLESHOOTING**](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/Troubleshooting.md)

## USE CASE OVERVIEW

This is a solution accelerator built on top of Azure Cognitive Search
Service and Azure OpenAI Service that leverages LLM to synthesize
post-call center transcripts for intelligent call center scenarios. It
shows how raw transcripts are converted into simplified customer call
summaries to extract valuable insights around product and service
performance.

This accelerator allows customers to quickly deploy an integrated
platform and immediately start extracting insights from customer or
employees\' conversations.

**KEY FEATURES:**

Azure Cognitive Search Service and Azure OpenAI Service drive huge cost
saving in call center operations while improving call center efficiency
& customer satisfaction. Post-call insights inform actions, leading to
better customer experiences, increased satisfaction, and improved
staffing allocation for maximum efficiency.

- Conversation Summarization and Key Phrase Extraction: Summarize long conversations into a short paragraph and pull out key phrases that are relevant to the conversation.
- Batch speech-to-text using Azure Speech: Transcribe large amounts of audio files asynchronously including speaker diarizationand is typically used in post-call analytics scenarios. Diarizationis the process of recognizing and separating speakers in mono channel audio data.
- Sensitive information extraction and redaction: Identify, categorize, and redact sensitive information in conversation transcription.
- Sentiment analysis and opinion mining: Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

**Below are image stills from the accelerator.**\
\
![image](/images/readMe/image2.png)

You can view a live demo of the accelerator [here](https://conversational-knowledge-mining.azurewebsites.net/).

## Getting Started

### Prerequisites

These requirements must be met before the accelerator is installed.

-   Azure OpenAI resource with a deployed model that has the following
    settings:

    -   Model: gpt-35-turbo

    -   Model Version: 0613

    -   Tokens per Minute: 22K

### Products used/licenses required

-   Azure Cognitive Search

-   Azure OpenAI

-   Azure storage account

-   \[should we include al the products here and at what tier they\'re
    configured since most of them are consumption based?\]

-   The user deploying the template must have permission to create
    resources and resource groups.

## Audio data
To deploy the full solution with audio file transcription and the Web Application, select the following button:
<br>
<br>
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Frturknett%2FCustomer-Service-Conversational-Insights-with-Azure-OpenAI-Services%2FreadMe-updates%2Finfrastructure%2FARM%2Fdeployment-template.json)

The Azure portal displays a pane that allows you to easily provide parameter values. The parameters are pre-filled with the default values from the template.

Once the deployment is completed, start processing your audio files by adding them to the "audio-input" container in the "storage account" in your "Resource Group". 
To navigate the Web Ui, check the "App Service" resource in your "Resource Group".


The template builds on top of the [Ingestion Client for Speech service](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/ingestion-client).
Please check here for detailed parameters explanations: [Getting started with the Ingestion Client](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/ingestion/ingestion-client/Setup/guide.md)

Learn more on how to configure your [Azure OpenAI prompt here](#integrate-your-openai-prompt)

### Solution Architecture
![image](/images/readMe/image4.png)

### **Instructions on how to Install/deploy** **[Conversation Knowledge Mining](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services)**

1.  Click the \'Deploy to Azure\' button.

2.  Create a new resource group with any name.

3.  Most fields will have a default name set already. You will need to
    update the following settings:

    -   OPENAI_API_BASE - the endpoint to your openai resource

    -   OPENAI_API_KEY - the key to your openai resource

    -   OPENAI_DEPLOYMENT_NAME - this should be set to gpt-35-turbo

    -   OPENAI_MODEL_TYPE - this should be set to chat

![image](/images/readMe/image3.png)

4.  Click \'review and create\' to start the deployment. The deployment
    can take up to 15 minutes to complete.

5.   When deployment is complete, launch the application by navigating to
    your Azure resource group, choosing the app service resource, and
    clicking on the default domain. You should bookmark this url to have
    quick access to your deployed application.



### Azure Cognitive Search - Enabling Semantic Search (Optional)

<details><summary>Click to see detailed steps for Enabling Semantic Search </summary>
&nbsp;<br/>

After deploying the solution, you can optionally enable the semantic
search capability on your Azure Cognitive Search Index. In Azure
Cognitive Search, semantic search measurably improves search relevance
by using language understanding to rerank search results and can enable
more relevant and meaningful results while searching the mined insights
in this solution.\
\
Note: This capability is in Public Preview and is not available in all
regions. Additional charges may be applicable if you enable this
capability. For more information on capabilities, availability, and
pricing, please [visit
here](https://aka.ms/SemanticAvailabilityandpricing).

Use the following steps to enable and configure semantic search:

-   Enable semantic search by [following these
    steps](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-enable-disable?tabs=enable-portal)
    on your Azure Cognitive Search resource in Azure

-   On the same Azure Cognitive Search resource, click "Indexes" in the
    left menu and select the "conversational-index" from the list of
    indexes that was created when you deployed.\
    \
    ![image](/images/readMe/image5.png)

-   Select the tab labeled "Semantic configurations" and then click "Add
    semantic configuration"\
    \
    ![image](/images/readMe/image6.png)

-   Fill out the configuration blade to match your requirements or us
    this example setup:

    -   **Name:** sc

    -   **Title field:** summary

    -   **Content fields:** text, merged_content, summary

    -   **Keyword fields:** keyphrases![image](/images/readMe/image7.png)

-   Click save on the panel and then save at the top of the page to
    create the new semantic configuration will be applied to your index.

-   Navigate to the App Service resource in your resource group -- this
    ends in "-ui".\
    \
    ![image](/images/readMe/image8.png)

-   Click "Configuration" from the Settings menu on the left and then
    click on "New application setting. Add the following two settings:

    -   **Name:** QueryLanguage\
        **Value:** en-US

    -   **Name:** SemanticConfiguration\
        **Value:** sc\
        \
        Note - if you chose a different name for your semantic
        configuration created earlier, you can set that here.

-   Click Save at the top of the page.

-   Navigate to Overview in the left menu and then click "Stop" and then
    "Start" for these configuration changes to take effect.\
    \
    ![image](/images/readMe/image9.png)

-   You should now be able to toggle the Semantic Search radio button on
    and off and see a different order of relevant results on the list of
    call summaries on the from the web UI. You can make additional
    changes to your semantic configuration to change how the relevancy
    of your results are displayed here.\
    \
    ![image](/images/readMe/image10.png)

> If you plan to not utilize sementic search on the web UI, you can
> remove the radio button from the search by updating the application
> setting "SemanticConfiguration" on the App Service \> Settings \>
> Configuration page to an empty string:
>
> ![image](/images/readMe/image11.png)
</details>

### Integrate your OpenAI Prompt
You can add your Azure OpenAI prompt to extract specific entities in the template parameter OPENAI_PROMPT.
<br>
The defined keys have to be added in the OPENAI_PROMPT_KEYS parameter as well, to enable the data Push to the Azure Cognitive Search index.
<br>
Please be sure to set up both parameters accordingly to your entities name.

| Environment variable | Default value | Note |
|--|--|--|
|OPENAI_PROMPT | Execute these tasks:<br>&#8226; Summarize the conversation, key: summary<br>&#8226; Is the customer satisfied with the interaction with the agent, key: satisfied<br> Answer in JSON machine-readable format, using the keys from above.<br> Format the ouput as JSON object called 'results'. Pretty print the JSON and make sure that is properly closed at the end.<br>| The prompt to be used with OpenAI, please define the keys in the setting below as well |
|OPENAI_PROMPT_KEYS | summary:Edm.String:False,satisfied:Edm.String:True|The prompt keys to use for the OpenAI API. Format: key,SearchType,Facetable e.g. key1:Edm.String:False,key2:Edm.String:True,key3:Edm.String:True | 

### Modify the prompt after deployment

You can modify the Azure OpenAI prompt after the deployment by modifying the Azure Function application settings ("OPENAI_PROMPT", "OPENAI_PROMPT_KEYS") and creating the required field in the Azure Cognitive Search index.

## How to use the tool

Launch the application by navigating to your Azure resource group,
choosing the app service resource, and clicking on the default domain.
On the first launch, your application will not show any summaries. You
will need to add data to see summarized results of conversations.

![image](/images/readMe/image12.png)

-   To upload files, click the \'Upload file\' button. Here you can
    upload .wav files of conversations, or conversations that have been
    formatted to the specified JSON format. After uploading, allow 10
    minutes for the files to fully process and appear on the Call
    Summaries page.

    -   Files can also be uploaded directly to the blob storage. Audio
        files should be uploaded to the audio-input folder, JSON files
        should be uploaded to the conversationkm-full folder.

    -   If 10 minutes have passed and you still do not see results,
        empty your cache and do a hard refresh on your browser.

-   To filter the conversations, use the filters on the left side of the
    screen. Alternatively, you can filter the conversations by clicking
    a keyphrase on a summary card.

-   To search for a specific topic, type what you want to find into the
    search bar, for example, if you want to find conversations where the
    customer is staying at the Ritz, you can type \"ritz\" or \"ritz
    hotel\" and the relevant conversations will surface.

-   To view a full conversation, click anywhere on the summary card.
    This will bring up the timeline of the conversation. You will also
    be able to view the full transcription and the meta data for the
    conversation. In this view you can search through this specific
    conversation using the search bar and by clicking on the keyphrases.

-   To view the relationships between topics, click the \'View entity
    map\' button. Here you will choose a Facet and number of nodes and
    be able to view the relationships between the phrases.

### How to make updates to the UI

Using the options on the customize page, you can upload your own logo
and set the background and text colors for the navigation bar. For
information on how to make other customizations, refer to the UI
documentation.

-   From the home page, click on the customize button.

![image](/images/readMe/image13.png)

![image](/images/readMe/image14.png)

-   Select the rectangle next to background color to use the color
    picker to select a new background color for the header.

-   Select the rectangle next to text color to use the color picker to
    select a new footer text color.

![image](/images/readMe/image15.png)

-   Select the choose file button to upload a new image.

![image](/images/readMe/image16.png)

Click save to apply the updates.

**More Documentation**

-   [Solution
    Architecture](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/SolutionArchitecture.md)

-   [Resource Group Walkthrough](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/SolutionArchitecture.md#resource-group-walkthrough)

-   [Updating the UI](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/tree/readMe-updates/GBB.ConversationalKM.WebUI)

-   [Future Extensions of this accelerator](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/Extensibility.md)

-   [Troubleshooting](https://github.com/rturknett/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/blob/readMe-updates/Troubleshooting.md)
