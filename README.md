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

- **Data Processing:** Microsoft Fabric to process both audio and conversation files at scale, leveraging its benefits for efficient and scalable data handling.
- **Summarization and Key Phrase Extraction:** Azure OpenAI to summarize long conversations into concise paragraphs and extract key phrases relevant to the conversation.
- **Speech-to-text:** Azure Speech to transcribe audio files, including speaker diarization for post-call analytics. Diarization is the process of recognizing and separating speakers in mono channel audio data.
- **Dashboard:** Power BI to visualize the correlation of operational metrics with the generated knowledge mining insights.

\
![image](/images/readMe/ckm-v2-ui.png)

### Use case / scenario

A contact center manager reviews contact center performance to ensure resources are being used efficiently. To identify areas for improvement, they need to understand the correlation between conversational and operational data. ​

The contact center manager uses their dashboard to identify how LLM-generated conversational analytics and insights are impacting operations to make an informed decision about how to improve their center’s performance.​

### Target end users

Company personnel (employees, executives) looking to gain conversational insights in correlation with operational Contact Center metrics would leverage this accelerator to find what they need quickly.

TBD

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
TBD

Here is a comparison table with a few features offered by Azure, an available GitHub demo sample and this repo, that can provide guidance when you need to decide which one to use:

| Name	| Feature or Sample? |	What is it? | When to use? |
| ---------|---------|---------|---------|
|[Conversation Knowledge Mining](https://aka.ms/CSAGoldStandards/ConversationKnowledgeMining) | Azure sample |TBD|TBD|
|TBD| | | |
|TBD| | | |
|TBD| | | |
|TBD| | | |

<h2><img src="/images/readMe/oneClickDeploy.png" width="64">
<br/>
One-click deploy
</h2>

### Products used/licenses required

-   Azure Speech Service

-   Azure OpenAI

-   Microsoft Fabric Capacity 

-   The user deploying the template must have permission to create
    resources and resource groups.

### Solution accelerator architecture
![image](/images/readMe/ckm-v2-sa.png)

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
          1.   ```az login``` ***Follow instructions in Azure Cloud Shell for login instructions
          2.   ```rm -rf ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services```
          3.   ```git clone https://github.com/microsoft/Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services```
          4.   ```cd ./Customer-Service-Conversational-Insights-with-Azure-OpenAI-Services/Deployment/scripts/fabric_scripts```
          5.   ```sh ./run_fabric_items_scripts.sh keyvault_param workspaceid_param solutionprefix_param```
               1.   keyvault_param - the name of the keyvault that was created in Step 1
               2.   workspaceid_param - the workspaceid created in Step 2
               3.   solutionprefix_param - prefix used to append to lakehouse upon creation
     4.  Get Fabric Lakehouse Connection details:
         1.   Once deployment is complete, navigate to Fabric Workspace
         2.   Find Lakehouse in workspace (ex.lakehouse_*solutionprefix_param*)
         3.   Click on the ```...``` next to the SQL Analytics Endpoint
         4.   Click on ```Copy SQL connection string```
         5.   Click Copy button in popup window.
     5.   Wait 10-15 minutes to allow the data pipelines to finish processing then proceed to next step.
4.   Deploy Power BI Report
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


### Upload Additioanl Files

All files JSON and WAV files can be uploaded in the corresponding Lakehouse in the data/Files folder:

- Converation (JSON files): 
  Upload JSON files in the conversation_input folder.

- Audio (WAV files):
  Upload Aduio files in the audio_input folder.


### Process Audio Files
Currently, audio files are not processed during deployment. To manually process audio files, follow these steps:
- Open the pipeline_notebook 
- Uncomment cells 3 and 4
- Run pipeline_notebook


### Modify the prompt after deployment

If you'd like to modify the OpenAI prompt after deployment, they can be found in the Fabric notebooks.

<br/>
<h2>
Supporting documentation
</h2>

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

---

## Disclaimers

This Software requires the use of third-party components which are governed by separate proprietary or open-source licenses as identified below, and you must comply with the terms of each applicable license in order to use the Software. You acknowledge and agree that this license does not grant you a license or other right to use any such third-party proprietary or open-source components.  

To the extent that the Software includes components or code used in or derived from Microsoft products or services, including without limitation Microsoft Azure Services (collectively, “Microsoft Products and Services”), you must also comply with the Product Terms applicable to such Microsoft Products and Services. You acknowledge and agree that the license governing the Software does not grant you a license or other right to use Microsoft Products and Services. Nothing in the license or this ReadMe file will serve to supersede, amend, terminate or modify any terms in the Product Terms for any Microsoft Products and Services. 

You must also comply with all domestic and international export laws and regulations that apply to the Software, which include restrictions on destinations, end users, and end use. For further information on export restrictions, visit https://aka.ms/exporting. 

You acknowledge that the Software and Microsoft Products and Services (1) are not designed, intended or made available as a medical device(s), and (2) are not designed or intended to be a substitute for professional medical advice, diagnosis, treatment, or judgment and should not be used to replace or as a substitute for professional medical advice, diagnosis, treatment, or judgment. Customer is solely responsible for displaying and/or obtaining appropriate consents, warnings, disclaimers, and acknowledgements to end users of Customer’s implementation of the Online Services. 

You acknowledge the Software is not subject to SOC 1 and SOC 2 compliance audits. No Microsoft technology, nor any of its component technologies, including the Software, is intended or made available as a substitute for the professional advice, opinion, or judgement of a certified financial services professional. Do not use the Software to replace, substitute, or provide professional financial advice or judgment.  

BY ACCESSING OR USING THE SOFTWARE, YOU ACKNOWLEDGE THAT THE SOFTWARE IS NOT DESIGNED OR INTENDED TO SUPPORT ANY USE IN WHICH A SERVICE INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE COULD RESULT IN THE DEATH OR SERIOUS BODILY INJURY OF ANY PERSON OR IN PHYSICAL OR ENVIRONMENTAL DAMAGE (COLLECTIVELY, “HIGH-RISK USE”), AND THAT YOU WILL ENSURE THAT, IN THE EVENT OF ANY INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE, THE SAFETY OF PEOPLE, PROPERTY, AND THE ENVIRONMENT ARE NOT REDUCED BELOW A LEVEL THAT IS REASONABLY, APPROPRIATE, AND LEGAL, WHETHER IN GENERAL OR IN A SPECIFIC INDUSTRY. BY ACCESSING THE SOFTWARE, YOU FURTHER ACKNOWLEDGE THAT YOUR HIGH-RISK USE OF THE SOFTWARE IS AT YOUR OWN RISK.  
