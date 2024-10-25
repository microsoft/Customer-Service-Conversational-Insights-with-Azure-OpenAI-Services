export interface MetadataKeysMapping {
  [key: string]: string;
}

export const METADATA_KEYS_MAPPING: MetadataKeysMapping = {
  "index_key": "Index Key",
  "metadata_storage_path": "Metadata Storage Path",
  "metadata_storage_name": "Metadata Storage Name",
  "metadata_storage_size": "Metadata Storage Size",
  "metadata_storage_content_md5": "Metadata Storage Content MD5",
  "content_size": "Content Size",
  "content_encoding": "Content Encoding",
  "description": "Description",
  "creation_date": "Creation Date",
  "last_modified": "Last Modified",
  "processing_date": "Processing Date",
  "source_processing_date": "Source Processing Date",
  "source_last_modified": "Source Last Modified",
  "key_phrases": "Key Phrases",
  "topics": "Topics",
  "organizations": "Organizations",
  "persons": "Persons",
  "locations": "Locations",
  "cities": "Cities",
  "countries": "Countries",
  "language": "Language",
  "translated_language": "Translated Language",
  "paragraphs_count": "Paragraphs Count",
  "summary": "Summary",
  "categories": "Categories",
  "captions": "Captions",
  "title": "Title",
  "translated_title": "Translated Title",
  "author": "Author",
  "content_type": "Content Type",
  "content_group": "Content Group",
  "page_number": "Page Number",
  "page_count": "Page Count",
  "slide_count": "Slide Count",
  "links": "Links",
  "emails": "Emails",
  "document_id": "Document ID",
  "document_filename": "Document Filename",
  "document_url": "Document URL",
  "document_segments": "Document Segments",
  "markets": "Markets",
  "competitions": "Competitions",
  "technologies": "Technologies",
  "user_keywords": "User Keywords",
  "user_categories": "User Categories",
  "user_tags": "User Tags",
  "strategies": "Strategies",
  "tables": "Tables",
  "tables_count": "Tables Count",
  "kvs": "KVS",
  "kvs_count": "KVS Count",
  "geolocation": "Geolocation",
  "restricted": "Restricted",
  "parent_id": "Parent ID",
  "chunk": "Chunk",
  "vector": "Vector",
  "parent": "Parent",
  "image": "Image",
  "email": "Email",
  "document": "Document"
};

export function mapMetadataKeys(metadata: any) {
  const mappedMetadata = {} as any;
  for (const key in metadata) {
      if (METADATA_KEYS_MAPPING.hasOwnProperty(key)) {
          mappedMetadata[METADATA_KEYS_MAPPING[key]] = metadata[key];
      }
  }
  return mappedMetadata;

}