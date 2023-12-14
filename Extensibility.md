**Future Extensibility** 

The current solution focuses mainly on post-call audio and text
conversation knowledge mining. There are a number of additional
capabilities and considerations that would complement this accelerator and
are areas for extending: 

1.  **Improved system of aggregate insight prompts** 
    > The accelerator utilizes system prompts that are used to derive
    > insights from a conversation. These are customizable within the
    > accelerator configuration, but additional insights may be required
    > based on new use cases for this accelerator, which will require
    > changes to the existing prompts or additional prompts to be
    > created. In addition, new techniques or approaches to the prompt
    > structure may be made to enhance the accuracy and relevancy,
    > especially as new versions of GPT are released.  

2.  **Q&A style interface for users to ask questions across all indexed conversations**
    > In the current accelerator, a keyword search via Azure Cognitive
    > Search is the only way to filter and find conversations relevant
    > to their inquiry. Using a Q&A approach would unlock a
    > conversational approach and follow up questions. This could also
    > be extended to allow users to derive insights on their own,
    > without pre-processing across the full dataset. 

3.  **Power BI dashboard to interact with index tags and insights** 
    > As insights are derived and aggregated, a common approach is to
    > pull these data points into a larger dashboard that integrates
    > with additional systems and data. This could include call center
    > specific dashboards and would allow these insights to be derived from AI
    > to show the full picture with more standard call center KPIs.
    > Given this solution is an example of how to mine these datapoints,
    > a dashboard similar to this would be a common integration in a
    > real-world implementation. 

4.  **Historical reprocessing workflow for all conversations to aggregate new insights as they're authored** 
    > It's common for additional insights or enhancements to prompts to be
    > made over time, but as these changes are made the existing
    > conversations will need to be reprocessed. Currently, the solution
    > does not have a "reprocess" capability and would require the
    > conversations to be removed and then readded. For ease of use, a
    > reprocessing capability could be added to simply rerun the skills on
    > the index either on a regular cadence, or manually running across the
    > full index. This ensures most up-to-date insights and capabilities
    > within the mined knowledgebase. 

5.  **Pre-processing mechanism for simple TXT conversions to the required JSON format** 
    > Text conversations are currently required to be in a single JSON
    > format, but a pre-processing tool could be created to convert a simple
    > text file into the correct JSON format. 

6.  **Video and other conversation formats** 
    > The solution only accepts text and audio based conversations, but this
    > could be extended to support additional formats as well -- including
    > video and images sets. This extends the ability to support additional
    > channels customer service and users interact through, still mining the
    > same knowledge insights into a single system. 

7.  **Opt-out flag on conversations to skip knowledge mining processing**
    > Privacy and legal requirement around data processing is a
    > consideration that all data processing platforms should consider.
    > This solution can be extended to support an explicit parameter or
    > flag on conversations that users have opted out or in to their
    > conversation being processed by ML and AI. The solution can then
    > decide to skip over specific conversations where users have opted
    > out. 
