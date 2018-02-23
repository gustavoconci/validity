/**
 * validity - jQuery validation plugin (https://github.com/gustavoconci/validity.js)
 * Copyright (c) 2017-2018, Gustavo Henrique Conci. (MIT Licensed)
 */

(function($) {
    $.fn.validity = function(settings) {
        var defaultSettings = {
                ignore: ':hidden'
            },
            settings = Object.assign({}, defaultSettings, settings),
            selector = ':input:not(' + settings.ignore + ')';

        var $forms = $(this),
            inputValidity = function($form, $inputs) {
                return function(e) {
                    var $this = $(this);
                    if (e.type === 'keyup' && (
                        !$this.val() ||
                        ($this.is(':radio') || $this.is(':checkbox') && !$this.is(':checked'))
                    )) return;
                    if (!$this.attr('name')) return;
                    if ($this.is(':radio')) {
                        $this = $inputs.filter('[name="' + $this.attr('name') + '"]');
                        if (!$this.prop('required')) {
                            return;
                        }
                    }
                    if (!$this.attr('required')) return;

                    var el = $this[0],
                        validity = el.validity;

                    console.log('----------');
                    console.log($this.attr('name'));
                    console.log(el.checkValidity());
                    console.log('----------');

                    if (el.checkValidity()) {
                        if ($this.is(':file, :radio, :checkbox')) {
                            $this.parent().addClass('valid').removeClass('error mismatch');
                        } else {
                            $this.addClass('valid').removeClass('error mismatch');
                        }
                        $this.next('label.error').remove();
                    } else {
                        if ($this.is(':file, :radio, :checkbox')) {
                            $this.parent().addClass('error').removeClass('valid');
                        } else {
                            $this.addClass('error').removeClass('valid');
                        }
                        $form.data('valid', false);
                        if (validity.valueMissing && $this.attr('data-missing')) {
                            $this.next('label.error').remove();
                            el.setCustomValidity($this.attr('data-missing'));
                            $this.after('<label for="' + $this.attr('id') + '" class="error">' + el.validationMessage + '</label>');
                        } else {
                            el.setCustomValidity('');
                        }
                        if (e.type == 'focusout') {
                            if (validity.patternMismatch || validity.typeMismatch) {
                                $this.addClass('mismatch');
                                if ($this.attr('data-mismatch')) {
                                    $this.next('label.error').remove();
                                    el.setCustomValidity($this.attr('data-mismatch'));
                                    $this.after('<label for="' + $this.attr('id') + '" class="error">' + el.validationMessage + '</label>');
                                }
                            } else {
                                el.setCustomValidity('');
                            }
                        }
                    }
                };
            };

        $forms.each(function() {
            var $this = $(this),
                $inputs = $this.find(selector);
            $this.data('valid', true);

            $this
                .attr('novalidate', true)
                .off('keyup.validity change.validity focusout.validity')
                .on('keyup.validity change.validity focusout.validity', selector, inputValidity($this, $inputs))
                .off('valid.validity')
                .on('valid.validity', function(e, $inputs) {
                    $this.data('valid', true);
                    $inputs.each(inputValidity($this, $inputs));
                });
        });

        $.fn.valid = function() {
            var $this = $(this);
            $this.trigger('valid', [$this.find(selector)]);
            return $this.data('valid');
        };

        $.fn.reset = function() {
            var $this = $(this);
            $this.find(':input').removeClass('valid error mismatch')
                .filter(':file').parent().removeClass('valid error mismatch');
            $this[0].reset();
            return $this;
        };

        return $forms;
    };
})(jQuery);
