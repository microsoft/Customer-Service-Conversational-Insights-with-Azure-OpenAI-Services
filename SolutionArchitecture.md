### **Solution Architecture Walkthrough**

![image](/images/readMe/ckm-v2-sa.png "Inserting image...")

- Call and text recording data from the contact center is uploaded to a Microsoft Fabric Lakehouse in Microsoft OneLake
- Microsoft Fabric Notebooks then use Azure AI Services to transcribe audio and the Azure OpenAI service to process and enrich the data to include LLM-generated metadata including conversation summary, keyphrases, customer satisfaction, and customer complaint
- Data is visualized in a Power BI report to enable users to explore and surface insights
- Notebooks, Lakehouse, and Power BI Report are all stored in Microsoft OneLake
