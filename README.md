# Conversation knowledge mining solution accelerator

MENU: [**USER STORY**](#user-story) \| [**ONE-CLICK DEPLOY**](#one-click-deploy)  \| [**SUPPORTING DOCUMENTS**](#supporting-documents) \|
[**CUSTOMER TRUTH**](#customer-truth)

<h2><img src="/images/readMe/userStory.png" width="64">
<br/>
User story
</h2>

**Solution accelerator overview**

This is a solution accelerator built on top of Azure Cognitive Search
Service and Azure OpenAI Service that leverages LLM to synthesize
post-contact center transcripts for intelligent contact center scenarios. It
shows how raw transcripts are converted into simplified customer call
summaries to extract valuable insights around product and service
performance.

**Scenario**

This scenario shows how a data professional within a travel company contact
center can use AI to quickly analyze call logs and analytics to identify areas 
for improvement.

**Key features**

Azure Cognitive Search and Azure OpenAI can enable new and 
innovative ways to run contact center operations. Post call insights 
can inform data driven actions to drive decisions around staffing and operations.

- **Conversation Summarization and Key Phrase Extraction:** Summarize long conversations into a short paragraph and pull out key phrases that are relevant to the conversation.
- **Batch speech-to-text using Azure Speech:** Transcribe large amounts of audio files asynchronously including speaker diarization and is typically used in post-call analytics scenarios. Diarizations the process of recognizing and separating speakers in mono channel audio data.
- **Sensitive information extraction and redaction:** Identify, categorize, and redact sensitive information in conversation transcription
- **Sentiment analysis and opinion mining:** Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

**Below is an image of the solution accelerator.**\
\
![image](/images/readMe/image2.png)

<h2><img src="/images/readMe/oneClickDeploy.png" width="64">
<br/>
One-click deploy
</h2>

### Prerequisites

These requirements must be met before the solution accelerator is installed.

-   If you would like to use an **existing** OpenAI resource in your Azure tenant (instead of opting to create a new one), you'll need an Azure OpenAI resource with a deployed model that has the following
    settings:

    -   Model: gpt-35-turbo

    -   Model Version: 0613

    -   Tokens per Minute: 22K

### Products used/licenses required

-   Azure Cognitive Search

-   Azure OpenAI

-   Azure storage account

-   The user deploying the template must have permission to create
    resources and resource groups.


### Deploy

The Azure portal displays a pane that allows you to easily provide parameter values. The parameters are pre-filled with the default values from the template.

Once the deployment is completed, start processing your audio files by adding them to the "audio-input" container in the "storage account" in your "Resource Group". 
To navigate the Web UI, check the "App Service" resource in your "Resource Group".


The template builds on top of the [Ingestion Client for Speech service](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/ingestion-client).
Please check here for detailed parameters explanations: [Getting started with the Ingestion Client](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/ingestion/ingestion-client/Setup/guide.md)

Learn more on how to configure your [Azure OpenAI prompt here](#integrate-your-openai-prompt)

### Solution accelerator architecture
![image](/images/readMe/image4.png)

### **How to install/deploy**

1. Click the following deployment button to create the required resources for this accelerator directly in your Azure Subscription.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2FCustomer-Service-Conversational-Insights-with-Azure-OpenAI-Services%2Fmaster%2Finfrastructure%2FARM%2Fdeployment-template.json)

2.  Most fields will have a default name set already. You will need to update the following Azure OpenAI settings:

    -   newOrExistingOpenAIResource - Determines whether to create a new Azure Open AI resource or use an existing resource within the deployment. 
        - **existing**: Select this option if you already have an Azure Open AI resource that you want to use.
        - **new**:      Choose this option if you want to create a new Azure Open AI resource as part of this deployment. The template will provision a new resource with the specified configuration settings.
  
        **Note:** The default value for this field is **existing**.
        
        ![image of new or existing OpenAI resource field](image.png)
    

    -   OPENAI_API_BASE - the endpoint to your openai resource. This will be ignored if newOrExistingOpenAIResource is set to **new**.

    -   OPENAI_API_KEY - the key to your openai resource. This will be ignored if newOrExistingOpenAIResource is set to **new**.
   
    -   OPENAI_DEPLOYMENT_NAME - for the sample app this should be set to gpt-35-turbo

    -   OPENAI_MODEL_TYPE - for the sample app this should be set to chat\
        ![OpenAI Fields](image-1.png)
        
1.  Optionally, you may also update the **Web UI Docker Image Reference** and the **OpenAI Function Docker Image Reference** to point to your own container images instead of the images that we host (this would be necessary if you want to test your own changes to the Web UI or OpenAI Function code).
 
2.  Click \'review and create\' to start the deployment. The deployment can take up to 15 minutes to complete.

3.   When deployment is complete, launch the application by navigating to
    your Azure resource group, choosing the app service resource, and
    clicking on the default domain. You should bookmark this url to have
    quick access to your deployed application.



### Azure Cognitive Search - enabling Semantic Search

After deploying the solution accelerator, you can optionally enable the semantic
search capability on your Azure Cognitive Search Index. In Azure
Cognitive Search, semantic search measurably improves search relevance
by using language understanding to re-rank search results and can enable
more relevant and meaningful results while searching the mined insights.\
\
Note: This capability is in Public Preview and is not available in all
regions. Additional charges may be applicable if you enable this
capability. For more information on capabilities, availability, and
pricing, please [visit
here](https://aka.ms/SemanticAvailabilityandpricing).

Use the following steps to enable and configure semantic search:

-   Enable semantic search by [following these
    steps](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-enable-disable?tabs=enable-portal)
    on your Azure Cognitive Search resource in Azure.

-   On the same Azure Cognitive Search resource, click "Indexes" in the
    left menu and select the "conversational-index" from the list of
    indexes that was created when you deployed.\
    \
    ![image](/images/readMe/image5.png)

-   Select the tab labeled "Semantic configurations" and then click "Add
    semantic configuration".\
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

If you plan to not utilize Semantic Search on the web UI, you can
remove the radio button from the search by updating the application
setting "SemanticConfiguration" on the App Service \> Settings \>
Configuration page to an empty string:

![image](/images/readMe/image11.png)

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

<h2><img src="/images/readMe/supportingDocuments.png" width="64">
<br/>
Supporting documents
</h2>

Launch the application by navigating to your Azure resource group,
choosing the app service resource, and clicking on the default domain.
On the first launch, your application will not show any summaries. You
will need to upload your data files in the correct format (instructions available below the following image) to see summarized results of conversations.

![image](/images/readMe/image12.png)

-   To upload files, click the \'Upload file\' button. Here you can
    upload .wav files of conversations, or conversations that have been
    formatted to the specified JSON format. After uploading, allow 10
    minutes for the files to fully process and appear on the Call
    summaries page.

    -   Files can also be uploaded directly to the blob storage. Audio
        files should be uploaded to the audio-input folder, JSON files
        should be uploaded to the conversationkm-full folder. When uploading
        please follow this [format](ConversationalDataFormat.md).

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

### How to customize the UI

Using the options on the customize page, you can upload your own logo
and set the background and text colors for the navigation bar. For
information on how to make other customizations, refer to the UI
documentation.

-   From the home page, click on the customize button located in the upper right hand corner of the page.

![image](/images/readMe/image10.png)

![image](/images/readMe/image14.png)

-   Select the rectangle next to background color to use the color
    picker to select a new background color for the header.

-   Select the rectangle next to text color to use the color picker to
    select a new footer text color.

![image](/images/readMe/image15.png)

-   Select the choose file button to upload a new image.

![image](/images/readMe/image16.png)

Click save to apply the updates.
<br>
<br/>
<br>
<br/>

**Troubleshooting**
-   [Troubleshooting documentation](Troubleshooting.md)
  
**Extensibility**

-   [Future extensibility documentation](Extensibility.md)

**More info**
-   [Solution
    architecture](SolutionArchitecture.md)

-   [Resource group walkthrough](SolutionArchitecture.md#resource-group-walkthrough)

-   [Updating the UI](GBB.ConversationalKM.WebUI)

<br/>
<br>
<h2><img src="/images/readMe/customerTruth.png" width="64">
</br>
Customer truth
</h2>
Customer stories coming soon. For early access, contact: nfelton@microsoft.com

<br/>
<br/>
<br/>

---

## Disclaimers

This Software requires the use of third-party components which are governed by separate proprietary or open-source licenses as identified below, and you must comply with the terms of each applicable license in order to use the Software. You acknowledge and agree that this license does not grant you a license or other right to use any such third-party proprietary or open-source components.  

To the extent that the Software includes components or code used in or derived from Microsoft products or services, including without limitation Microsoft Azure Services (collectively, “Microsoft Products and Services”), you must also comply with the Product Terms applicable to such Microsoft Products and Services. You acknowledge and agree that the license governing the Software does not grant you a license or other right to use Microsoft Products and Services. Nothing in the license or this ReadMe file will serve to supersede, amend, terminate or modify any terms in the Product Terms for any Microsoft Products and Services. 

You must also comply with all domestic and international export laws and regulations that apply to the Software, which include restrictions on destinations, end users, and end use. For further information on export restrictions, visit https://aka.ms/exporting. 

You acknowledge that the Software and Microsoft Products and Services (1) are not designed, intended or made available as a medical device(s), and (2) are not designed or intended to be a substitute for professional medical advice, diagnosis, treatment, or judgment and should not be used to replace or as a substitute for professional medical advice, diagnosis, treatment, or judgment. Customer is solely responsible for displaying and/or obtaining appropriate consents, warnings, disclaimers, and acknowledgements to end users of Customer’s implementation of the Online Services. 

You acknowledge the Software is not subject to SOC 1 and SOC 2 compliance audits. No Microsoft technology, nor any of its component technologies, including the Software, is intended or made available as a substitute for the professional advice, opinion, or judgement of a certified financial services professional. Do not use the Software to replace, substitute, or provide professional financial advice or judgment.  

BY ACCESSING OR USING THE SOFTWARE, YOU ACKNOWLEDGE THAT THE SOFTWARE IS NOT DESIGNED OR INTENDED TO SUPPORT ANY USE IN WHICH A SERVICE INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE COULD RESULT IN THE DEATH OR SERIOUS BODILY INJURY OF ANY PERSON OR IN PHYSICAL OR ENVIRONMENTAL DAMAGE (COLLECTIVELY, “HIGH-RISK USE”), AND THAT YOU WILL ENSURE THAT, IN THE EVENT OF ANY INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE, THE SAFETY OF PEOPLE, PROPERTY, AND THE ENVIRONMENT ARE NOT REDUCED BELOW A LEVEL THAT IS REASONABLY, APPROPRIATE, AND LEGAL, WHETHER IN GENERAL OR IN A SPECIFIC INDUSTRY. BY ACCESSING THE SOFTWARE, YOU FURTHER ACKNOWLEDGE THAT YOUR HIGH-RISK USE OF THE SOFTWARE IS AT YOUR OWN RISK.  
