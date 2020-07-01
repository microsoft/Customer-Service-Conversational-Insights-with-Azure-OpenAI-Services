/**
* A tool for drawing polygons on the map using a mouse.
* @param map An Azure Maps map instance to attach the drawing tool too. 
* @param beforeLayer The layer or name of a layer to render the drawing layer before.
* @param drawingEndedCallback A callback function that is fired when a drawing has been completed. If recieves a Shape that contains a Polygon feature in it.
*/
var PolygonDrawingTool = function (map, beforeLayer, drawingEndedCallback) {
    var _self = this;

    var _datasource = new atlas.source.DataSource();
    map.sources.add(_datasource);

    var _activeShape;

    var pl = new atlas.layer.PolygonLayer(_datasource, null, {
        fillColor: 'rgba(255,165,0,0.2)'
    });
    map.layers.add(pl, beforeLayer);

    map.layers.add(new atlas.layer.LineLayer(_datasource, null, {
        strokeColor: 'orange',
        strokeWidth: 2
    }), beforeLayer);

    var _handleRadius = 5;

    var _dragHandleLayer = new atlas.layer.BubbleLayer(_datasource, null, {
        color: 'orange',
        radius: _handleRadius,
        strokeColor: 'white',
        strokeWidth: 2
    })
    map.layers.add(_dragHandleLayer, beforeLayer);

    /*********************** 
    * Private Methods 
    ***********************/

    //When the user presses 'esc', take the polygon out of edit mode and re-add to base map.
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 27 && _activeShape) {
            var ring = _activeShape.getCoordinates()[0];
            ring.pop();

            //Close the ring.
            if (ring.length >= 1) {
                ring.push([ring[0][0], ring[0][1]]); //Add the first coordinate to the end to close the polygon.                    
            }

            _activeShape.setCoordinates([ring]);
            _self.endDrawing();
        }
    }, false);

    function mouseUp(e) {
        if (_activeShape) {
            var ring = _activeShape.getCoordinates()[0];
            ring.pop(); //Remove the preview coordinate.
            ring.push(e.position); //Add the current coordinate.
            ring.push(e.position); //Add a preview coordinate.
            _activeShape.setCoordinates([ring]);
        }
    }

    function dragHandleSelected(e) {
        if (_activeShape) {
            var ring = _activeShape.getCoordinates()[0];
            if (ring.length > 0) {

                //Check to see if user clicked on or close to the first position. 
                var dist = pixelDistance(ring[0], e.position);
                if (dist <= _handleRadius * 1.2) {
                    ring.pop(); //Remove the preview coordinate.
                    ring.pop(); //Remove the last coordinate that was added due to the maps mouseup event.

                    //Close the ring.
                    if (ring.length >= 1) {
                        ring.push([ring[0][0], ring[0][1]]); //Add the first coordinate to the end to close the polygon.                    
                    }

                    _activeShape.setCoordinates([ring]);
                    _self.endDrawing();
                }
            }
        }
    }

    function mouseMove(e) {
        if (_activeShape) {
            //Update the last coordinate in the polygon which is there for preview purposes.
            var ring = _activeShape.getCoordinates()[0];

            if (ring.length > 1) {
                ring[ring.length - 1] = e.position;
                _activeShape.setCoordinates([ring]);
            }
        }
    }

    function pixelDistance(pos1, pos2) {
        //Approximately 
        var dLat = (pos2[1] - pos1[1]) * (Math.PI / 180);
        var dLon = (pos2[0] - pos1[0]) * (Math.PI / 180);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((pos1[1]) * (Math.PI / 180)) * Math.cos((pos2[1]) * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var groundResolution = Math.cos(pos2[1] * Math.PI / 180) * Math.PI / (Math.pow(2, map.getCamera().zoom) * 256);
        return c / groundResolution;
    }

    /*********************** 
    * Public Methods 
    ***********************/

    /**
     * Clears all data in the drawing layer. 
     */
    this.clear = function () {
        _activeShape = null;
        _datasource.clear();
        _self.endDrawing();
    };

    /**
     * Starts a new drawing session. Clears all data in the drawing layer. 
     */
    this.startDrawing = function () {
        _self.clear();

        map.getCanvasContainer().style.cursor = 'pointer';

        _activeShape = new atlas.Shape(new atlas.data.Polygon([[[]]]));
        _datasource.add(_activeShape);

        //Show drag handle layer.
        _dragHandleLayer.setOptions({
            visible: true
        });

        //Add mouse events to map.
        map.events.add('mousemove', mouseMove);
        map.events.add('mouseup', mouseUp);
        map.events.add('mouseup', _dragHandleLayer, dragHandleSelected);
    };

    /**
     * Stops any current drawing in progress.
     */
    this.endDrawing = function () {
        map.getCanvasContainer().style.cursor = '';

        //Hide drag handle layer.
        _dragHandleLayer.setOptions({
            visible: false
        });

        //Unbind mouse events
        map.events.remove('mousemove', mouseMove);
        map.events.remove('mouseup', mouseUp);
        map.events.remove('mouseup', _dragHandleLayer, dragHandleSelected);

        if (drawingEndedCallback) {
            drawingEndedCallback(_activeShape);
        }
    };
};