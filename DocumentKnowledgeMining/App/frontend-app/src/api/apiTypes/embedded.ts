import { SlotRenderFunction } from "@fluentui/react-components"
import { DetailedHTMLProps, HTMLAttributes, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, RefObject } from "react"
// Removed import for ReactI18NextChildren as it is not exported by react-i18next

export interface Embedded {
    indexName: string
    result: any
    results: Result[]
    count: number
    tokens: Tokens
    storageIndex: number
    facets: Facets
    searchId: string
    idField: string
    isSemanticSearch: boolean
    isPathBase64Encoded: boolean
    semanticAnswers: any
    webSearchResults: any
    queryTransformations: any
  }
  
  export interface Result {
    Score: number
    Highlights: any
    SemanticSearch: SemanticSearch
    Document: Document
  }
  
  export interface SemanticSearch {
    RerankerScore: any
    Captions: any
  }
  
  export interface Document {
    page_number: ((string | number | boolean | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode>) & (string | number | boolean | ReactPortal | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | SlotRenderFunction<Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & { ref?: ((instance: HTMLSpanElement | null) => void) | RefObject<HTMLSpanElement> | null | undefined }>)) | null | undefined
    documentId: string;  // Unique document identifier
    fileName: string;    // Name of the file
    keywords: {          // Keywords object with dynamic keys and comma-separated string values
      [key: string]: string;
    };
    importedTime: string;      // ISO timestamp for when the document was imported
    processingTime: string;    // Time taken to process the document
    mimeType: string;          // MIME type of the document (e.g., PDF, DOCX)
    summary: string;           // Summary of the document's contents
    id: string;                // Additional identifier
    __partitionkey: string;    // Partition key (specific to your data structure)
    // index_key: string
    // metadata_storage_path: string
    // metadata_storage_name: string
    // metadata_storage_size: number
    // metadata_storage_content_md5: string
    // content_size: number
    // content_encoding: any
    // description: any
    // creation_date: string
    // last_modified: string
    // processing_date: any
    // source_processing_date: string
    // source_last_modified: string
    // key_phrases: string[]
    // topics: any[]
    // organizations: string[]
    // persons: string[]
    // locations: string[]
    // cities: string[]
    // countries: string[]
    // language: string
    // translated_language: string
    // paragraphs_count: number
    // summary: string[]
    // categories: any[]
    // captions: any[]
    // title: string
    // translated_title: string
    // author: string
    // content_type: string
    // content_group: string
    // page_number: number
    // page_count: any
    // slide_count: any
    // links: any[]
    // emails: any[]
    // //		Index_key -> document Id
    // // 		imageUrl
    // // 		Filename
    // // 		Filelocation
    // // 		Tags
    // // 		Uploadtime
    // // 		LatestProcessTime
    // //    Status
    // // Chat history id per document?
    // document_id: string
    // document_filename: string
    document_url: string
    // document_segments: string[]
    // markets: any[]
    // competitions: any[]
    // technologies: any[]
    // user_keywords: any[]
    // user_categories: any[]
    // user_tags: any[]
    // strategies: any[]
    // tables: string[]
    // tables_count: number
    // kvs: string
    // kvs_count: number
    // geolocation: any
    // restricted: boolean
    // parent_id: any
    // chunk: any
    // vector: any[]
    // parent: Parent
    // image: Image
    // email: any
    // document: Document2
  }
  
  export interface Parent {
    key: string
    id: string
    filename: string
    url: string
    content_group: string
    document_embedded: boolean
  }
  
  export interface Image {
    width: number
    height: number
    ratio: number
    thumbnail_medium: string
    thumbnail_small: string
    image_data: any
    categories: string[]
    tags: string[]
    captions: string[]
    celebrities: any[]
    landmarks: any[]
    brands: any[]
    objects: string[]
  }
  
  export interface Document2 {
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
  
  export interface Facets {}