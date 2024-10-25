export interface SingleDocument {
    indexName: any
    result: Result
    results: any
    count: any
    tokens: Tokens
    storageIndex: number
    facets: any
    searchId: any
    idField: any
    isSemanticSearch: boolean
    isPathBase64Encoded: boolean
    semanticAnswers: any
    webSearchResults: any
    queryTransformations: any
  }
  
  export interface Result {
    index_key: string
    metadata_storage_path: string
    metadata_storage_name: string
    metadata_storage_size: number
    metadata_storage_content_md5: string
    content: string
    content_size: number
    content_encoding: any
    description: any
    creation_date: string
    last_modified: string
    processing_date: any
    source_processing_date: string
    source_last_modified: string
    key_phrases: string[]
    topics: any[]
    organizations: string[]
    persons: any[]
    locations: string[]
    cities: string[]
    countries: string[]
    language: string
    translated_language: string
    translated_text: string
    paragraphs: any[]
    paragraphs_count: any
    summary: string[]
    categories: any[]
    captions: any[]
    title: string
    translated_title: string
    author: string
    content_type: string
    content_group: string
    page_number: number
    page_count: string
    slide_count: any
    links: any[]
    emails: any[]
    document_id: string
    document_filename: string
    document_url: string
    document_segments: any[]
    markets: any[]
    competitions: any[]
    technologies: any[]
    user_keywords: any[]
    user_categories: any[]
    user_tags: any[]
    strategies: any[]
    tables: any[]
    tables_count: any
    kvs: any
    kvs_count: any
    geolocation: any
    restricted: boolean
    parent_id: any
    chunk: any
    vector: any[]
    parent: Parent
    image: any
    email: any
    document: Document
  }
  
  export interface Parent {
    key: any
    id: any
    filename: any
    url: any
    content_group: any
    document_embedded: any
  }
  
  export interface Document {
    embedded: boolean
    converted: boolean
    translated: boolean
    translatable: boolean
  }
  
  export interface Tokens {
    documents: string
    images: string
    metadata: string
    translation: string
  }
  