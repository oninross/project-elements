'use strict';

import 'autocomplete';
import 'ScrollToPlugin';
import { toaster } from '../../_assets/elements/js/_material';

export default class Element {
    constructor() {
        var $body = $('body'),
            $window = $(window),
            $elements = $('.elements'),
            $header = $('.header'),
            isCardOpen = false;

        // make ajax call
        $.ajax({
            url: '/assets/elements/api/elements.json',
            dataType: 'json',
            success: function (data) {
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
            var elements = json.elements,
                elementCellTemp = doT.template($('#element-cell').html()),
                obj = {},
                group, ind, autoCompleteData;

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

                isCardOpen = true;

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
                    x: $this.offset().left - $this.scrollLeft(),
                    y: $this.offset().top - $header.outerHeight() - $body.scrollTop(),
                    height: $this.outerHeight(),
                    width: $this.outerWidth(),
                    force3D: true,
                });

                TweenMax.to('.element--clone .element', 0.75, {
                    x: ($window.outerWidth() - 280) / 2,
                    y: (($window.outerHeight() - 375) / 2) - 23,
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
                e.stopPropagation();

                isCardOpen = false;

                var $this = $(this),
                    $parent = $this.parent();

                $('.element--clone .element--details').removeClass('show');

                TweenMax.to('.element--clone .element', 0.75, {
                    x: $parent.data('x'),
                    y: $parent.data('y'),
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
                            .removeClass('active');

                        setTimeout(function(){
                            $body.removeClass('fixed');
                            $elements.removeClass('fixed');
                            $('.table-wrapper').removeClass('fixed');
                            $('.element--clone').remove();
                        }, 500);
                    }
                });
            }).on('click', '.element--clone', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('.js-close-element').trigger('click');
            });

            $elements.removeClass('hide');

            autoCompleteData = $.map(elements, function(value, key) {
                return {
                    data: {
                        class: value.group.toLowerCase(),
                        num: value.number,
                        sym: value.symbol,
                        name: value.name,
                        weight: value.atomicWeight,
                        config: value.electronConfiguration
                    },
                    value: value.name
                }
            });

            $('#primary-nav input[type="text"]').on('focus', function () {
                $(this).val('');
            }).autocomplete({
                noCache: true,
                lookupLimit: 8,
                lookup: autoCompleteData,
                forceFixPosition: true,
                formatResult: function (suggestion, currentValue) {
                    return '<div class="element ' + suggestion.data.class + '"><div class="element--num">' + suggestion.data.num + '</div><div class="element--sym">' + suggestion.data.sym + '</div><div class="element--name">' + suggestion.data.name + '</div></div><div class="element--details"><div class="element--configuration"><strong>Electron configuration:</strong><br/>' + suggestion.data.config + '</div><div class="element--weight"><strong>Atomic weight:</strong><br/>' + suggestion.data.weight + '</div></div>'
                },
                onSelect: function (suggestion) {
                    var targetElem = $('.element[data-num="' + suggestion.data.num + '"]');

                    if (isCardOpen) {
                        setTimeout(function () {
                            $('.js-mobile-menu').trigger('click');
                            $('.js-close-element').trigger('click');

                            TweenMax.to(window, 1, {
                                scrollTo: {
                                    y: targetElem.offset().top + (targetElem.outerHeight() / 2) - ($window.outerHeight() / 2)
                                },
                                ease: Expo.easeInOut,
                                delay: 1.5
                            });

                            TweenMax.to('.table-wrapper', 1, {
                                scrollTo: {
                                    x: targetElem.offset().left + (targetElem.outerWidth() / 2) - ($window.outerWidth() / 2)
                                },
                                ease: Expo.easeInOut,
                                delay: 1.5,
                                onComplete: function () {
                                    targetElem.trigger('click');
                                }
                            });
                        }, 250);
                    } else {
                        setTimeout(function () {
                            $('.js-mobile-menu').trigger('click');

                            TweenMax.to(window, 1, {
                                scrollTo: {
                                    y: targetElem.offset().top + (targetElem.outerHeight() / 2) - ($window.outerHeight() / 2)
                                },
                                ease: Expo.easeInOut
                            });

                            TweenMax.to('.table-wrapper', 1, {
                                scrollTo: {
                                    x: targetElem.offset().left + (targetElem.outerWidth() / 2) - ($window.outerWidth() / 2)
                                },
                                ease: Expo.easeInOut,
                                onComplete: function () {
                                    targetElem.trigger('click');
                                }
                            });
                        }, 250);
                    }

                }
            });
        }
    }
}
