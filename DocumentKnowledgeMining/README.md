# Knowledge Mining Accelerator

MENU: [**USER STORY**](#user-story) \| [**QUICK DEPLOY**](#quick-deploy)  \| [**SUPPORTING DOCUMENTS**](#supporting-documents) \|
[**CUSTOMER TRUTH**](#customer-truth)


<h2><img src="./images/readme/userStory.png" width="64">
<br/>
User story
</h2>

### Solution accelerator overview

This solution accelerator helps you ingest, extract, and classify content from a high volume of assets to gain deeper insights and generate relevant suggestions for quick and easy reasoning. It allows you to analyze, compare, and summarize content with multi-modal processing of documents, handwritten text, charts, graphs, tables, and form fields. It leverages Azure OpenAI and Azure AI Document Intelligence in a hybrid approach by combining Optical Character Recognition (OCR) and multi-modal Large Language Model (LLM) to extract information from documents to provide insights without pre-training.

### Key features

- **Ingest and extract real-world entities:** Process and extract information unique to your ingested data pipeline such as people, products, events, places, or behaviors. Used to populate filters.

- **​Chat-based insights discovery​:** Choose to chat with all indexed assets, a single asset, select a set of assets, or chat with a  generated list of assets from a based on a user-led keyword search.

- **Text and document data analysis:** Analyze, compare, and synthesize materials into deep insights, making content accessible through natural language prompting. 

- **Prompt ​suggestion ​guidance:** Suggest a next best set of questions based on the prompt inquiry. Include referenced materials to guide deeper avenues of user-led discovery.

- **​Multi-modal information processing:** Ingest and extract knowledge from multiple content types and various format types. Enhance with scanned images, handwritten forms, and text-based tables.​

<br/><br/>

![image](./images/readme/screenshot.png)

### Scenario

In large, enterprise organizations it's difficult and time consuming to analyze large volumes of data. Imagine a mortgage lender working with both residential and commercial clients and she facilitates financing for buyers and sellers by negotiating loan terms, processing mortgage applications, and ensures compliance with federal regulations. 

Her challenges include:
- Analyzing large volumes of data in a timely manner, limiting quick decision-making.​
- Inability to compare and synthesize documents limits the contextual relevance of insights.​
- Inability to extract information from charts and tables leads to incomplete analysis and poor decision-making.

The goal of this solution accelerator is to:
- Automate document ingestion to avoid missing critical terms and ensure accuracy.​
- Leverage extracted data to make better-informed loan decisions.​
- Accelerate loan approvals while reducing manual effort.

### Business value

**Automate content processing** <br/>
Process and extract essential details unique to your ingested data pipeline such as people, products, events, places, or behaviors to quickly streamline document review and analysis.

**Enhance insight discovery**<br/>
User-led insight discovery is enabled through indexed, single, and multi-asset selection, including user generated asset lists used to contextualize, compare and synthesize materials into deep insights.

**Increase user productivity**<br/>
Improve productivity with natural language prompting and next best query suggestion, including reference materials and automated filter generation, to guide deeper avenues of user-lead discovery.

**Surface multi-modal insights**<br/>
Data ingested from multiple content types, such as images, handwritten forms, and text-based tables, is extracted and analyzed to surface key insights in conversational context.


### Who should use this solution accelerator?

Developers should use this solution accelerator in scenarios where they need to extend the capabilities of Azure OpenAI on their data, particularly when dealing with complex data analysis or document processing tasks that go beyond standard use cases. For example, when there is a need to integrate and analyze multiple data modalities (e.g., text, images, structured data) to gain comprehensive insights.

The accelerator presented here provides several options, for example:
- Data ingestion pipeline
- Entity mapping
- Key phrase and topic analysis
- Semantic search
- Chat with Unstructured (RAG 2.0)
- Image Processing
- Multi-modal processing 
- Natural language text analysis and summarization





### Solution accelerator architecture
![image](./images/readme/architecture.png)



<h2><img src="./images/readme/quickDeploy.png" width="64">
<br/>
Quick deploy
</h2>

### Prerequisites

To use this solution accelerator, you will need access to an [Azure subscription](https://azure.microsoft.com/free/) with permission to create resource groups and resources. While not required, a prior understanding of Azure Open AI, Azure AI Search, Azure AI Document Intelligence, Azure App Service, Azure Kubernetes Service, Azure Container Registry, Azure Blog Storage, Azure Queue Storage, and Azure Cosmos DB will be helpful.

For additional training and support, please see:

1. [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/) 
2. [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/) 
3. [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)
4. [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)
5. [Azure Kubernetes Service (AKS)](https://learn.microsoft.com/azure/aks/)
6. [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/)
7. [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/)
8. [Azure Queue Storage](https://learn.microsoft.com/en-us/azure/storage/queues/)
9. [Azure Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/)

### **How to install/deploy**

Follow the quick deploy steps on the [deployment guide](./README.DEPLOYMENT.md) to deploy this solution to your own Azure subscription.

<br>
<h2><img src="./images/readme/supportingDocuments.png" width="64">
<br/>
Supporting documents
</h2>

- [Technical Architecture](./App/Technical_Architecture.md)
- [Content Processing Workflow](./App/Data_Processing.md)

<br>
<h2><img src="./images/readme/customerTruth.png" width="64">
</br>
Customer truth
</h2>
Customer stories coming soon.

<br/>

<h2>
</br>
Responsible AI Transparency FAQ 
</h2>

Please refer to [Transarency FAQ](./TRANSPARENCY_FAQ.md) for responsible AI transparency details of this solution accelerator.

<br/>

### Document Upload Limit

Please ensure that the document you upload does not exceed a maximum size of 250 MB.


## Disclaimers

This release is an artificial intelligence (AI) system that generates text based on user input. The text generated by this system may include ungrounded content, meaning that it is not verified by any reliable source or based on any factual data. The data included in this release is synthetic, meaning that it is artificially created by the system and may contain factual errors or inconsistencies. Users of this release are responsible for determining the accuracy, validity, and suitability of any content generated by the system for their intended purposes. Users should not rely on the system output as a source of truth or as a substitute for human judgment or expertise. 

This release only supports English language input and output. Users should not attempt to use the system with any other language or format. The system output may not be compatible with any translation tools or services, and may lose its meaning or coherence if translated. 

This release does not reflect the opinions, views, or values of Microsoft Corporation or any of its affiliates, subsidiaries, or partners. The system output is solely based on the system's own logic and algorithms, and does not represent any endorsement, recommendation, or advice from Microsoft or any other entity. Microsoft disclaims any liability or responsibility for any damages, losses, or harms arising from the use of this release or its output by any user or third party. 

This release does not provide any financial advice, and is not designed to replace the role of qualified wealth advisors in appropriately advising clients. Users should not use the system output for any financial decisions or transactions, and should consult with a professional financial advisor before taking any action based on the system output. Microsoft is not a financial institution or a fiduciary, and does not offer any financial products or services through this release or its output. 

This release is intended as a proof of concept only, and is not a finished or polished product. It is not intended for commercial use or distribution, and is subject to change or discontinuation without notice. Any planned deployment of this release or its output should include comprehensive testing and evaluation to ensure it is fit for purpose and meets the user's requirements and expectations. Microsoft does not guarantee the quality, performance, reliability, or availability of this release or its output, and does not provide any warranty or support for it. 

This Software requires the use of third-party components which are governed by separate proprietary or open-source licenses as identified below, and you must comply with the terms of each applicable license in order to use the Software. You acknowledge and agree that this license does not grant you a license or other right to use any such third-party proprietary or open-source components.  

To the extent that the Software includes components or code used in or derived from Microsoft products or services, including without limitation Microsoft Azure Services (collectively, “Microsoft Products and Services”), you must also comply with the Product Terms applicable to such Microsoft Products and Services. You acknowledge and agree that the license governing the Software does not grant you a license or other right to use Microsoft Products and Services. Nothing in the license or this ReadMe file will serve to supersede, amend, terminate or modify any terms in the Product Terms for any Microsoft Products and Services. 

You must also comply with all domestic and international export laws and regulations that apply to the Software, which include restrictions on destinations, end users, and end use. For further information on export restrictions, visit https://aka.ms/exporting. 

You acknowledge that the Software and Microsoft Products and Services (1) are not designed, intended or made available as a medical device(s), and (2) are not designed or intended to be a substitute for professional medical advice, diagnosis, treatment, or judgment and should not be used to replace or as a substitute for professional medical advice, diagnosis, treatment, or judgment. Customer is solely responsible for displaying and/or obtaining appropriate consents, warnings, disclaimers, and acknowledgements to end users of Customer’s implementation of the Online Services. 

You acknowledge the Software is not subject to SOC 1 and SOC 2 compliance audits. No Microsoft technology, nor any of its component technologies, including the Software, is intended or made available as a substitute for the professional advice, opinion, or judgement of a certified financial services professional. Do not use the Software to replace, substitute, or provide professional financial advice or judgment.  

BY ACCESSING OR USING THE SOFTWARE, YOU ACKNOWLEDGE THAT THE SOFTWARE IS NOT DESIGNED OR INTENDED TO SUPPORT ANY USE IN WHICH A SERVICE INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE COULD RESULT IN THE DEATH OR SERIOUS BODILY INJURY OF ANY PERSON OR IN PHYSICAL OR ENVIRONMENTAL DAMAGE (COLLECTIVELY, “HIGH-RISK USE”), AND THAT YOU WILL ENSURE THAT, IN THE EVENT OF ANY INTERRUPTION, DEFECT, ERROR, OR OTHER FAILURE OF THE SOFTWARE, THE SAFETY OF PEOPLE, PROPERTY, AND THE ENVIRONMENT ARE NOT REDUCED BELOW A LEVEL THAT IS REASONABLY, APPROPRIATE, AND LEGAL, WHETHER IN GENERAL OR IN A SPECIFIC INDUSTRY. BY ACCESSING THE SOFTWARE, YOU FURTHER ACKNOWLEDGE THAT YOUR HIGH-RISK USE OF THE SOFTWARE IS AT YOUR OWN RISK.  