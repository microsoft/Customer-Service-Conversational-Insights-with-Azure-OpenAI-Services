# Cognitive Search UI Template
This folder contains a basic web front end that can be used to quickly create a view of your search results.  With just a few simple steps, you can configure this template UI to query your newly created search index.

The Cognitive Search Template contains a .NET Core MVC Web app used as a Template UI for querying a search index. This is the focus of this README.

In just a few steps, you can configure this template UI to query your search index. This template will render a web page similar to the following:

![web user interface](/images/readMe/image2.png)

## Prerequisites

1. Visual Studio 2017 or newer

## 1. Update appsettings.json

To configure your web app to connect to your Azure services, simply update the *appsettings.json* file.

This file contains a mix of required and optional fields described below.

### Required fields

```json
  // Required fields
  "SearchServiceName": "",
  "SearchApiKey": "",
  "SearchIndexName": "",
  "SearchIndexerName": "",
  "StorageAccountName": "",
  "StorageAccountKey": "",
  "StorageContainerAddress": "https://{storage-account-name}.blob.core.windows.net/{container-name}",
  "KeyField": "metadata_storage_path",
  "IsPathBase64Encoded": true,
```

1. **SearchServiceName** - The name of your Azure Cognitive Search service
2. **SearchApiKey** - The API Key for your Azure Cognitive Search service
3. **SearchIndexName** - The name of your Azure Cognitive Search index
4. **SearchIndexerName** - The name of your Azure Cognitive Search indexer
5. **StorageAccountName** - The name of your Azure Blob Storage Account
6. **StorageAccountKey** - The key for your Azure Blob Storage Account
7. **StorageContainerAddress** - The URL to the storage container where your audio files are stored. This should be in the following format: *https://*storageaccountname*.blob.core.windows.net/*containername**
8. **StorageContainerAddress2** - The URL to the storage container where your documents are stored. This should be in the following format: *https://*storageaccountname*.blob.core.windows.net/*containername**
9. **KeyField** - They key field for your search index. This should be set to the field specified as a key document Id in the index. By default this is *metadata_storage_path*.
10. **IsPathBase64Encoded** - By default, metadata_storage_path is the key, and it gets base64 encoded so this is set to true by default. If your key is not encoded, set this to false.

### Optional Fields

While some fields are optional, we recommend not removing them from *appsettings.json* to avoid any possible errors.

```json
  // Optional instrumentation key
  "InstrumentationKey": "",

  // Optional container addresses if using more than one indexer:
  "StorageContainerAddress3": "https://{storage-account-name}.blob.core.windows.net/{container-name}",

  // Optional key to an Azure Maps account if you would like to display the geoLocation field in a map
  "AzureMapsSubscriptionKey": "",

  // Set to the name of a facetable field you would like to represent as a graph.
  // You may also set to a comma separated list of the facet names if you would like more than one facet type on the graph.
  "GraphFacet": "keyPhrases, locations",

  // Additional Customizations
  "Customizable": "true",
  "OrganizationName": "Microsoft",
  "OrganizationLogo": "~/images/logo.png",
  "OrganizationWebSiteUrl": "https://www.microsoft.com"

```

1. **InstrumentationKey** - Optional instumentation key for Application Insights. The instrumentation key connects the web app to Application Inisghts in order to populate the Power BI reports.
2. **StorageContainerAddress2** & **StorageContainerAddress3** - Optional container addresses if using more than one indexer
3. **AzureMapsSubscriptionKey** - You have the option to provide an Azure Maps account if you would like to display a geographic point in a map in the document details. The code expects a field called *geolocation* of type Edm.GeographyPoint. If your wish to change this behavior (for instance if you would like to use a different field), you can modify details.js.
4. **GraphFacet** - The GraphFacet is used for generating the relationship graph. This can now be edited in the UI.
5. **Customizable** - Determines if user is allowed to *customize* the web app. Customizations include uploading documents and changing the colors/logo of the web app. **OrganizationName**,  **OrganizationLogo**, and **OrganizationWebSiteUrl** are additional fields that also allow you to do light customization.

## 2. Update SearchModel.cs

At this point, your web app is configured and is ready to run. By default, all facets, tags, and fields will be used in the UI.

If you would like to further customize the UI, you can update the following fields in *Search\SearchModel.cs*. You can select the filters that you are able to facet on, the tags shown with the results, as well as the fields returned by the search.

**Facets** - Defines which facetable fields will show up as selectable filters in the UI. By default all facetable fields are included.

**Tags** - Defines which fields will be added to the results card and details view as buttons. By default all facetable fields are included.

**ResultFields** - Defines which fields will be returned in the results view. Only fields that are used for the UI should be included here to reduce latency caused by larger documents. By default all fields are included.

## 3. Aggregated Analytics 
There are two insight cards at the top of the home page search, one called Average Customer Satisfaction and the other called Top Discussed Cities. These cards provide insights & analysis across the various conversations uploaded and stored in Azure Cognitive Search index.

The Average Customer Satisfaction card provides two percentages, percentage of satisfied customers & percentage of unsatisfied customers, as well as the top 5 negative customer complaint trends. The Top Discussed Cities card provides two fields, the top origin city and the top destination city, as well as the top 5 negative hotel trends. 

These insights show a sample of what could be derived from the content stored in the Azure Cognitive Search index and can be easily customized and extended based on the available data and facets.

**Added Functionality** 

The insights shown in the cards include data that has been processed in our HomeController, from a query against an Azure Cognitive Search Index. Our Azure Cognitive Search Index contains all uploaded conversations and have processing applied via Azure OpenAI and cognitive skills. Shown below is query result displaying attributes for a single processed conversation. ![image](/images/UpdatingUI/searchIndex.png)

Using the Azure Cognitive Search API, the search index is queried within the HomeController. The returned data include Facets that are already available from the index content and these are used to generate insights across the conversations. Each depending on the insight, that is being generated, different facets should be looked to. In our example, aggregated insights around customer sentiment are compared to the positive and negative sentiment that was calculated in that Facet. These calculated values are then passed to the view model that will be displayed on the Search.cshtml view. The model is shown below. ![image](/images/UpdatingUI/model.png)

Below is a snippet of the function for retrieving customer satisfaction insights by utilizing the Facets.
![image](/images/UpdatingUI/function.png)





## 4. Add additional customization

This template serves as a great baseline for a Cognitive Search solution, however, you may want to make additional updates depending on your use case.

We have a special behavior if you have a field called *translated_text*. The UI will automatically show the original text and the translated text in the UI. This can be handy. If you would like to change this behavior (disable it, or change the name of the field), you can do that at details.js (GetTranscriptHTML method).

 ## 5. How do I run this locally?
  1. To run the UI locally you must install .NET Core 3.1 (NOTE: this
        is not the latest version and must be installed explicitly)

  2. Open the GBB.ConversationalKM.sln file in Visual Studio

  3. Click the play button with IIS
        Express![image](/images/Troubleshooting/image.png)

  4. On first launch on local host type thisissafe on keyboard anywhere on the page               
        ![image](/images/Troubleshooting/image2.png)

 ## 6. How do I deploy my local changes?
  1. To automatically deploy changes when pushing to GitHub you must enable GitHub actions
  2. Create a container registry in Azure
  3. Store your container credentials in GitHub secrets 
  4. You now should be able to utilize docker-image-web-ui.yml workflow to deploy recent master branch changes to your container

### Key Files

Much of the UI is rendered dynamically by javascript. Some important files to know when making changes to the UI are:

1. **wwroot/js/results.js** - contains the code used to render search results on the UI

2. **wwroot/js/details.js** - contains the code for rending the detail view once a result is selected

3. **Search/DocumentSearchClient.cs** - contains the code for talking with Azure Cognitive Search's APIs. Setting breakpoints in this file is a great way to debug.
