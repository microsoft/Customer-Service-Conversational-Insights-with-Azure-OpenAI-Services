// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//Initialize Fabric elements
var SpinnerElements = document.querySelectorAll(".ms-Spinner");
for (var i = 0; i < SpinnerElements.length; i++) {
    new fabric['Spinner'](SpinnerElements[i]);
}

var SearchBoxElements = document.querySelectorAll(".ms-SearchBox");
for (var i = 0; i < SearchBoxElements.length; i++) {
    new fabric['SearchBox'](SearchBoxElements[i]);
}

var isGridInitialized = false;
var $grid = $('#doc-details-div');

$(document).ready(function () {
    if (typeof aspViewModel !== 'undefined' && aspViewModel)
        Update(aspViewModel);
});

function InitLayout() {

    if (isGridInitialized === true) {
        $grid.masonry('destroy'); // destroy
    }

    $grid.masonry({
        itemSelector: '.results-div',
        columnWidth: '.results-sizer'
    });

    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    isGridInitialized = true;
}

function FabricInit() {
    var CheckBoxElements = document.querySelectorAll(".ms-CheckBox");
    for (var i = 0; i < CheckBoxElements.length; i++) {
        new fabric['CheckBox'](CheckBoxElements[i]);
    }
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}