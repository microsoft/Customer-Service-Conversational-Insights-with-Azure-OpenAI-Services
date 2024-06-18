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

- **Data processing:** Microsoft Fabric processes both audio and conversation files at scale, leveraging its benefits for efficient and scalable data handling
- **Summarization and key phrase extraction​:** Azure OpenAI is used to summarize long conversations into concise paragraphs and extract relevant key phrases
- **Speech transcription and diarization​:** Azure Speech is used to transcribe audio files, including speaker diarization for post-call analytics. Diarization is the process of recognizing and separating individual speakers into mono-channel audio data​
- **Analytics dashboard​:** Power BI is used to visualize the correlation between operational metrics and AI-generated conversational data​

\
![image](/images/readMe/ckm-v2-ui.png)

### Use case / scenario

A contact center manager reviews contact center performance to ensure resources are being used efficiently. To identify areas for improvement, they need to understand the correlation between conversational and operational data. ​

The contact center manager uses their dashboard to identify how LLM-generated conversational analytics and insights are impacting operations to make an informed decision about how to improve their center’s performance.​

### Target end users

Company personnel (employees, executives) looking to gain conversational insights in correlation with operational Contact Center metrics would leverage this accelerator to find what they need quickly.

TBD


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
TBD

Here is a comparison table with a few features offered by Azure, an available GitHub demo sample and this repo, that can provide guidance when you need to decide which one to use:

| Name	| Feature or Sample? |	What is it? | When to use? |
| ---------|---------|---------|---------|
|[Conversation Knowledge Mining](https://aka.ms/CSAGoldStandards/ConversationKnowledgeMining) | Azure sample |Azure Open AI based accelerator to analyze structured and unstructured data. The solution uses Fabric data pipelines, Power BI visualization Aure AI services to generate LLM based conversational analytics and operational metrics-based analytics for business analytics solution|TBD|
|TBD|TBD|TBD|TBD|
|TBD|TBD|TBD|TBD|
|TBD|TBD|TBD|TBD|
|TBD|TBD|TBD|TBD|


### Products used/licenses required

-   Azure Speech Service

-   Azure OpenAI

-   Microsoft Fabric Capacity

-   The user deploying the template must have permission to create
    resources and resource groups.

### Solution accelerator architecture
![image](/images/readMe/ckm-v2-sa.png)

<h2><img src="/images/readMe/oneClickDeploy.png" width="64">
<br/>
Simple deploy
</h2>


### **How to install/deploy**

1. Click the following deployment button to create the required resources for this accelerator directly in your Azure Subscription.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2FCustomer-Service-Conversational-Insights-with-Azure-OpenAI-Services%2Fckm-v2-dev%2FDeployment%2Fbicep%2Fmain.json)

   1.  Most fields will have a default name set already. You will need to update the following Azure OpenAI settings:

       -  Region - the region where the resources will be created in

       -  Solution Prefix - provide a 6 alphanumeric value that will be used to prefix resources
      
       -  Location - location of resources, by default it will use the resource group's location
           
2.  Create Fabric workspace
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
          1.   ```az login``` ***Follow instructions in Azure Cloud Shell for login instructions
          2.   ```rm -rf ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services```
          3.   ```git clone https://github.com/microsoft/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services```
          4.   ```cd ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/Deployment/scripts/fabric_scripts```
          5.   ```sh ./run_fabric_items_scripts.sh keyvault_param workspaceid_param solutionprefix_param```
               1.   keyvault_param - the name of the keyvault that was created in Step 1
               2.   workspaceid_param - the workspaceid created in Step 2
               3.   solutionprefix_param - prefix used to append to lakehouse upon creation
     4.  Get Fabric Lakehouse connection details:
         1.   Once deployment is complete, navigate to Fabric Workspace
         2.   Find Lakehouse in workspace (ex.lakehouse_*solutionprefix_param*)
         3.   Click on the ```...``` next to the SQL Analytics Endpoint
         4.   Click on ```Copy SQL connection string```
         5.   Click Copy button in popup window.
     5.   Wait 10-15 minutes to allow the data pipelines to finish processing then proceed to next step.
4.   Deploy Power BI report
     1.   Download the .pbix file from the [Reports folder](Deployment/Reports/).
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



### Process audio files
Currently, audio files are not processed during deployment. To manually process audio files, follow these steps:
- Open the pipeline_notebook 
- Uncomment cells 3 and 4
- Run pipeline_notebook


### Upload additional files

All files JSON and WAV files can be uploaded in the corresponding Lakehouse in the data/Files folder:

- Conversation (JSON files): 
  Upload JSON files in the *conversation_input* folder.

- Audio (WAV files):
  Upload Audio files in the *audio_input* folder.


### Post-deployment
- To process additional files, manually execute the pipeline_notebook after uploading new files.
- The OpenAI prompt can be modified within the Fabric notebooks.


<br/>
<h2>
Supporting documentation
</h2>

### 

### How to customize

If you'd like to customize the accelerator, here are some ways you might do that:
- Modify the Power BI report to use a custom logo
- Ingest your own [JSON conversation files](ConversationalDataFormat.md) by uploading them into the `conversation_input` lakehouse folder and run the data pipeline
- Ingest your own [audio conversation files](ConversationalDataFormat.md) by uploading them into the `audio_input` lakehouse folder and run the data pipeline

### Troubleshooting
-   [Troubleshooting documentation](Troubleshooting.md)

### Additional resources

- [Microsoft Fabric documentation - Microsoft Fabric | Microsoft Learn](https://learn.microsoft.com/en-us/fabric/)
- [Azure OpenAI Service - Documentation, quickstarts, API reference - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data)
- [Speech service documentation - Tutorials, API Reference - Azure AI services - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/)
  
### More info
-   [Solution
    architecture](SolutionArchitecture.md)
-  [Future extensibility documentation](Extensibility.md)

<h2><img src="/images/readMe/customerTruth.png" width="64">
</br>
Customer truth
</h2>
Customer stories coming soon. For early access, contact: nfelton@microsoft.com
