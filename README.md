# Conversation knowledge mining solution accelerator

MENU: [**USER STORY**](#user-story) \| [**SIMPLE DEPLOY**](#simple-deploy)  \| [**SUPPORTING DOCUMENTATION**](#supporting-documentation) \|
[**CUSTOMER TRUTH**](#customer-truth)

<h2><img src="/images/readMe/userStory.png" width="64">
<br/>
User story
</h2>

### Overview

This solution accelerator improves contact center operations by summarizing customer conversations and using AI to identify key phrases. By integrating conversational analytics alongside operational metrics, users can discover corollary insights for targeted business impact.​
performance.

### Technical key features

- **Conversation Summarization and Key Phrase Extraction:** Summarize long conversations into a short paragraph and pull out key phrases that are relevant to the conversation.
- **Speech-to-text using Azure Speech:** Transcribe audio files including speaker diarization that is typically used in post-call analytics scenarios. Diarization is the process of recognizing and separating speakers in mono channel audio data.
- **Sensitive information extraction and redaction:** Identify, categorize, and redact sensitive information in conversation transcription
- **Sentiment analysis and opinion mining:** Analyze transcriptions and associate positive, neutral, or negative sentiment at the utterance and conversation-level.

\
![image](/images/readMe/ckm-v2-ui.png)

### Use case / scenario

A contact center manager reviews contact center performance to ensure resources are being used efficiently. To identify areas for improvement, they need to understand the correlation between conversational and operational data. ​

The contact center manager uses their dashboard to identify how LLM-generated conversational analytics and insights are impacting operations to make an informed decision about how to improve their center’s performance.​

### Target end users

Company personnel (employees, executives) looking to gain conversational insights in correlation with operational Contact Center metrics would leverage this accelerator to find what they need quickly.

Tech administrators can use this accelerator to give their colleagues easy access to internal unstructured company data. Admins can customize the system configurator to tailor responses for the intended audience.

<h2><img src="/images/readMe/oneClickDeploy.png" width="64">
<br/>
Simple deploy
</h2>

### Business value
#### AI transcript analysis​
Generative AI analyzes call transcripts, summarizes content, identifies and aggregates key phrases for data visualization​
#### Operational clarity​
Relevant metrics such as call volume, handling time, and call resolution are pulled from the same call logs for operational data visualization​
#### Unified data​
Unstructured (call transcripts) and structured (operational metrics) data, are both analyzed and visualized within the same application​
#### Targeted decision enablement​
Enable agents and managers to achieve glanceable insight recognition, corollary information analysis, and accelerated decision making​

### When to use this repo
You should use this repo when your scenario customization needs exceed the out-of-the-box experience offered by [Azure OpenAI on your data](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data?tabs=ai-search) and you don't require to streamline the entire development cycle of your AI application, as you can with [Azure Machine Learning prompt flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/overview-what-is-prompt-flow?view=azureml-api-2). The accelerator presented here provides several options, for example:

- The ability to ground a model using both operational and conversation data
- Advanced keyword tracking
- LLM based PBI charting for visualization of conversation data
- Integrating Fabric as the repository for all conversational data

*Have you seen [ChatGPT + Enterprise data with Azure OpenAI and AI Search demo?](https://github.com/Azure-Samples/azure-search-openai-demo) If you would like to experiment: Play with prompts, understanding RAG pattern different implementation approaches, see how different features interact with the RAG pattern and choose the best options for your RAG deployments, take a look at that repo.

Here is a comparison table with a few features offered by Azure, an available GitHub demo sample and this repo, that can provide guidance when you need to decide which one to use:

| Name	| Feature or Sample? |	What is it? | When to use? |
| ---------|---------|---------|---------|
|[Conversation Knowledge Mining](https://aka.ms/CSAGoldStandards/ConversationKnowledgeMining) | Azure sample | | |
|[Build your own AI assistant Solution accelerator](https://aka.ms/CSAGoldStandards/BuildYourOwnAIAssistant) | Azure sample | A customized AI Assistant that accelerates the knowledge gathering and document creation by efficiently identifying specialized data sets, summarizing relevant documents, revealing insights and references, and generating content in a defined format to expedite and assist with document authoring.​ | |
|["Chat with your data" Solution Accelerator](https://aka.ms/ChatWithYourDataSolutionAccelerator) | Azure sample | End-to-end baseline RAG pattern sample that uses Azure AI Search as a retriever.	| This sample should be used by Developers when the  RAG pattern implementations provided by Azure are not able to satisfy business requirements. This sample provides a means to customize the solution. Developers must add their own code to meet requirements, and adapt with best practices according to individual company policies. |
|[Azure OpenAI on your data](https://learn.microsoft.com/azure/ai-services/openai/concepts/use-your-data) | Azure feature | Azure OpenAI Service offers out-of-the-box, end-to-end RAG implementation that uses a REST API or the web-based interface in the Azure AI Studio to create a solution that connects to your data to enable an enhanced chat experience with Azure OpenAI ChatGPT models and Azure AI Search. | This should be the first option considered for developers that need an end-to-end solution for Azure OpenAI Service with an Azure AI Search retriever. Simply select supported data sources, that ChatGPT model in Azure OpenAI Service , and any other Azure resources needed to configure your enterprise application needs. |
|[Azure Machine Learning prompt flow](https://learn.microsoft.com/azure/machine-learning/concept-retrieval-augmented-generation)	| Azure feature | RAG in Azure Machine Learning is enabled by integration with Azure OpenAI Service for large language models and vectorization. It includes support for Faiss and Azure AI Search as vector stores, as well as support for open-source offerings, tools, and frameworks such as LangChain for data chunking. Azure Machine Learning prompt flow offers the ability to test data generation, automate prompt creation, visualize prompt evaluation metrics, and integrate RAG workflows into MLOps using pipelines.  | When Developers need more control over processes involved in the development cycle of LLM-based AI applications, they should use Azure Machine Learning prompt flow to create executable flows and evaluate performance through large-scale testing. |
|[ChatGPT + Enterprise data with Azure OpenAI and AI Search demo](https://github.com/Azure-Samples/azure-search-openai-demo) | Azure sample | RAG pattern demo that uses Azure AI Search as a retriever. | Developers who would like to use or present an end-to-end demonstration of the RAG pattern should use this sample. This includes the ability to deploy and test different retrieval modes, and prompts to support business use cases. |
|[RAG Experiment Accelerator](https://github.com/microsoft/rag-experiment-accelerator) | Tool |The RAG Experiment Accelerator is a versatile tool that helps you conduct experiments and evaluations using Azure AI Search and RAG pattern. | RAG Experiment Accelerator is to make it easier and faster to run experiments and evaluations of search queries and quality of response from OpenAI. This tool is useful for researchers, data scientists, and developers who want to, Test the performance of different Search and OpenAI related hyperparameters. |

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

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2FCustomer-Service-Conversational-Insights-with-Azure-OpenAI-Services%2Fckm-v2-dev%2FDeployment%2Fbicep%2Fmain.json)

   1.  Most fields will have a default name set already. You will need to update the following Azure OpenAI settings:

       -  Region - the region where the resoruces will be created in.

       -  Solution Prefix - provide a 6 alphanumeric value that will be used to prefix resources
      
       -  Location - location of resources, by default it will use the resource group's location
           
2.  Create Fabric Workspace
    1.  Navigate to ([Fabric Workspace](https://app.fabric.microsoft.com/))
    2.  Click on Workspaces from left Navigation
    3.  Click on + New Workspace
        1.  Provide Name of Workspace 
        2.  Provide Description of Workspace (optional)
        3.  Click Apply
    4.  Open Workspace
    5.  Retrieve Workspace ID from URL, refer to documentation additional assistance ([here](https://learn.microsoft.com/en-us/fabric/admin/portal-workspace#identify-your-workspace-id))

3.   Deploy Fabric resources and artifacts
     1.   Navigate to ([Azure Portal](https://portal.azure.com/))
     2.   Click on Azure Cloud Shell in the top right of navigation Menu (add image)
     3.   Run the run the following command: 
          1.   az login
          2.   rm -rf ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services
          3.   git clone https://github.com/microsoft/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services
          4.   cd ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/Deployment/scripts/fabric_scripts
          5.   sh ./run_fabric_items_scripts.sh keyvault_param workspaceid_param solutionprefix_param
               1.   keyvault_param - the name of the keyvault that was created in Step 1
               2.   workspaceid_param - the workspaceid created in Step 2
               3.   solutionprefix_param - prefix used to append to lakehouse upon creation
     4.  Get Fabric Lakehouse Connection details:
         1.   Once deployment is complete, navigate to Fabric Workspace
         2.   Find Lakehouse in workspace (ex.lakehouse_*solutionprefix_param*), click on the SQL Analytics Endpoint
         3.   Click on Settings icon
         4.   In right panel, click copy icon for SQL connection String (needed for next step)
         5.   Copy the Lakehouse name from workspace (needed for next steps)
    1.   Wait 10-15 minutes to allow the data pipelines to finish processing then proceed to next step.
4.   Deploy Power BI Report
     1.   Download the .pbix file from repo (link).
     2.   Open Power BI report in Power BI Dashboard
     3.   Click on Transform Data menu option from the Task Bar
     4.   Click Data source settings
     5.   Click Change Source...
     6.   Input the Server link (from Fabric Workspace)
     7.   Input Database name (from Fabric Workspace)
     8.   Click OK
     9.   Click Edit Permissions
     10.  If not signed in, sign in your credentials and proceed to click OK
     11.  Click Close
     12.  Report should refresh with need connection.

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
Supporting documentation
</h2>

### How to customize the UI

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
