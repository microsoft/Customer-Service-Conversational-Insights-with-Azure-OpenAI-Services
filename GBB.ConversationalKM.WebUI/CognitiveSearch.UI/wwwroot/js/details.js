// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Details
function ShowDocument(id, index) {
    $.post('/home/getdocumentbyid',
        {
            id: id
        },
        function (data) {
            result = data.result;

            var pivotLinksHTML = "";

            $('#details-pivot-content').html("");
            $('#reference-viewer').html("");
            $('#tag-viewer').html("");
            $('#details-viewer').html("").css("display", "none");

            $('#result-id').val(id);

            var fileContainerHTML = GetFileHTML(data, result);

            // Transcript Tab Content
            var transcriptContainerHTML = GetTranscriptHTML(result);
            if (data.decodedPath.toLowerCase().includes(".htm")) {
                fileContainerHTML = GetTranscriptHTML(result);
            }


            // Metadata Tab Content 
            var metadataContainerHTML = GetMetadataHTML(result);

            var fileName = "File";

            var pivotsHTML = '          <div id="file-pivot" class="ms-Pivot-content" data-content="file"> ';
            pivotsHTML += '                 <div id="file-viewer" style="height: 95%;"></div> ';
            pivotsHTML += '             </div> ';

            if (transcriptContainerHTML !== null) {
                pivotsHTML += '             <div id="transcript-pivot" class="ms-Pivot-content" data-content="transcript"> ';
                pivotsHTML += '                 <div id="transcript-viewer" style="height: 100%;"> ';
                pivotsHTML += '                 </div> ';
                pivotsHTML += '             </div>  ';
            }

            pivotsHTML += '             <div id="metadata-pivot" class="ms-Pivot-content" data-content="metadata"> ';
            pivotsHTML += '                 <div id="metadata-viewer" style="height: 95%;overflow-y:scroll;"> ';
            pivotsHTML += '                 </div> ';
            pivotsHTML += '             </div>';

            if (result.geoLocation !== null) {
                pivotsHTML += '             <div id="maps-pivot" class="ms-Pivot-content" data-content="maps"> ';
                pivotsHTML += '                 <div id="maps-viewer"> ';
                pivotsHTML += '                 </div> ';
                pivotsHTML += '             </div>';
            }

            $('#details-pivot-content').html(pivotsHTML);

            // Populate the tabs
            $('#file-viewer').html(fileContainerHTML);

            if (transcriptContainerHTML !== null) {
                $('#transcript-viewer').html(transcriptContainerHTML);
            }

            $('#metadata-viewer').html(metadataContainerHTML);

            if (result.geoLocation !== null)
            {
                // Maps Tab Content
                var mapsContainerHTML = GetMapsHTML(result);
                $('#maps-viewer').html(mapsContainerHTML);
            }


            pivotLinksHTML += '<li id="file-pivot-link" class="ms-Pivot-link is-selected" data-content="file" title="File" tabindex="1">' + fileName + '</li>';

            if (transcriptContainerHTML !== null) {
                pivotLinksHTML += '<li id="transcript-pivot-link" class="ms-Pivot-link " data-content="transcript" title="Transcript" tabindex="1">Transcript</li>';
            }

            pivotLinksHTML += '<li id="metadata-pivot-link" class="ms-Pivot-link" data-content="metadata" title="Metadata" tabindex="1">Metadata</li>';

            if (result.geoLocation !== undefined && result.geoLocation !== null) {
                pivotLinksHTML += '<li id="maps-pivot-link" class="ms-Pivot-link" data-content="maps" title="Maps" tabindex="1">Maps</li>';
            }

            var tagContainerHTML = GetTagsHTML(result);

            $('#details-pivot-links').html(pivotLinksHTML);
            $('#tag-viewer').html(tagContainerHTML);
            $('#details-modal').modal('show');

            var PivotElements = document.querySelectorAll(".ms-Pivot");
            for (var i = 0; i < PivotElements.length; i++) {
                new fabric['Pivot'](PivotElements[i]);
            }

            // this needs to happen after maps-pivot-link is part of the DOM
            if (result.geoLocation !== null) {
                AuthenticateMap(result);
            }

            //Log Click Events
            LogClickAnalytics(result.metadata_storage_name, index);
            GetSearchReferences(q);
        });
}

//  Authenticates the map and shows some locations.
function AuthenticateMap(result) {
    $.post('/home/getmapcredentials', { },
        function (data) {

            var latlon = result.geoLocation;

            if (latlon) {

                if (latlon.coordinates !== null) {

                    var coordinates = [latlon.coordinates[0], latlon.coordinates[1]]; // longitude, latitude

                    // Authenticate the map using the key 
                    var map = new atlas.Map('myMap', {
                        center: coordinates,
                        zoom: 6,
                        width: "500px",
                        height: "500px",
                        style: "grayscale_dark",
                        language: 'en-US',
                        authOptions: {
                            authType: 'subscriptionKey',
                            subscriptionKey: data.mapKey
                        }
                    });

                    //Wait until the map resources are ready.
                    map.events.add('ready', function () {

                        //Create a data source and add it to the map 
                        var dataSource = new atlas.source.DataSource();
                        map.sources.add(dataSource);

                        //Add the symbol to the data source.
                        var point = new atlas.Shape(new atlas.data.Point(coordinates));
                        dataSource.add([point]);
                        map.layers.add(new atlas.layer.SymbolLayer(dataSource, null));
                    });


                    // This is necessary for the map to resize correctly after the 
                    // map is actually in view.
                    $('#maps-pivot-link').on("click", function () {
                        window.setTimeout(function () {
                            map.map.resize();
                        }, 100);
                    });

                    return;
                }
            }
        });
    return;
}

function GetMatches(string, regex, index) {
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

function GetFileHTML(data, result) {
    var filename = result.metadata_storage_name; // blob filename
    var path = data.decodedPath + data.token; // direct path to blob with auth token

    if (path != null) {
        var pathLower = path.toLowerCase();

        if (pathLower.includes(".json")) {
            var txtHtml = JSON.stringify(result.Messages, null, 2);
            fileContainerHTML = `<ul class="timeline"> ${getTimelineHtml(data)} </ul>`;
        }
        else if (pathLower.includes(".pdf")) {
            fileContainerHTML =
                `<object class="file-container" data="${path}" type="application/pdf">
                    <iframe class="file-container" src="${path}" type="application/pdf">
                        This browser does not support PDFs. Please download the XML to view it: <a href="${path}">Download PDF</a>"
                    </iframe>
                </object>`;
        }
        else if (pathLower.includes(".txt")) {
            var txtHtml = htmlDecode(result.content.trim());
            fileContainerHTML = `<pre id="file-viewer-pre"> ${txtHtml} </pre>`;
        }
        else if (pathLower.includes(".las")) {
            fileContainerHTML =
                `<iframe id="d1" width="100%" height="100%" src="${path}"><p>Your browser does not support iframes.</p></iframe>`;
        }
        else if (pathLower.includes(".jpg") || pathLower.includes(".jpeg") || pathLower.includes(".gif") || pathLower.includes(".png")) {
            fileContainerHTML =
                `<div class="file-container">
                    <img style='max-width:100%;' src="${path}"/>
                </div>`;
        }
        else if (pathLower.includes(".xml")) {
            fileContainerHTML =
                `<iframe class="file-container" src="${path}" type="text/xml">
                    This browser does not support XMLs. Please download the XML to view it: <a href="${path}">Download XML</a>"
                </iframe>`;
        }
        else if (pathLower.includes(".htm")) {
            var srcPrefixArr = result.metadata_storage_path.split('/');
            srcPrefixArr.splice(-1, 1);
            var srcPrefix = srcPrefixArr.join('/');

            var htmlContent = result.content.replace(/src=\"/gi, `src="${srcPrefix}/`);

            fileContainerHTML =
                `${htmlContent}`;
        }
        else if (pathLower.includes(".mp3")) {
            fileContainerHTML =
                `<audio controls>
                  <source src="${path}" type="audio/mp3">
                  Your browser does not support the audio tag.
                </audio>`;
        }
        else if (pathLower.includes(".mp4")) {
            fileContainerHTML =
                `<video controls class="video-result">
                        <source src="${path}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
        }
        else if (pathLower.includes(".doc") || pathLower.includes(".ppt") || pathLower.includes(".xls")) {
            var src = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(path);

            fileContainerHTML =
                `<iframe class="file-container" src="${src}"></iframe>`;
        }
        else {
            fileContainerHTML =
                `<div>This file cannot be previewed. Download it here to view: <a href="${path}">Download</a></div>`;
        }
    }
    else {
        fileContainerHTML =
            `<div>This file cannot be previewed or downloaded.`;
    }

    return fileContainerHTML;
}

function GetMapsHTML(result) {
    var mapsContainerHTML = '';

    mapsContainerHTML += '<div id="myMap" ></div>';

    return mapsContainerHTML;
}


// this function will get a table with the text content of the file, 
function GetTranscriptHTML(result) {

    var transcriptContainerHTML = '';

    var full_content = "";

    // If we have merged content, let's use it.
    if (result.merged_content) {
        if (result.merged_content.length > 0) {
            full_content = htmlDecode(result.merged_content.trim());
        }
    }
    else
    {
        // otherwise, let's try getting the content -- although it won't have any image data.
        full_content = result.content.trim();
    }

    if (full_content === null || full_content === "")
    {
        // not much to display
        return null;
    }

    if (!!result.translated_text && result.translated_text !== null && result.language !== "en" ) {
        transcriptContainerHTML = '<div style="overflow-x:auto;"><table class="table table-hover table-striped table-bordered"><thead><tr><th>Original Content</th><th>Translated (En)</th></tr></thead>';
        transcriptContainerHTML += '<tbody>';
        transcriptContainerHTML += '<tr><td class="wrapword" style="width:50%"><pre id="transcript-viewer-pre">' + full_content + '</pre></td><td class="wrapword"><pre>' + htmlDecode(result.translated_text.trim()) + '</pre></td></tr>';
        transcriptContainerHTML += '</tbody>';
        transcriptContainerHTML += '</table></div>';
    }
    else {
        transcriptContainerHTML = '<div style="overflow-x:auto;"><table class="table table-hover table-striped table-bordered"><thead><tr><th>Original Content</th></tr></thead>';
        transcriptContainerHTML += '<tbody>';
        transcriptContainerHTML += '<tr><td class="wrapword"><pre id="transcript-viewer-pre">' + full_content + '</pre></td></tr>';
        transcriptContainerHTML += '</tbody>';
        transcriptContainerHTML += '</table></div>';
    }

    return transcriptContainerHTML;
}

function SpaceArray(stringArray) {
    var result = "";

    for (var idx in stringArray) {
        result += stringArray[idx] + "  <br/> ";
    }

    return result;
}

// Returns a table with metadata produced as part of the enrichment pipeline.

function GetMetadataHTML(result) {
    var metadataContainerHTML = $("#metadata-viewer").html();

    metadataContainerHTML = '<div id="actions-header">    </div > ';
    //< button type="button" class="btn btn-outline-secondary" > Export to CSV</button >        <button type="button" class="btn btn-outline-secondary">Export to JSON</button>

    metadataContainerHTML += '<h4>Indexed Metadata</h4><div style="overflow-x:auto;"><table class="table metadata-table table-hover table-striped table-bordered"><thead><tr><th data-field="key" class="key">Key</th><th data-field="value">Value</th></tr></thead>';
    metadataContainerHTML += '<tbody>';

    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            if (key !== "content" &&  key !== "enriched" && key !== "id" && key !== "layoutText" && key !== "ImageTags" && key !== "ImageCaption" && key !== "text" && key !== "merged_content" && key !== "translated_text" && key !== "keyphrases" && key !== "Messages") {
                if (result[key] !== null) {

                    value = result[key];

                    if (key === "metadata_storage_path") {
                        value = Base64Decode(value);
                    }

                    if (key === "people" || key === "organizations" || key === "locations") {
                        value = SpaceArray(value);
                    }

                    if (key === "geoLocation")
                    {
                        value = "LAT:" + value.latitude + "<br/>" + "LON:" + value.longitude;
                    }

                    if (value != "" && value != null)
                    {
                        metadataContainerHTML += '<tr><td class="key"  style="width:50%" >' + key + '</td><td class="wrapword"  style="width:50%" >' + value + '</td></tr>';
                    }
                }
            }
        }
    }

    metadataContainerHTML += '</tbody>';
    metadataContainerHTML += '</table></div><br/>';

    return metadataContainerHTML;
}

function GetSearchReferences(q) {
    var copy = q;

    copy = copy.replace(/~\d+/gi, "");
    matches = GetMatches(copy, /\w+/gi, 0);

    matches.forEach(function (match) {
        GetReferences(match, true);
    });
}

function SearchTranscript(searchText) {
    $('#reference-viewer').html("");

    if (searchText !== "") {
        // get whole phrase
        GetReferences(searchText, false);
    }
}
