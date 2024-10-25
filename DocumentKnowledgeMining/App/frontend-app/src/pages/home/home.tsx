import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    Dropdown,
    makeStyles,
    Option,
    shorthands,
  } from "@fluentui/react-components";

import { Text } from "@fluentui/react-components";
import { DateFilterDropdownMenu } from '../../components/datePicker/dateFilterDropdownMenu'; // Adjust the path accordingly


import { useTranslation } from "react-i18next";
import { HeaderBar, NavLocation } from "../../components/headerBar/headerBar";
import { Button, Spinner } from "@fluentui/react-components";
import { Header } from "../../components/header/header";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchBox, SearchBoxHandle } from "../../components/searchBox/searchBox";
import { SearchResultCard } from "../../components/searchResult/searchResultCard";
import { SearchFacet, SearchRequest } from "../../types/searchRequest";
import { HeaderMenuTabs } from "../../components/headerMenu/HeaderMenuTabs";
import { DocumentResults } from "../../api/apiTypes/documentResults";
import { searchDocuments } from "../../api/documentsService";
import { FilterButton } from "../../components/filter/showHideFilterButton";
import { Filter } from "../../components/filter/filter";
import { Pagination } from "../../components/pagination/pagination";
import { OrderBy } from "../../components/orderBy/orderBy";
import { Document } from "../../api/apiTypes/documentResults";
import { AppContext } from "../../AppContext";
import { SidecarCopilot } from "../../components/sidecarCopilot/sidecar";
//import styles from "../../components/sidecarCopilot/sidecar.module.scss";
import homeStyles from "./home.module.scss";
import { ChatRoom } from "../../components/chat/chatRoom";
import UploadFilesButton from "../../components/uploadButton/uploadButton";

const useStyles = makeStyles({
    dropdown: {
      width: '10%',  // Full width by default
      maxWidth: '200px',  // Set a maximum width if needed
    },
  });


interface HomeProps {
    isSearchResultsPage?: boolean;
}
export function Home({ isSearchResultsPage }: HomeProps) {
    const [filter, setFilter] = useState({
        option: null,
        startDate: null,
        endDate: null,
    });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [reset, setReset] = useState(false);  // State to trigger reset

    const [clearAllTriggered, setClearAllTriggered] = useState(false);
    const [clearFilters, setClearFilters] = useState(false);
    const [resetSearchBox, setResetSearchBox] = useState(false);
    const handleFilterCleared = () => {
        setClearFilters(false);
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [areFiltersVisible, setAreFiltersVisible] = useState(true);
    const [showCopilot, setShowCopilot] = useState<boolean>(false);
    const [incomingFilter, setIncomingFilter] = useState(
        "(document/embedded eq false and document/translated eq false)"
    );
    const [selectedKeywords, setSelectedKeywords] = useState<{ [key: string]: string[] }>({});
    const [scoringProfile, setScoringProfile] = useState("");
    const [data, setData] = useState<DocumentResults>();
    const [coverImages, setCoverImages] = useState<(string | undefined)[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<Document[]>(
        location.state ? location.state.selectedDocuments : []
    );
    const [rowCount, setRowCount] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [inOrderBy, setInOrderBy] = useState<string>("");
    const [searchResultDocuments, setSearchResultDocuments] = useState<Document[]>([]);

    const [selectedDocument, setSelectedDocument] = useState<Document[]>([]);
    const { query, setQuery, filters: persistedFilters, setFilters: setPersistedFilters } = useContext(AppContext);
    const [selectedDateFilter, setSelectedDateFilter] = useState(null);
    // const tempFilter = new SearchFacet
    const inheritedTokens = location.state ? location.state.tokens : null;
    const chatWithSingleSelectedDocument: Document[] = location.state ? location.state.chatWithSingleSelectedDocument : [];
    
    //Search box behaviour
    const searchBoxRef = React.createRef<SearchBoxHandle>();

    // Inside your Home component
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    //for get the value from search textbox
    const [textValue, setTextValue] = useState('');
    // Calculate date range based on the selected option
    const calculateDateRange = (option: string) => {
        const now = new Date();
        let startDate: Date | null = null;
        let endDate: Date | null = now; // Default to current date for the end date
    
        switch (option) {
            case "Past 24 hours":
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
                break;
            case "Past week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
                break;
            case "Past month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
                break;
            case "Past year":
                    startDate = new Date(now); // Create a new copy of now for startDate
                    startDate.setFullYear(now.getFullYear() - 1); // 1 year ago
                    break;
            default:
                startDate = customStartDate; // Custom dates set by user
                endDate = customEndDate || now; // If custom end date is not set, default to now
        }
        if (!startDate) {
            endDate = null;
        }
        // Ensure endDate is always later than or equal to startDate
        if (startDate && endDate && endDate < startDate) {
            endDate = startDate;
        }
    
        return { startDate, endDate };
    };
    
    
    // Handler to update the filter values whenever they change in the dropdown
    const handleFilterChange = (newFilter: any) => {
        setFilter(newFilter);
        setSelectedOption(newFilter.option);
        
    };

    useEffect(() => {
        if (searchBoxRef.current) {
            if (resetSearchBox) {
                
                searchBoxRef.current.reset();
                setResetSearchBox(false); // Reset the trigger
            } else {
                const urlQuery = searchParams.get("q");
                if (urlQuery) {
                    const decodedQuery = decodeURIComponent(urlQuery);
                    searchBoxRef.current.setValue(decodedQuery);
                }
            }
        }
    }, [searchParams, resetSearchBox]);
    
    useEffect(() => {
        if (isSearchResultsPage) {
            if (query) {
                const updatedSearchParams = new URLSearchParams();
                updatedSearchParams.set("q", encodeURIComponent(query));
                setSearchParams(updatedSearchParams);
            } else {
                setSearchParams({}); // Clear all search params when there's no query
            }
        } else {
            const q = searchParams.get("q");
            if (q) {
                setQuery(decodeURIComponent(q)); 
            }
        }
    }, [isSearchResultsPage, query, searchParams, setSearchParams]);

    function onSearchChanged(searchValue: string): void {
        if (searchValue) {
            setTextValue(searchValue);
        }
        if (searchValue) {
            setQuery(searchValue);
            setCurrentPage(1);
            if (isSearchResultsPage) {
                const updatedSearchParams = new URLSearchParams(searchParams.toString());
                updatedSearchParams.set("q", encodeURIComponent(searchValue));
                setSearchParams(updatedSearchParams.toString());
                setQuery(searchValue);
            } else {
                navigate(`/search?q=${encodeURIComponent(searchValue)}`);
            }
        } else {
            setSearchResultDocuments([]);
            setSearchParams("");
            setQuery(searchValue);
        }
    }

    //Pagination
    const totalPages = data?.totalPages
    const siblingCount = 2;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    //Filter & sort
    function onFilterChanged(selectedKeywords: { [key: string]: string[] }): void {
        
        setSelectedKeywords(selectedKeywords);
        setIncomingFilter(incomingFilter);
        setPersistedFilters(selectedKeywords); // Store the selected keywords
            // Convert selected filters to a query string format
        const filtersAsString = Object.entries(selectedKeywords)
        .map(([key, values]) => `${key}=${values.join(",")}`)
        .join("&");

        // Update the URL with the filters
        const updatedSearchParams = new URLSearchParams(searchParams.toString());
        updatedSearchParams.set("filters", filtersAsString);
        setSearchParams(updatedSearchParams.toString());
        setCurrentPage(1); // Reset the current page to 1
        
        
    }

    function onFilterPress(): void {
        setAreFiltersVisible((prevAreFiltersVisible) => !prevAreFiltersVisible);
    }

    const handleSortSelected = (sort: string) => {
        setInOrderBy(sort);
    };

    //Sidecar Copilot
    function toggleCopilot(): void {
        setShowCopilot(!showCopilot);
    }

    const headerMenuTabsRef = useRef<HTMLDivElement>(null);

    const [widthClass, setWidthClass] = useState(window.innerWidth > 2000 ? "w-[165%]" : "w-[125%]");

    useEffect(() => {
        const filtersFromUrl = searchParams.get("filters");
    
        if (filtersFromUrl) {
            const filters: { [key: string]: string[] } = filtersFromUrl.split("&").reduce((acc, filter) => {
                const [key, values] = filter.split("=");
                acc[key] = values.split(",");
                return acc;
            }, {} as { [key: string]: string[] });
    
            setSelectedKeywords(filters);
            setPersistedFilters(filters);
        }
    }, []); // Only run once on mount
    
    useEffect(() => {
        if (selectedKeywords) {
            localStorage.setItem("filters", JSON.stringify(selectedKeywords));
        }
    }, [selectedKeywords]);

    useEffect(() => {
        const filtersFromUrl = searchParams.get("filters");
    
        if (filtersFromUrl) {
            // Load from URL
            const filters: { [key: string]: string[] } = filtersFromUrl.split("&").reduce((acc, filter) => {
                const [key, values] = filter.split("=");
                acc[key] = values.split(",");
                return acc;
            }, {} as { [key: string]: string[] });
    
            setSelectedKeywords(filters);
            setPersistedFilters(filters);
        } else {
            // Load from local storage
            const filtersFromLocalStorage = localStorage.getItem("filters");
            if (filtersFromLocalStorage) {
                const filters = JSON.parse(filtersFromLocalStorage);
                setSelectedKeywords(filters);
                setPersistedFilters(filters);
            }
        }
    }, []);    

    useEffect(() => {
        const handleResize = () => {
            setWidthClass(window.innerWidth > 2000 ? "w-[165%]" : "w-[125%]");
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //API call
    useEffect(() => {
        loadDataAsync();
    }, [currentPage, inOrderBy, persistedFilters, query]);

    // Call loadDataAsync when the dropdown changes
    useEffect(() => {
        if (selectedOption) {
            loadDataAsync();
        }
    }, [selectedOption]); // Dependency array: triggers when selectedOption changes

    // const handleDateRange = () => {
    //     // Assume calculateDateRange is a function that returns startDate and endDate
    //     const { startDate, endDate } = calculateDateRange(selectedOption || "");
    
    //     // Update the state with the calculated dates
    //     setCustomStartDate(startDate);
    //     setCustomEndDate(endDate);
    //   };

    // Your loadDataAsync function
    async function loadDataAsync() {
        setIsLoading(true);
        setCoverImages([]);

        const searchFacets: SearchFacet[] = Object.entries(persistedFilters).map(([key, values]) => ({
            key: key,
            values: values.map((value) => ({
                value: value,
                count: 0,
                query: null,
                singlevalued: false,
            })),
            type: "dynamic",
            operator: "OR",
            target: key,
        }));

        // Convert array values to strings
        function convertArrayValuesToString(obj: { [key: string]: string[] }): { [key: string]: string } {
            const result: { [key: string]: string } = {};
            for (const key in obj) {
                result[key] = obj[key].join(", ");
            }
            return result;
        }

        const selectedFilters = convertArrayValuesToString(selectedKeywords);
        let startDate, endDate;
    
        if (clearAllTriggered) {
            startDate = null;
            endDate = null;
            setClearAllTriggered(false); // Reset the flag
        } else {
            const dateRange = calculateDateRange(selectedOption || "");
            startDate = dateRange.startDate;
            endDate = dateRange.endDate;
        }
        // handleDateRange();
        const payload: SearchRequest = {
            queryText: query || "*",
            searchFacets: searchFacets,
            currentPage: currentPage,
            incomingFilter: "",
            filters: selectedFilters,
            parameters: {
                scoringProfile: scoringProfile,
                inOrderBy: [inOrderBy],
                rowCount: rowCount,
            },
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
        };
        
        const response: DocumentResults = await searchDocuments(payload);

        if (response && response.documents) {
            setData(response);
        } else {
            console.error("API response or data is undefined");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setCoverImages([]);

        if (data && data.documents) {
            const fetchCoverImages = async () => {
                const docIds: string[] = data.documents.map((x) => x.documentId);

                // const coverImages: (string | undefined)[] = await Promise.all(
                //     docIds.map(async (docId) => {
                //         try {
                //             const response: CoverImage = await getCoverImage(docId);
                //             return `data:image/jpeg;base64,${response.base64}`;
                //         } catch (error) {
                //             return undefined;
                //         }
                //     })
                // );
                // setCoverImages(coverImages);
            };

            fetchCoverImages();
        }
    }, [data]);

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(date);
    };
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [searchResultDocuments, selectedDocuments]);

    useEffect(() => {
        if (reset) {
            // Reset has been processed, set it back to false
            setReset(false);
        }
    }, [reset]);

    //Document interactions
    useEffect(() => {
        if (data && query) {
            const searchResults = data.documents;
            //const searchResults = data.documents.map((x) => x.documentId);
            setSearchResultDocuments(searchResults);
        }
    }, [data]);

    function handleChatWithDocument(document: Document) {
        setSelectedDocument([document]);
        
        setShowCopilot(true);
        if (headerMenuTabsRef.current && showCopilot === false) {
            headerMenuTabsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }


    const handleClearAll = useCallback(() => {
        
        setResetSearchBox(true);
        setReset(true); // Trigger reset
        setCustomStartDate(null);
        setCustomEndDate(null);
        setSelectedKeywords({});
        setSelectedDocuments([]);
        setClearAllTriggered(true); // Set this flag to true
        setClearFilters(true);
        // Call loadDataAsync after clearing
        loadDataAsync();
    }, [/* dependencies */]);

    const updateSelectedDocuments = (document: Document) => {
        setSelectedDocuments((prevDocuments: Document[]) => {
            const isAlreadySelected = prevDocuments.some(
                (prevDocument) => prevDocument.documentId === document.documentId
            );
            

            if (isAlreadySelected) {
                return prevDocuments.filter((prevDocument) => prevDocument.documentId !== document.documentId);
            } else {
                return [...prevDocuments, document];
            }
        });
    };
    const styles = useStyles();
    return (
        <>
            <Header className="flex flex-col justify-between bg-contain bg-right-bottom bg-no-repeat" size="small">
                <div className="-ml-8">
                    <HeaderBar location={NavLocation.Home} />
                </div>
                <div>
                    <div>
                        {/* <h1 className="max-sm:text-3xl">{t("pages.home.title")}</h1> */}
                        {/* <div className="mb-10 w-full text-lg md:w-1/2">{t("pages.home.subtitle")}</div> */}
                        {/* <SearchBox
                            ref={searchBoxRef}
                            className={`flex w-full ${
                                // !isSearchResultsPage
                                //     ? "items-center"
                                //     :
                                "-mb-5 mt-10 justify-center justify-items-center pb-5 pt-5 max-sm:items-center"
                            }`}
                            labelClassName={`font-semilight ${
                                // !isSearchResultsPage
                                //     ? "text-[23px] max-sm:text-base"
                                //     :
                                "text-[33px] max-sm:text-base leading-8"
                            }`}
                            inputClassName="max-w-xs flex-grow"
                            onSearchChanged={onSearchChanged}
                            initialValue={query}
                        /> */}
                    </div>
                </div>
            </Header>

<main className="w-full h-full flex flex-col">
    <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Section: Filter */}
        <div className={`flex flex-col w-full bg-white shadow-md p-4 ${homeStyles["no-bottom-padding"]} ${homeStyles["filters-panel"]}`}>
            {/* Keep the FilterButton at the top */}
            <div className="mb-4">
                <FilterButton onFilterPress={onFilterPress} />
            </div>
            {areFiltersVisible && (
                            <Filter
                            onFilterChanged={onFilterChanged}
                            prevSelectedFilters={persistedFilters}
                            keywordFilterInfo={data?.keywordFilterInfo}
                            clearFilters={clearFilters}
                            onFilterCleared={handleFilterCleared}
                        />
                        )}
        </div>

        {/* Right Section: Search Box and Fluent v2 Dropdown */}
        <div className={`flex flex-col w-full bg-white shadow-md p-4 ${homeStyles["no-bottom-padding"]} ${homeStyles["documents-panel"]}`}>
        <div className="flex flex-row items-center space-x-2"> {/* Adjusted space between elements */}
            {/* Search Box */}
            <SearchBox
                ref={searchBoxRef}
                className="w-[20.5rem]"  // Set width to 16rem (256px), adjust as needed for desired size
                placeholder={t("search:Search")}
                onSearchChanged={(searchValue) => {
                    onSearchChanged(searchValue);
                    
                    
                }}
                onKeyDown={(e) => {
                    // Check if the 'Enter' key is pressed
                    if (e.key === 'Enter') {
                        const searchValue = (e.target as HTMLInputElement).value;
                        onSearchChanged(searchValue);  // Update query when Enter is pressed
                        
                        
                    }
                }}
            />

            {/* Fluent v2 Dropdown aligned left */}
            <div className="flex-grow"> {/* Allow this div to take the remaining space */}

            {/* Pass the handler to the DateFilterDropdownMenu */}
            <DateFilterDropdownMenu onFilterChange={handleFilterChange} selectedFilter={selectedDateFilter || ""} reset={reset}/>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4">
            <Text weight="semibold" size={400}>Documents</Text>
            <div className="flex items-center space-x-2">
                <Button appearance="subtle" color="danger" onClick={handleClearAll}>Clear all</Button>
                <UploadFilesButton />
            </div>
        </div>

            <div className="mt-4">
                
                
            </div>
            <div className={`mt-5 no-scrollbar flex flex-col md:flex-row flex-grow overflow-y-auto ${homeStyles["results-container"]}`}>
                        <div className="flex flex-col">
                            {isLoading && (
                                <div className="mt-16 w-full">
                                    <Spinner size="extra-large" />
                                </div>
                            )}
                {!isLoading && (
                    <div className=" mt-5">
                        {data && data.documents.length > 0 ? (
                            data.documents.map((item, index) => {
                                // 

                // Transform the item to match the Document structure
                // const documentToPass = {
                //     document_id: item.documentId, // Adjust according to your data structure
                //     title: item.sourceName, // Replace with the correct field
                //     content_group: item.sourceContentType.split('/')[1], // Get file type
                //     summary: item.partitions.map(part => part.text).join(' '), // Join partition texts
                //     author: item.author || "Unknown Author", // Default if no author
                //     source_last_modified: new Date(item.source_last_modified).toLocaleDateString(), // Format date
                //     key_phrases: item.partitions.map(part => part.text.split(' ').slice(0, 3).join(' ')), // Example key phrases
                // };

                return (
                    <SearchResultCard
                        key={index}
                        document={item} // Pass transformed document
                        coverImageUrl={coverImages[index]}
                        selectedDocuments={selectedDocuments}
                        chatWithDocument={handleChatWithDocument}
                        updateSelectedDocuments={updateSelectedDocuments}                  />
                );
            })
        ) : (
            <div className="flex w-full flex-col items-center text-center">
                <img src="../img/illustration-desert.svg" alt="Desert illustration" />
                <div className={`${homeStyles["error-msg"]}`}>
                    {textValue && data?.documents?.length == 0?
                    t("pages.home.no-results"): t("pages.home.no-files")}
                </div>
            </div>
        )}
    </div>
)}

                            {!isLoading && data && data.totalRecords > 0 && (
                                <div className="space-between mb-5 mt-10 flex items-center justify-center">
                                    <Pagination
                                        totalCount={data.totalPages}
                                        pageSize={rowCount}
                                        currentPage={currentPage}
                                        siblingCount={siblingCount}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>
            </div>
        </div>

        {/* Chat Room Section */}
        <div className={`flex flex-col w-full   bg-white shadow-md ${homeStyles["chat-panel"]}`}>
            <div className="flex flex-col h-full">
            <div className={`flex-grow overflow-y-auto ${homeStyles["no-bottom-padding"]}` } style={{ backgroundColor: '#f7f7f7', overflowX: 'hidden', overflowY: 'auto', display: 'flex', maxBlockSize: 'calc(100vh - 60px)'}}>
                        <ChatRoom
                                    searchResultDocuments={searchResultDocuments}
                                    selectedDocuments={selectedDocuments}
                                    chatWithDocument={chatWithSingleSelectedDocument ? chatWithSingleSelectedDocument : []} clearChatFlag={true}                        />
                    </div>
            </div>
        </div>
    </div>
</main>




        </>
    );
}
