'use strict';

import { toaster } from '../../_assets/elements/js/_material';

export default class Element {
    constructor() {
        // make ajax call
        $.ajax({
            url: '/assets/elements/api/elements.json',
            success: function (data) {
                // console.log(data);
                // var parseData = JSON.parse(data);
                var parseData = data;

                populateElements(parseData);
            },
            error: function (error) {
                console.log(error);

                toaster('Whoops! Something went wrong! Error (' + error.status + ' ' + error.statusText + ')');
            },
            statusCode: function (code) {
                console.log(code);
            }
        });

        // populate elements
        function populateElements (json) {
            $('.element').each(function(i) {
                var $this = $(this),
                    $elementNum = $this.find('.element--num'),
                    $elementSym = $this.find('.element--sym'),
                    $elementName = $this.find('.element--name'),
                    elements = json.elements,
                    group = elements[i].group;

                group = group.replace(/ /g, '');
                group = group.toLowerCase();

                $this.addClass(group);
                $elementNum.text(elements[i].number);
                $elementSym.text(elements[i].symbol);
                $elementName.text(elements[i].name);
            });

            $('.elements').removeClass('hide');
        }
    }
}