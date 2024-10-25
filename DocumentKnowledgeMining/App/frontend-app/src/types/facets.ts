export interface Facets {
    locations: Location[]
    document_segments: DocumentSegment[]
    language: Language[]
    "image/captions": Caption[]
    "image/tags": Tag[]
    key_phrases: KeyPhrase[]
    authors: Author[]
    content_group: ContentGroup[]
    "image/categories": Category[]
    persons: Person[]
    organizations: Organization[]
    countries: Country[]
  }
  
  export interface Location {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface DocumentSegment {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Language {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Caption {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Tag {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface KeyPhrase {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Author {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface ContentGroup {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Category {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Person {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Organization {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }
  
  export interface Country {
    value: string
    count: number
    query: any[]
    singlevalued: boolean
  }