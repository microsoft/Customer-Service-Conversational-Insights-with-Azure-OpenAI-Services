### **Conversation Knowledge Mining**

![](/media/image.png){width="6.5in" height="2.9583333333333335in"}

**Visit the [\[Conversation Knowledge
Mining\]](https://github.com/aldunson_microsoft/ConversationalAIDev)
Repository**

MENU: \| [**GETTING STARTED**](bookmark://_Getting_Started_ENG) \|
[**HOW TO USE THE TOOL**](bookmark://_How_to_use) \| Documentation

**USE CASE OVERVIEW:**

This is a solution accelerator built on top of Azure Cognitive Search
Service and Azure OpenAI Service that leverages LLM to synthesize
post-call center transcripts for intelligent call center scenarios. It
shows how raw transcripts are converted into simplified customer call
summaries to extract valuable insights around product and service
performance.

This accelerator allows customers to quickly deploy an integrated
platform and immediately start extracting insights from customer or
employees\' conversations.

**KEY FEATURES**:

Azure Cognitive Search Service and Azure OpenAI Service drive huge cost
saving in call center operations while improving call center efficiency
& customer satisfaction. Post-call insights inform actions, leading to
better customer experiences, increased satisfaction, and improved
staffing allocation for maximum efficiency.

-   Feature 1

-   Feature 2

-   Feature 3

-   Feature 4

**Below are image stills from the accelerator**\
\
![](/media/image2.png){width="5.0in" height="2.5625in"}

*For a step by step user journey of the dashboard, visit [this
link](https://microsoft.sharepoint.com/:p:/t/IndustrySolutionsCTOTeam/Ef1m7iZaHrFPi9NLfxNn2HgBF67j1p5aBn1z2bgwhvgbUA?e=G1B0YI)
(internal microsoft only)*

## **Getting Started**

### **Prerequisites**

These requirements must be met before the accelerator is installed.

-   Azure OpenAI resource with a deployed model that has the following
    settings:

    -   Model: gpt-35-turbo

    -   Model Version: 0613

    -   Tokens per Minute: 22K

### **Products used/licenses required**

-   Azure Cognitive Search

-   Azure OpenAI

-   Azure storage account

-   \[should we include al the products here and at what tier they\'re
    configured since most of them are consumption based?\]

-   The user deploying the template must have permission to create
    resources and resource groups.

\[Insert [Audio
data](https://github.com/aldunson_microsoft/ConversationalAIDev#audio-data)
from original repo\]

### **Instructions on how to Install/deploy** **[Conversation Knowledge Mining](https://github.com/aldunson_microsoft/ConversationalAIDev)✌️**

-   Click the \'Deploy to Azure\' button.

-   Create a new resource group with any name.

-   Most fields will have a default name set already. You will need to
    update the following settings:

    -   OPENAI_API_BASE - the endpoint to your openai resource

    -   OPENAI_API_KEY - the key to your openai resource

    -   OPENAI_DEPLOYMENT_NAME - this should be set to gpt-35-turbo

    -   OPENAI_MODEL_TYPE - this should be set to chat

![](/media/image3.png){width="6.5in" height="1.65625in"}

-   Click \'review and create\' to start the deployment. The deployment
    can take up to 15 minutes to complete.

-   When deployment is complete, launch the application by navigating to
    your Azure resource group, choosing the app service resource, and
    clicking on the default domain. You should bookmark this url to have
    quick access to your deployed application.

![](/media/image4.png){width="6.3419192913385825in"
height="3.510437445319335in"}

### **(Optional) Azure Cognitive Search - Enabling Semantic Search** 

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
    ![A screenshot of a computer Description automatically
    generated](/media/image5.png){width="6.5in"
    height="3.1145833333333335in"}

-   Select the tab labeled "Semantic configurations" and then click "Add
    semantic configuration"\
    \
    ![A screenshot of a computer Description automatically
    generated](/media/image6.png){width="6.0625in"
    height="2.9583333333333335in"}

-   Fill out the configuration blade to match your requirements or us
    this example setup:

    -   **Name:** sc

    -   **Title field:** summary

    -   **Content fields:** text, merged_content, summary

    -   **Keyword fields:** keyphrases![A screenshot of a computer
        Description automatically
        generated](/media/image7.png){width="6.45833552055993in"
        height="7.58333552055993in"}

-   Click save on the panel and then save at the top of the page to
    create the new semantic configuration will be applied to your index.

-   Navigate to the App Service resource in your resource group -- this
    ends in "-ui".\
    \
    ![A screenshot of a computer Description automatically
    generated](/media/image8.png){width="6.5in"
    height="1.9583333333333333in"}

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
    ![](/media/image9.png){width="6.5in" height="0.6041666666666666in"}

-   You should now be able to toggle the Semantic Search radio button on
    and off and see a different order of relevant results on the list of
    call summaries on the from the web UI. You can make additional
    changes to your semantic configuration to change how the relevancy
    of your results are displayed here.\
    \
    ![A screenshot of a computer Description automatically
    generated](/media/imagea.png){width="6.5in"
    height="2.2291666666666665in"}

> If you plan to not utilize sementic search on the web UI, you can
> remove the radio button from the search by updating the application
> setting "SemanticConfiguration" on the App Service \> Settings \>
> Configuration page to an empty string:
>
> ![A screenshot of a computer Description automatically
> generated](/media/imageb.png){width="6.5in" height="3.5625in"}

**Integrate your OpenAI Prompt**

You can add your Azure OpenAI prompt to extract specific entities in the
template parameter OPENAI_PROMPT.\
The defined keys have to be added in the OPENAI_PROMPT_KEYS parameter as
well, to enable the data Push to the Azure Cognitive Search index.\
Please be sure to set up both parameters accordingly to your entities
name.

  -------------------------------------------------------------------------------------------------------------------------------------------
  **Environment        **Default value**                                    **Note**
  variable**                                                                
  -------------------- ---------------------------------------------------- -----------------------------------------------------------------
  OPENAI_PROMPT        Execute these tasks:\                                The prompt to be used with OpenAI, please define the keys in the
                       - Summarize the conversation, key: summary\          setting below as well
                       - Is the customer satisfied with the interaction     
                       with the agent, key: satisfied\                      
                       Answer in JSON machine-readable format, using the    
                       keys from above.\                                    
                       Format the ouput as JSON object called \'results\'.  
                       Pretty print the JSON and make sure that is properly 
                       closed at the end.                                   

  OPENAI_PROMPT_KEYS   summary:Edm.String:False,satisfied:Edm.String:True   The prompt keys to use for the OpenAI API. Format:
                                                                            key,SearchType,Facetable e.g.
                                                                            key1:Edm.String:False,key2:Edm.String:True,key3:Edm.String:True
  -------------------------------------------------------------------------------------------------------------------------------------------

**Modify the prompt after deployment**

You can modify the Azure OpenAI prompt after the deployment by modifying
the Azure Function application settings (\"OPENAI_PROMPT\",
\"OPENAI_PROMPT_KEYS\") and creating the required field in the Azure
Cognitive Search index.

### **How to use the tool** 

Launch the application by navigating to your Azure resource group,
choosing the app service resource, and clicking on the default domain.
On the first launch, your application will not show any summaries. You
will need to add data to see summarized results of conversations.

![](/media/imagec.png){width="5.0in" height="2.5625in"}

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

### **How to make updates to the UI**

Using the options on the customize page, you can upload your own logo
and set the background and text colors for the navigation bar. For
information on how to make other customizations, refer to the UI
documentation.

-   From the home page, click on the customize button.

![](/media/imaged.png){width="5.0in" height="2.5625in"}

![](/media/imagee.png){width="5.0in" height="2.75in"}

-   Select the rectangle next to background color to use the color
    picker to select a new background color for the header.

-   Select the rectangle next to text color to use the color picker to
    select a new footer text color.

![Inserting image\...](/media/imagef.png){width="6.003788276465442in"
height="3.3020833333333335in"}

-   Select the choose file button to upload a new image.

![](/media/image10.png){width="6.015325896762905in"
height="3.2708333333333335in"}

-   Click save to apply the updates.

**More Documentation**

-   [Solution
    Architecture](bookmark://_Solution_Architecture_Walkthrough)

-   [Resource Group Walkthrough](bookmark://_Resource_Group_Walkthrough)

-   Updating the UI

-   Future Extensions of this accelerator

-   Troubleshooting
