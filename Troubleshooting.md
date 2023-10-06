## **Troubleshooting** 

-   The UI is deployed from an azure container that is updated by GitHub
    actions

-   How do I run this locally?

    -   To run the UI locally you must install .NET Core 3.1 (NOTE: this
        is not the latest version and must be installed explicitly)

    -   Open the GBB.ConversationalKM.sln file in Visual studio

    -   Click the play button with IIS
        Express![](/media/image.png){width="5.0in" height="0.3125in"}

    -   On first launch local host type thisissafe on keyboard anywhere
        on page![](/media/image2.png){width="5.0in" height="4.875in"}

-   Why are my customer summaries showing up null?

    -   Why this is happening: Your OpenAI deployment was failing. You
        ran out of quota for the gpt-35-turbo model we were using.

    -   **Solution:** Increase your rate limits on your GPT model

    -   
