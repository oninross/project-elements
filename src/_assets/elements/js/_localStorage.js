'use strict';

let setDefault = function () {
    if ( !localStorage.length ) {
        localStorage.nightMode = false;
    }
};

let setNightMode = function (bool) {
    localStorage.nightMode = bool;
};

let getNightMode = function () {
    var parsed = JSON.parse(localStorage.nightMode);

    return parsed;
};

$(() => {
    setDefault();
});

export { setNightMode, getNightMode };