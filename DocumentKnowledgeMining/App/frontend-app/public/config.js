window.ENV = {
    ENVIRONMENT: "local",
    API_URL: "",
    APP_INSIGHTS_CS: "InstrumentationKey=?;IngestionEndpoint=?",
    AUTH: {
        clientId: "3e40f214-b9cf-4946-bf34-ff34e0fe1d3b",
        authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
        b2cPolicies: undefined,
        cacheLocation: "localStorage",
        knownAuthorities: ["login.microsoftonline.com"],
        resources: {
            api: {
                endpoint: "",
                scopes: ["api://3e40f214-b9cf-4946-bf34-ff34e0fe1d3b/api.access"],
            },
        },
    },
    METADATA_EXCLUSION_LIST: [
        "thumbnail_medium",
        "thumbnail_small",
        "height",
        "width",
        "ratio",
        "content_size",
        "metadata_storage_content_md5",
        "metadata_storage_size",
        "tables",
    ],
    AI_KNOWLEDGE_FIELDS: [
        "organizations",
        "persons",
        "locations",
        "key_phrases",
        "cities",
        "countries"
    ],
    AI_KNOWLEDGE_FIELDS_ELEMENTS: 25,
    STORAGE_URL: ""
    
};
