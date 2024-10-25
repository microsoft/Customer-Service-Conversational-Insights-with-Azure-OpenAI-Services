export interface SearchRequest {
    queryText: string;
    searchFacets: SearchFacet[];
    currentPage: number;
    incomingFilter: string;
    filters?: string[];
    parameters: {
        scoringProfile: string;
        inOrderBy: string[];
        rowCount: number;
    };
    startDate?: string;
    endDate?: string;
}

export interface FacetValue {
    value: string | null;
    count: number;
    query: string[] | null;
    singlevalued: boolean;
}

export interface SearchFacet {
    key: string | null;
    values: FacetValue[] | null;
    type: string | null;
    operator: string | null;
    target: string | null;
}
