// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//Filters
function UpdateFilterReset() {
    // This allows users to remove filters
    var htmlString = '';
    $("#filterReset").html("");

    if (selectedFacets && selectedFacets.length > 0) {

        htmlString += `<div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">Current Filters</h4>
                            </div>
                            <div>
                                <div class="panel-body">`;

        selectedFacets.forEach(function (item, index, array) { // foreach facet with a selected value
            var name = item.key;
            var result = facets.filter(function (f) { return f.key === name; })[0];

            if (item.value && item.value.length > 0) {
                item.value.forEach(function (item2, index2, array) {
                    var idx = result.value.indexOf(result.value.filter(function (v) {
                        return v.value.toString() === item2.toString();
                    }
                    )[0]);

                    htmlString += item2 + ` <a href="javascript:void(0)" onclick="RemoveFilter(\'${name}\', \'${item2}'\)"><span class="ms-Icon ms-Icon--Clear"></span></a><br>`;
                    $('#' + name + '_' + idx).addClass('is-checked');
                });
            }
        });

        htmlString += `</div></div></div>`;
    }
    $("#filterReset").html(htmlString);
}

function RemoveFilter(facet, value) {
    // Remove a facet
    var result = selectedFacets.filter(function (f) { return f.key === facet; })[0];

    if (result) { // if that facet exists
        var idx = selectedFacets.indexOf(result);

        if (result.value.length <= 1) {
            selectedFacets.pop(result);
        }
        else {
            result.value.pop(value);
        }
    }

    Search();
}

// Facets
function UpdateFacets() {
    $("#facet-nav").html("");

    var facetResultsHTML = `<div class="panel-group" id="accordion">`;
    facets.forEach(function (item, index, array) {
        var name = item.key;
        var data = item.value;

        if (data !== null && data.length > 0) {

            var title = name.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })

            facetResultsHTML += `<div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4 class="panel-title" id="${name}-facets">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#${name}">${title}</a>
                                    </h4>
                                </div>`;
            if (index === 0) {
                facetResultsHTML += `<div id="${name}" class="panel-collapse collapse in">
                <div class="panel-body">`;
            }
            else {
                facetResultsHTML += `<div id="${name}" class="panel-collapse collapse">
                <div class="panel-body">`;
            }

            if (data !== null) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].value.toString().length < 100) {
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
    facetResultsHTML += `</div>`;
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