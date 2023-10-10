## **Troubleshooting** 

-   How is the UI deployed?
    - The UI is deployed from an azure container that is updated by GitHub
    actions

-   Why are my customer summaries showing up null?

    -   Why this is happening: Your OpenAI deployment was failing. You
        ran out of quota for the gpt-35-turbo model you were using.

    -   **Solution:** Increase your rate limits on your GPT model

- How do I delete documents from the search service?
    -  To delete documents from the search service follow the instructions here: https://learn.microsoft.com/en-us/rest/api/searchservice/addupdate-or-delete-documents
