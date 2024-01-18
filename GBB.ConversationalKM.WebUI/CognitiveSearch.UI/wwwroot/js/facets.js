// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//Filters
function UpdateFilterReset() {
    // This allows users to remove filters
    var htmlString = '';
    $("#filterReset").html("");

    if (selectedFacets && selectedFacets.length > 0) {

        //htmlString += `<div class="panel panel-default">
        //                    <div class="panel-heading">
        //                        <h4 class="panel-title">Current Filters</h4>
        //                    </div>
        //                    <div>
        //                        <div class="panel-body panel-scroll">`;
        htmlString += `<div class="card" style="padding:unset">
                            <div class="card-header">
                                <h4 class="panel-title">Current Filters</h4>
                            </div>
                            <div class="card-body">
                                <div class="panel-body panel-scroll">
                                <ul class="list-group last-group-flush">`;
                            
                              //</ul>
                           // </div>
                   // </div>`;

        selectedFacets.forEach(function (item, index, array) { // foreach facet with a selected value
            var name = item.key;
            var result = facets.filter(function (f) { return f.key === name; })[0];

            if (item.value && item.value.length > 0) {
                item.value.forEach(function (item2, index2, array) {
                    var idx = result.value.indexOf(result.value.filter(function (v) {
                        return v.value.toString() === item2.toString();
                    }
                    )[0]);

                    //htmlString += item2 + ` <a href="javascript:void(0)" onclick="RemoveFilter(\'${name}\', \'${item2}'\)"><span class="ms-Icon ms-Icon--Clear"></span></a><br>`;
                    htmlString += `<li class="list-group-item"> ${item2} <a href="javascript:void(0)" onclick="RemoveFilter(\'${name}\', \'${item2}'\)"><span class="ms-Icon ms-Icon--Clear"></span></a><br></li>`;
                    $('#' + name + '_' + idx).addClass('is-checked');
                    
                });
            }
        });

        
        //htmlString += `</div></div></div>`;
        htmlString += `</ul></div></div>`;
    }
    $("#filterReset").html(htmlString);
}

function RemoveFilter(facet, value) {
    var result = selectedFacets.filter(function (f) { return f.key === facet; });
    if (result.length > 0) {
        //Remove the facet value
        result[0].value = result[0].value.filter(v => v !== value);

        //Remove facet if there is no value
        if (result[0].value.length === 0)
            selectedFacets = selectedFacets.filter(v => v.key !== facet);
    }

    Search();
}

// Facets

function UpdateAccordion() {
    $("#facet-nav").html("");

    facets.sort((a, b) => a.key.localeCompare(b.key));

    var facetResultsHTML = `<div class="panel-group" id="accordion">
                                <div class="accordion" id="mainAccordion">`;
    facets.forEach(function (item, index, array) {
        var name = item.key;
        var data = item.value;

        if (data !== null) {

            var title = name.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })

            if (title == "Metadata_storage_file_extension") {
                title = "File Extension"
            }

            if (title == "Metadata_author") {
                title = "File Author";
            }

            title = title.replace("_clean", "");

            facetResultsHTML += `<div class="accordion-item" style="border-radius:0px;">
                                    <h4 class="accordion-header" id="${name}-facets">
                                        <button id="${name}-facets-button" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${name}" aria-controls="${name}" href="#${name}">${title}</button>
                                    </h4>`;
                                    
            if (index === 0) {
                facetResultsHTML += `<div id="${name}" class="accordion-collapse collapse in" aria-labelledby="${name}" data-bs-parent="#mainAccordion">
                <div class="accordion-body panel-scroll">`;
            }
            else {
                facetResultsHTML += `<div id="${name}" class="accordion-collapse collapse" aria-labelledby="${name}" data-bs-parent="#mainAccordion">
                <div class="accordion-body panel-scroll">`;
            }

            if (data !== null) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].value.toString().length < 100 && data[j].value.toString().length > 0) {
                        facetResultsHTML += `<div class="ms-CheckBox">
                                            <input tabindex="-1" type="checkbox" class="ms-CheckBox-input" onclick="ChooseFacet('${name}','${data[j].value}', '${j}');">
                                            <label id="${name}_${j}" role="checkbox" class="ms-CheckBox-field" tabindex="0" aria-checked="false" name="checkboxa">
                                                <span class="ms-Label">${data[j].value} (${data[j].count})</span> 
                                            </label>
                                        </div>`;
                    }
                }
            }

            facetResultsHTML += `</div>
                                </div>
                                </div>`;
        }
    });
    facetResultsHTML += `</div></div>`;
    $("#facet-nav").append(facetResultsHTML);

}

function ChooseFacet(facet, value, position) {
    //var boxStatus = document.getElementById(`${facet}_${position}`);
    //if (boxStatus) {
    //    RemoveFilter(facet, value);
    //}
    if (selectedFacets !== undefined) {

        // facetValues where key == selected facet
        var result = selectedFacets.filter(function (f) { return f.key === facet; })[0];

        if (result) { // if that facet exists
            var idx = selectedFacets.indexOf(result);

            if (!result.value.includes(value)) {
                result.value.push(value);
                selectedFacets[idx] = result;
            }
            else {
                if (result.value.length <= 1) {
                    selectedFacets.pop(result);
                }
                else {
                    result.value.pop(value);
                }
            }


        }
        else {
            selectedFacets.push({
                key: facet,
                value: [value]
            });
        }
    }
    currentPage = 1;
    Search();
}