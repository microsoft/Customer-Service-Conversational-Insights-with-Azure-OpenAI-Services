// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function Base64Decode(token) {
    if (token.length === 0) return null;
    // The last character in the token is the number of padding characters.
    var numberOfPaddingCharacters = token.slice(-1);
    // The Base64 string is the token without the last character.
    token = token.slice(0, -1);
    // '-'s are '+'s and '_'s are '/'s.
    token = token.replace(/-/g, '+');
    token = token.replace(/_/g, '/');
    // Pad the Base64 string out with '='s
    for (var i = 0; i < numberOfPaddingCharacters; i++)
        token += "=";
    return atob(token);
}

function GetResultsMapsHTML() {
    var mapsContainerHTML = '';
    mapsContainerHTML += '<div id="myMap" style="height:400px" ></div>';

    // Buttons to enable setting and resetting search polygon
    mapsContainerHTML += '<div style="position:absolute;top:50px;left:50px;">';
    mapsContainerHTML += '    <input type="button" value="Set Search Polygon" onclick="drawingTools.startDrawing();" />';
    mapsContainerHTML += '    <input type="button" value="Clear Search Polygon" onclick="drawingTools.clear();" />';
    mapsContainerHTML += '</div>';

    return mapsContainerHTML;
}

//  Authenticates the map and shows some locations.
function AuthenticateResultsMap(results) {
    $.post('/home/getmapcredentials', {},
        function (data) {

            if (data.mapKey === null || data.mapKey === "")
            {
                showMap = false;
                return;
            }

            var mapsContainerHTML = GetResultsMapsHTML();
            $('#maps-viewer').html(mapsContainerHTML);

            // default map coordinates
            var coordinates = [-122.32, 47.60];

            // Authenticate the map using the key 
            resultsMap = new atlas.Map('myMap', {
                center: coordinates,
                zoom: 9,
                visibility: "visible",
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
            resultsMap.events.add('ready', function () {

                /* Construct a zoom control*/
                var zoomControl = new atlas.control.ZoomControl();

                /* Add the zoom control to the map*/
                resultsMap.controls.add(zoomControl, {
                    position: "bottom-right"
                });
            });

            AddMapPoints(results);

            return;
        });
    return;
}

// Adds map points and re-centers the map based on results
function AddMapPoints(results) {
    var coordinates;

    if (mapDataSource !== null) {
        // clear the data source, add new POIs and re-center the map
        mapDataSource.clear();
        coordinates =  UpdatePOIs(results, mapDataSource);
        if (coordinates) {
            resultsMap.setCamera ({ center: coordinates });
        }
    }
    else {
        //Create a data source to add it to the map 
        mapDataSource = new atlas.source.DataSource();
        coordinates = UpdatePOIs(results, mapDataSource);

        //Wait until the map resources are ready for first set up.
        resultsMap.events.add('ready', function () {

            //take the last coordinates.
            if (coordinates) { resultsMap.setCamera ({ center: coordinates }); }

            //Add data source and create a symbol layer.
            resultsMap.sources.add(mapDataSource);
            var symbolLayer = new atlas.layer.SymbolLayer(mapDataSource);
            resultsMap.layers.add(symbolLayer);

            //Create a popup but leave it closed so we can update it and display it later.
            popup = new atlas.Popup({
                pixelOffset: [0, -18],
                closeButton: false
            });

            //Add a hover event to the symbol layer.
            resultsMap.events.add('click', symbolLayer, function (e) {
                //Make sure that the point exists.
                if (e.shapes && e.shapes.length > 0) {
                    var content, coordinate;
                    var properties = e.shapes[0].getProperties();
                    var id = properties.id;
                    var popupTemplate = `<div class="customInfobox">
                                         <div class="name" onclick="ShowDocument('${id}', ${0});" >{name}</div>
                                         <div onclick="ShowDocument('${id}', ${0});">{description}</div>
                                         </div>`;
                    content = popupTemplate.replace(/{name}/g, properties.name).replace(/{description}/g, properties.description);
                    coordinate = e.shapes[0].getCoordinates();

                    popup.setOptions({
                        //Update the content of the popup.
                        content: content,

                        //Update the popup's position with the symbol's coordinate.
                        position: coordinate

                    });

                    if (popup.isOpen() !== true) {
                        //Open the popup.
                        popup.open(resultsMap);
                    }
                    else
                    {
                        popup.close();
                    }
                }
            });

            drawingTools = new PolygonDrawingTool(resultsMap, null, function (polygon) {
                //Do something with the polygon.
                mapPolygon = polygon;
            });
        });

        // This is necessary for the map to resize correctly after the 
        // map is actually in view.
        $('#maps-pivot-link').on("click", function () {
            window.setTimeout(function () {
                map.map.resize();
            }, 100);
        });
    }
}

function UpdatePOIs(results, dataSource) {
    var coordinates;
    for (var i = 0; i < results.length; i++) {
        var result = results[i].document;
        var latlon = result?.geoLocation;
        if (latlon !== null && typeof latlon !== 'undefined') {
            if (latlon.coordinates !== null) {
                coordinates = [latlon.coordinates[0], latlon.coordinates[1]]; // longitude, latitude
                //Add the symbol to the data source.
                dataSource.add(new atlas.data.Feature(new atlas.data.Point(coordinates), {
                    name: result.metadata_storage_name,
                    description: "Learn more...",
                    id: result.metadata_storage_path
                }));
            }
        }
    }

    return coordinates;
}

function UpdateMap(data) {
    if (showMap === true) {
        if (resultsMap === null) {
            // Create the map
            AuthenticateResultsMap(data.results);
        }
        else {
            AddMapPoints(results);
        }
    }
}

function UpdateResults(data, answer) {
    var resultsHtml = '';

    $("#doc-count").html(`<div id="results-title"><h4>Call summaries</h4><div id="disclaimer">AI-generated content may be incorrect</div></div>Showing ${data.results.length} of ${data.count} results`);

    if (data.answer !== undefined && data.answer !== null) {

        $('#query-div').html(` Question: ${data.query}`).show();
        $('#answer-div').html(` Answer: ${data.answer}`).show();
    }
    else {
        $('#query-div').html(``).hide();
        $('#answer-div').html(``).hide();
    }

    for (var i = 0; i < data.results.length; i++) {

        var result = data.results[i];
        var document = result.document;
        document.idx = i;

        var name;
        var title;
        var content;

        var caption = data.captions[i];

        if (answer && caption) {
            if (caption.text == answer.replaceAll("<em>", "").replaceAll("</em>", "")) {
                content = "<em>" + caption.text + "</em>";
            }
            else {
                content = caption.text;
            }
        }
        else if (result.highlights) {
            if (result.highlights?.merged_content) {
                content = result.highlights?.merged_content[0];
            } else if (result.highlights?.content) {
                content = result.highlights?.content[0];
            }
        } else {
            content = "";
        }

        var icon = " ms-Icon--CannedChat";
        var id = document[data.idField];
        var tags = GetTagsHTML(document);
        var path;

        // get path
        if (data.isPathBase64Encoded) {
            path = Base64Decode(document.metadata_storage_path) + token;
        }
        else {
            path = document.metadata_storage_path + token;
        }

        if (document["metadata_storage_name"] !== undefined) {
            name = document.metadata_storage_name.split(".")[0];
        }

        if (document["metadata_title"] !== undefined && document["metadata_title"] !== null) {
            title = document.metadata_title;
        }
        else {
            // Bring up the name to the top
            title = name;
            name = "";
        }


        if (path !== null) {
            var classList = "results-div ";
            if (i === 0) classList += "results-sizer";

            var firstMessage = document.Messages.find(m => m.EventType == "MessageFromUser");


            var pathLower = path.toLowerCase();

            if (pathLower.includes(".pdf")) {
                icon = "ms-Icon--PDF";
            }
            else if (pathLower.includes(".htm")) {
                icon = "ms-Icon--FileHTML";
            }
            else if (pathLower.includes(".xml")) {
                icon = "ms-Icon--FileCode";
            }
            else if (pathLower.includes(".doc")) {
                icon = "ms-Icon--WordDocument";
            }
            else if (pathLower.includes(".ppt")) {
                icon = "ms-Icon--PowerPointDocument";
            }
            else if (pathLower.includes(".xls")) {
                icon = "ms-Icon--ExcelDocument";
            }

            var resultContent = "";
            var imageContent = "";

            if (pathLower.includes(".jpg") || pathLower.includes(".png")) {
                icon = "ms-Icon--FileImage";
                imageContent = `<img class="img-result" style='max-width:100%;' src="${path}"/>`;
            }
            else if (pathLower.includes(".mp3") || pathLower.includes(".m4a")) {
                icon = "ms-Icon--CannedChat";
                resultContent = `<div class="audio-result-div">
                                    <audio controls>
                                        <source src="${path}" type="audio/mp3">
                                        Your browser does not support the audio tag.
                                    </audio>
                                </div>`;
            }
            else if (pathLower.includes(".mp4")) {
                icon = "ms-Icon--Video";
                resultContent = `<div class="video-result-div">
                                    <video controls class="video-result">
                                        <source src="${path}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>`;
            }

            var tagsContent = tags ? `<div class="results-body">
                                        <div id="tagdiv${i}" class="tag-container max-lines" style="margin-top:10px;">${tags}</div>
                                    </div>` : "";
            // display:none
            // <div class="col-md-1"><img id="tagimg${i}" src="/images/expand.png" height="30px" onclick="event.stopPropagation(); ShowHideTags(${i});"></div>

            var contentPreview = content ? `<p class="max-lines">${content}</p>` : "";

            previewAllContent = `
                            <h4>${title}</h4>
                            ${ contentPreview }
                            <h5>${name}</h5>
                            ${ tagsContent }
                            ${ resultContent}`

            if (pathLower.includes(".mp3") || pathLower.includes(".json") || pathLower.includes(".m4a")) {
                previewAllContent = `
                    
                <div class="result-item-with-date">
                    <div class="result-item">
                        <img src="images/0394-ai-lightbulb-l-standard-96x96.png"/>
                        <div class="result-item-text">
                            <h5>Call summary</h5>
                            <div>${document.summary}</div>
                        </div>
                        <div class="result-date">${moment(document.StartTime).format("LL<br>LT")}</div>
                    </div>
                </div>

                <div class="result-item">
                    <img src="images/0238-feedback-l-standard-96x96.png"/>
                    <div class="result-item-text">
                        <h5>Customer satisfaction</h5>
                        <div>${document.satisfied}</div>
                    </div>
                </div>
                <hr style="height:1px;border-width:0;background-color:#EDEBE9">
                <div style="margin-top:10px;margin-bottom:20px;">${tags}</div>
                <a href="#" onclick="ShowDocument('${id}', ${i + 1});">View more details</a>`
            }

            resultsHtml += `<div id="resultdiv${i}" class="${classList}" onclick="ShowDocument('${id}', ${i + 1});">
                                    <div class="search-result">
                                        ${imageContent}

                                        <div class="results-body">
                                            ${previewAllContent}
                                        </div>
                                    </div>
                                </div>`;
        }
        else {
            resultsHtml += `<div class="${classList}" );">
                                    <div class="search-result">
                                        <div class="results-header">
                                            <h4>Could not get metadata_storage_path for this result.</h4>
                                        </div>
                                    </div>
                                </div>`;
        }
    }

    $("#doc-details-div").html(resultsHtml);
}

function ShowHideTags(i) {
    var node = document.getElementById("tagdiv" + i);
    var image = document.getElementById("tagimg" + i);
    if (node.style.display === "none") {
        node.style.display = "block";
        image.src = "/images/collapse.png";
    }
    else {
        node.style.display = "none";
        image.src = "/images/expand.png";
    }

    $grid.masonry('layout');
}
