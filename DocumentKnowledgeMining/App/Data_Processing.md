## Content Processing
Additional details about how content processing is handled in the solution. This includes the workflow steps and how to use your own data in the solution.

### Workflow

1. <u>Document upload</u><br/>
Documents added to blob storage. Processing is triggered based on file check-in.

2. <u>Text extraction, context extraction (image)</u><br/>
Based on file type, an appropriate processing pipeline is used

3. <u>Summarization</u><br/>
LLM summarization of the extracted content.

4. <u>Keyword and entity extraction</u><br/>
Keywords extracted from full document through an LLM prompt. If document is too large, keywords are extracted from the summarization.

5. <u>Text chunking from text extraction results</u><br/>
Chunking size is aligned with the embedding model size.

6. <u>Vectorization</u><br/>
Creation of embeddings from chunked text using text-embedding-3-large model.

7. <u>Save results to Azure AI Search index</u><br/>
Data added to index including vectorized fields, text chunks, keywords, entity specific meta data.

### Customizing With Your Own Documents

There are two methods to use your own data in this solution. It takes roughly 10-15 minutes for a file to be processed and show up in the index and in results on the web app.

1. <u>Web App - UI Uploading</u><br/>
You can upload through the user interface files that you would like processed. These files are uploaded to blob storage, processed, and added to the Azure AI Search index. File uploads are limited to 500MB and restricted to the following file formats: Office Files, TXT, PDF, TIFF, JPG, PNG.

2. <u>Bulk File Processing</u><br/>
You can take buik file processing since the web app saves uploaded files here also. This would be the ideal to upload a large number of document or files that are large in size. 

### Modifying Processing Prompts 

Prompt based processing is used for context extraction, summarization, and keyword/entity extraction. Modifications to the prompts will change what is extracted for the related workflow step.

You can find the prompt configuration text files for **summarization** and **keyword/entity** extraction in this folder:
```
\App\kernel-memory\service\Core\Prompts\
```

**Context extraction** requires a code re-compile. You can modify the prompt in this code file on <u>line 56</ul>:

```
\App\kernel-memory\service\Core\DataFormats\Image\ImageContextDecoder.cs
 ```