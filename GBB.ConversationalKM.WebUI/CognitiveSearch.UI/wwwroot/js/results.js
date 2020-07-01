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
                                         <div class="name" onclick="ShowDocument('${id}');" >{name}</div>
                                         <div onclick="ShowDocument('${id}');">{description}</div>
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
        var latlon = result.geoLocation;
        if (latlon !== null) {
            if (latlon.isEmpty === false) {
                coordinates = [latlon.longitude, latlon.latitude];
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

function UpdateResults(data) {
    var resultsHtml = '';

    $("#doc-count").html(` Available Results: ${data.count}`);



    for (var i = 0; i < data.results.length; i++) {

        var result = data.results[i];
        var document = result.document;
        document.idx = i;

        var name;
        var title;
        var content;

        if (result.highlights) {
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
                     
            resultsHtml += `<div class="${classList}" onclick="ShowDocument('${id}', '${q}');">
                                    <div class="search-result">
                                       <div class="results-icon col-md-1">
                                            <div class="ms-CommandButton-icon">
                                                <i class="html-icon ms-Icon ${icon}"></i>
                                            </div>
                                        </div>
                                        <div class="results-body col-md-11">
                                            <h5>${firstMessage.Value}</h5>
                                            <b>${moment(document.StartTime).format("LLL")}</b>
                                            <div style="margin-top:10px;">${tags}</div>
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