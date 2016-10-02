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
                $elementNum.html(elements[ind].number);
                $elementSym.html(elements[ind].symbol);
                $elementName.html(elements[ind].name);
            }).on('click', function (e) {
                e.preventDefault();

                var $this = $(this),
                    elementTemp = doT.template($('#element-template').html()),
                    obj = {
                        class: $this.attr('class'),
                        num: $this.find('.element--num').text(),
                        sym: $this.find('.element--sym').text(),
                        name: $this.find('.element--name').text(),
                    };

                $elements
                    .addClass('blur fixed')
                    .after('<div class="element--clone"></div>');

                $('.element--clone').append(elementTemp(obj));

                $('.element--clone .element')
                    .addClass('active')
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
                    left: 20,
                    top: 65,
                    height: 345,
                    width: 280,
                    ease: Expo.easeInOut
                });

                TweenMax.to('.element--clone .element button', 0.75, {
                    opacity: 1,
                    ease: Expo.easeInOut
                });
            });

            $('body').on('click', '.js-close-element', function (e) {
                e.preventDefault();

                var $this = $(this),
                    $parent = $this.parent();

                TweenMax.to('.element--clone .element', 0.75, {
                    left: $parent.data('x'),
                    top: $parent.data('y'),
                    height: $parent.data('height'),
                    width: $parent.data('width'),
                    ease: Expo.easeInOut
                });

                TweenMax.to('.element--clone .element button', 0.75, {
                    opacity: 0,
                    ease: Expo.easeInOut,
                    onComplete: function () {
                        $elements.removeClass('blur');

                        $('.element--clone .element')
                            .removeClass('no-animation')
                            .removeClass('fixed');

                        setTimeout(function(){
                            $elements.removeClass('fixed');
                            $('.element--clone').remove();
                        }, 750);
                    }
                });
            });

            $elements.removeClass('hide');
        }
    }
}
