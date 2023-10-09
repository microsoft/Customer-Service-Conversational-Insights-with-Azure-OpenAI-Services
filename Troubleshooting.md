## **Troubleshooting** 

-   The UI is deployed from an azure container that is updated by GitHub
    actions

-   Why are my customer summaries showing up null?

    -   Why this is happening: Your OpenAI deployment was failing. You
        ran out of quota for the gpt-35-turbo model we were using.

    -   **Solution:** Increase your rate limits on your GPT model

- To delete deployed resources
    - https://learn.microsoft.com/en-us/rest/api/searchservice/addupdate-or-delete-documents
