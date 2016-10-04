'use strict';

import { toaster } from '../../_assets/elements/js/_material';

export default class Element {
    constructor() {
        var $body = $('body'),
            $window = $(window),
            $elements = $('.elements'),
            $header = $('.header');

        // make ajax call
        $.ajax({
            url: '/assets/elements/api/elements.json',
            success: function (data) {
                console.log(data);
                var parseData = JSON.parse(data);
                // var parseData = data;

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
            var elements = json.elements,
                elementCellTemp = doT.template($('#element-cell').html()),
                obj = {},
                group, ind;

            $('.elem-placeholder').each(function(i) {
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

                obj = {
                    ind: i,
                    class: group,
                    num: elements[ind].number,
                    sym: elements[ind].symbol,
                    name: elements[ind].name,
                    discovery: elements[ind].discovery,
                    configuration: elements[ind].electronConfiguration,
                    weight: elements[ind].atomicWeight,
                    density: elements[ind].density,
                    boiling: elements[ind].boilingPoint,
                    melting: elements[ind].meltingPoint,
                    ionization: elements[ind].ionizationEnergy
                }

                $(this).append(elementCellTemp(obj));
            }).on('click', '.js-open-element', function (e) {
                e.preventDefault();

                var $this = $(this),
                    elementTemp = doT.template($('#element-template').html()),
                    obj = {
                        class: $this.attr('class'),
                        num: $this.find('.element--num').text(),
                        sym: $this.find('.element--sym').text(),
                        name: $this.find('.element--name').text(),
                        discovery: $this.find('.element--discovery').text(),
                        configuration: $this.find('.element--configuration').html(),
                        weight: $this.find('.element--weight').text(),
                        density: $this.find('.element--density').text(),
                        boiling: $this.find('.element--boiling').text(),
                        melting: $this.find('.element--melting').text(),
                        ionization: $this.find('.element--ionization').text()
                    };

                $body.addClass('fixed');
                $('.table-wrapper').addClass('fixed');

                $elements
                    .addClass('blur fixed')
                    .after('<div class="element--clone"></div>');

                $('.element--clone').append(elementTemp(obj));

                $('.element--clone .element')
                    .data('height', $this.outerHeight())
                    .data('width', $this.outerWidth())
                    .data('x', $this.offset().left - $this.scrollLeft())
                    .data('y', $this.offset().top - $header.outerHeight() - $body.scrollTop());

                TweenMax.set('.element--clone .element', {
                    left: $this.offset().left - $this.scrollLeft(),
                    top: $this.offset().top - $header.outerHeight() - $body.scrollTop(),
                    height: $this.outerHeight(),
                    width: $this.outerWidth()
                });

                TweenMax.to('.element--clone .element', 0.75, {
                    left: ($window.outerWidth() - 280) / 2,
                    top: (($window.outerHeight() - 375) / 2) - 23,
                    height: 400,
                    width: 280,
                    ease: Expo.easeInOut,
                    onStart: function () {
                        $('.element--clone .element').addClass('active scale');
                    }
                });

                TweenMax.to('.element--clone .element button', 0.75, {
                    opacity: 1,
                    ease: Expo.easeInOut,
                    onComplete: function () {
                        $('.element--clone .element--details').addClass('show');
                    }
                });
            });

            $('body').on('click', '.js-close-element', function (e) {
                e.preventDefault();

                var $this = $(this),
                    $parent = $this.parent();

                $('.element--clone .element--details').removeClass('show');

                TweenMax.to('.element--clone .element', 0.75, {
                    left: $parent.data('x'),
                    top: $parent.data('y'),
                    height: $parent.data('height'),
                    width: $parent.data('width'),
                    ease: Expo.easeInOut,
                    delay: 0.25,
                    onStart: function () {
                        $('.element--clone .element').removeClass('scale');
                    }
                });

                TweenMax.to('.element--clone .element button', 0.75, {
                    opacity: 0,
                    ease: Expo.easeInOut,
                    delay: 0.25,
                    onComplete: function () {
                        $elements.removeClass('blur');

                        $('.element--clone .element')
                            .removeClass('no-animation')
                            .removeClass('active');                            ;

                        setTimeout(function(){
                            $body.removeClass('fixed');
                            $elements.removeClass('fixed');
                            $('.table-wrapper').removeClass('fixed');
                            $('.element--clone').remove();
                        }, 500);
                    }
                });
            });

            $elements.removeClass('hide');
        }
    }
}
