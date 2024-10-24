## Knowledge Mining Solution Accelerator: Responsible AI FAQ
- ### What is Knowledge Mining Solution Accelerator?

  This solution accelerator is an open-source GitHub Repository to help ingest, extract, and classify content from a high volume of assets to gain deeper insights and generate relevant suggestions for quick and easy reasoning. It enables the ability to analyze, compare, and summarize content with multi-modal processing of documents, handwritten text, charts, graphs, tables, and form fields. It leverages Azure OpenAI Services and Azure AI Document Intelligence in a hybrid approach by combining Optical Character Recognition (OCR) and multi-modal Large Language Model (LLM) to extract information from documents to provide insights without pre-training.

- ### What can Knowledge Mining Solution Accelerator do? 
  The sample solution focuses on a mortgage lender working with both residential and commercial clients who facilitates financing for buyers and sellers by negotiating loan terms, processing mortgage applications, and ensures compliance with federal regulations.

  The sample data is sourced from publicly available documents from the Federal Housing Finance Agency (FHFA). The documents are intended for use as sample data only. The sample solution processes the documents with Azure AI Document Intelligence and Azure OpenAI, storing the content in an Azure AI Search index. This enables a user interface that has a faceted search results of the indexed documents to allow users to search and filter to find relevant documents to their query. Users can select one or more documents from the search results to chat with – which uses these documents in a RAG pattern to ground the LLM response.
  
- ### What is/are Knowledge Mining Solution Accelerator’s intended use(s)?

  This repository is to be used only as a solution accelerator following the open-source license terms listed in the GitHub repository. The example scenario’s intended purpose is to demonstrate how users can find and review relevant documents based on extracted document data to help them work more efficiently and streamline their human made decisions.

- ### How was Knowledge Mining Solution Accelerator evaluated? What metrics are used to measure performance?
  
  We have used AI Studio Prompt flow evaluation SDK to test for harmful content, groundedness, and potential security risks. 
  
- ### What are the limitations of Knowledge Mining Solution Accelerator? How can users minimize the impact Knowledge Mining Solution Accelerator’s limitations when using the system?
  
  This solution accelerator can only be used as a sample to accelerate the creation of knowledge mining solutions. The repository showcases a sample scenario of a mortgage lender finding and reviewing documents to use in their work, but they’re still responsible to validate the accuracy and correctness of data extracted for these document and their relevancy for using with customers. It doesn’t provide financial advice, and the use case is meant for demonstration purposes only. Users of the accelerator should review the system prompts provided and update as per their organizational guidance. Users should run their own evaluation flow either using the guidance provided in the GitHub repository or their choice of evaluation methods. AI generated content in the solution may be inaccurate and should be manually reviewed by the user and does not provide financial guidance or advice. Right now, the sample repository is available in English only.

- ### What operational factors and settings allow for effective and responsible use of Knowledge Mining Solution Accelerator?
  
  Users can try different values for some parameters like system prompt, temperature, max tokens etc. shared as configurable environment variables while running run evaluations during document processing or chatting. Please note that these parameters are only provided as guidance to start the configuration but not as a complete available list to adjust the system behavior. Please always refer to the latest product documentation for these details or reach out to your Microsoft account team if you need assistance.