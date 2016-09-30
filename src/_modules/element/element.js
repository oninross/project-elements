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
                    group, ind;

                if (i == 56) {
                    ind = 118;
                } else if (i == 74) {
                    ind = 119;
                } else if (i >= 57 && i <= 73) {
                    ind = i + 14;
                } else if (i >= 75 && i <= 89) {
                    ind = i + 28;
                } else if (i >= 90 && i <= 104) {
                    ind = i - 34;
                } else if (i >= 105 && i <= 120) {
                    ind = i - 17;
                } else {
                    ind = i;
                }

                group = elements[ind].group;
                group = group.toLowerCase();
                $this.addClass(group);
                $elementNum.text(elements[ind].number);
                $elementSym.text(elements[ind].symbol);
                $elementName.text(elements[ind].name);
            });

            $('.elements').removeClass('hide');
        }
    }
}