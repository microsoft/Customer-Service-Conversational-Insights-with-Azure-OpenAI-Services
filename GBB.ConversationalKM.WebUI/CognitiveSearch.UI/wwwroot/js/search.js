// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Initialize global properties
var q, sortType, tempdata, instrumentationKey;
var results = [];
var facets = [];
var selectedFacets = [];
var token = "";
var currentPage = 1;
var searchId;
var scoringProfile = "";
var resultsMap = null;
var mapDataSource = null;
var showMap = true;

var startDate = null;
var endDate = null;

// variables related to polygon selection on map
var drawingTools;
var mapPolygon = null;

// When 'Enter' clicked from Search Box, execute Search()
$("#q").keyup(function (e) {
    if (e.keyCode === 13) {
        Search();
    }
});

$('#startdate').change(function () {
    Search();
});

$('#enddate').change(function () {
    Search();
});

$("#transcript-search-input").keyup(function (e) {
    if (e.keyCode === 13) {
        SearchTranscript($('#transcript-search-input').val());
    }
});

// Search with query and facets
function Search() {
    $('#loading-indicator').show();

    if (currentPage > 1) {
        if (q != $("#q").val()) {
            currentPage = 1;
        }
    }
    q = $("#q").val();
    $("#e").val(q);

    startDate = $("#startdate").val();
    endDate = $("#enddate").val();

    UpdateResultsView();
}

function UpdateResultsView() {
    // Get center of map to use to score the search results

    //Pass the polygon filter to the query: mapPolygon.data.geometry.coordinates[0][1]
    var polygonString = "";

    if (mapPolygon !== null && mapPolygon.data !== null && mapPolygon.data.geometry !== null && mapPolygon.data.geometry.coordinates !== null) {
        var pointArray = mapPolygon.data.geometry.coordinates[0];

        for (var i = 0; i < pointArray.length; i++) {
            if (polygonString.length > 0) { polygonString += ","; }

            polygonString += pointArray[i][0] + " " + pointArray[i][1];
        }
    }

    var queryType = "";

    if ($('#semantic-toogle').is(":checked")) {
        // it is checked
        queryType = "Semantic";
    }
    else {
        queryType = "Full";
    }

    $.post('/home/searchview',
        {
            q: q !== undefined ? q : "*",
            searchFacets: selectedFacets,
            currentPage: currentPage,
            polygonString: polygonString,
            startDate: startDate,
            endDate: endDate,
            queryType: queryType
        },
        function (viewModel) {
            $('#loading-indicator').css("display", "none");
            Update(viewModel);
        });
}

function Update(viewModel) {

    // Update UI controls to match view model incase we came from a direct link
    selectedFacets = viewModel.selectedFacets;
    q = viewModel.query;
    $("#q").val(q);
    currentPage = viewModel.currentPage;

    var data = viewModel.documentResult;
    results = data.results;
    data.query = viewModel.query;
    facets = data.facets;
    tags = data.tags;
    token = data.token;

    searchId = data.searchId;

    var answer = data.answer;

    data.captions = viewModel.captions;

    //Facets
    //UpdateFacets();

    //Accordions
    UpdateAccordion();

    //Results List
    UpdateResults(data, answer);

    //Map
    UpdateMap(data);

    //Pagination
    UpdatePagination(data.count);

    // Log Search Events
    LogSearchAnalytics(data.count);

    //Filters
    UpdateFilterReset();

    InitLayout();

    UpdateLocationBar();

    $('html, body').animate({ scrollTop: 0 }, 'fast');

    FabricInit();
}

function UpdateLocationBar() {
    // Try to update the location to match the search.
    if (history.pushState) {
        // Get the existing url
        var searchParams = new URLSearchParams(window.location.search);

        var facetStrings = [];
        var includeFacetsInUrl = true;
        if (includeFacetsInUrl) {
            // Concatenate facet keys.
            for (var s of selectedFacets)
                for (var f of s.value)
                    facetStrings.push(s.key + "_" + f);
        }

        // Update or clear facets
        if (facetStrings.length)
            searchParams.set("facets", facetStrings.join(","));
        else
            searchParams.delete("facets");

        // Add other parameters
        searchParams.set("q", q);

        if (currentPage > 1)
            searchParams.set("page", currentPage);
        else
            searchParams.delete("page");

        //  Using history instead of location so it doesnt cause a redirect.
        var paramsStr = "?" + searchParams.toString();
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsStr;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

function UpdatePagination(docCount) {
    var totalPages = Math.round(docCount / 10);
    // Set a max of 5 items and set the current page in middle of pages
    var startPage = currentPage;

    var maxPage = startPage + 5;
    if (totalPages < maxPage)
        maxPage = totalPages + 1;
    var backPage = parseInt(currentPage) - 1;
    if (backPage < 1)
        backPage = 1;
    var forwardPage = parseInt(currentPage) + 1;

    var htmlString = "";
    if (currentPage > 1) {
        htmlString = `<li class="page-item"><a href="javascript:void(0)" onclick="GoToPage('${backPage}')" class=" page-link ms-Icon ms-Icon--ChevronLeftMed"></a></li>`;
    }

    htmlString += '<li class="active page-item"><a class="page-link" href="#">' + currentPage + '</a></li>';

    if (currentPage <= totalPages) {
        htmlString += `<li class="page-item"><a href="javascript:void(0)" onclick="GoToPage('${forwardPage}')" class="page-link ms-Icon ms-Icon--ChevronRightMed"></a></li>`;
    }
    $("#pagination").html(htmlString);
    $("#paginationFooter").html(htmlString);
}

function GoToPage(page) {
    currentPage = page;
    Search();
}

function SampleSearch(text) {
    $('#index-search-input').val(text);
    $('#index-search-submit').click();
}
