/*
TODO
- opção "ao menos um" para selecionar ao menos um dos checkbox;
- opção de setar classes "error" e "valid" em um parent;
- validity: tooShort, tooLong, rangeOverflow, rangeUnderflow;
*/

(function() {
    var defaultSettings = {
            selector: ':input',
            ignore: ':hidden',
            showMessages: true,
            messages: {}
        },

        labelError = function(e, input, check, settings) {
            var validity = input.validity,
                label = input.parentNode.querySelector('.error-block');

            if (label) {
                label.remove();
            }

            if (input.type === 'radio') {
                var inputs = document.querySelectorAll('[name="' + input.name + '"]'),
                    label = inputs[0].parentNode.querySelector('.error-block');

                if (label) {
                    label.remove();
                }
            }

            if (check) {
                return;
            }

            label = document.createElement('label');
            label.classList.add('error-block');

            if (input.type === 'radio') {
                var inputs = document.querySelectorAll('[name="' + input.name + '"]');
                input = inputs[0];
            }

            if (input.id) {
                label.setAttribute('for', input.id);
            }

            var textMissing = input.getAttribute('data-missing') || settings.messages.missing;
            if (validity.valueMissing && textMissing) {
                input.setCustomValidity(textMissing);
            }

            var textMismatch = input.getAttribute('data-mismatch') || settings.messages.mismatch;
            if ((
                validity.patternMismatch ||
                validity.typeMismatch ||
                validity.badInput ||
                validity.stepMismatch
            ) && textMismatch) {
                input.setCustomValidity(textMismatch);
            }

            if (input.validationMessage.length) {
                var labelText = document.createTextNode(input.validationMessage);
                label.appendChild(labelText);
                input.parentNode.insertBefore(label, input.nextSibling);
            }
        },

        inputCheck = function(e, input, settings) {
            input.setCustomValidity('');

            var check = input.checkValidity();

            if (!check) {
                input.classList.add('error');
                input.classList.remove('valid');
            } else {
                input.classList.add('valid');
                input.classList.remove('error');
            }

            if (settings.showMessages) {
                labelError(e, input, check, settings);
            }

            return check;
        };

    /*
    var Validity = function(selector, settings) {
        var query = document.querySelectorAll(selector),
            settings = Object.assign({}, defaultSettings, settings);

        if (settings.selector == defaultSettings.selector) {
            settings.selector = 'input, select, textarea, button';
        }

        var selector = settings.selector;

        if (settings.ignore) {
             selector += ':not(' + settings.ignore + ')';
        }

        query.forEach(function(group) {
            var elements = group.querySelectorAll(selector);

            var i = -1, length = elements.length,
                inputs = [];

            while (++i < length) {
                var input = elements[i];

                if (settings.ignore == defaultSettings.ignore && !(input.offsetWidth > 0 && input.offsetHeight > 0)) {
                    continue;
                }

                if (input.getAttribute('name') != null) {
                    inputs.push(input);
                }
            }

            group.setAttribute('novalidate', true);

            var formEvent = function(e) {
                var formValid = true;

                inputs.forEach(function(input) {
                    var isValid = inputCheck(e, input, settings);
                    if (formValid) {
                        formValid = isValid;
                    }
                });

                if (! formValid) {
                    if (typeof settings.onSubmit !== 'undefined') {
                        settings.onSubmit(e);
                    }
                }
            };

            var inputEvent = function(e) {
                var target = e.target;

                if (inputs.indexOf(target) >= 0) {
                    inputCheck(e, target, settings);
                }

                e.stopPropagation();
            };

            if (typeof group.namespaces !== 'undefined') {
                group.removeEventListener('submit', group.namespaces['form.validity']);
                group.removeEventListener('input', group.namespaces['input.validity']);

                delete group.namespaces['input.validity'];
            }

            group.namespaces = {};
            group.namespaces['form.validity'] = formEvent;
            group.namespaces['input.validity'] = inputEvent;

            group.addEventListener('submit', formEvent, false);
            group.addEventListener('input', inputEvent, false);
        });
    };
    window.Validity = Validity;
    */

    $.fn.validity = function(settings) {
       console.log(settings);
        var $forms = $(this),
            settings = Object.assign({}, defaultSettings, settings),
            selector = settings.selector + ':not(' + settings.ignore + '):not(:button)',

            checkValid = function(e, $form, el, settings) {
                var check = inputCheck(e, el, settings);
                if (!check) {
                    $form.data('valid', check);
                }

                return check;
            };

        $forms
            .data('settings', settings)
            .data('selector', selector)
            .each(function() {
                var $form = $(this);
                $form
                    .data('valid', true)
                    .attr('novalidate', true)
                    .find($form.data('selector'))
                        .off('input.validity')
                        .on('input.validity', function(e) {
                            checkValid(e, $form, this, $form.data('settings'));
                        });
            });

        $.fn.valid = function() {
            var $form = $(this);

            $form
                .data('valid', true)
                .find($form.data('selector'))
                    .each(function() {
                        checkValid({ type: 'submit' }, $form, this, $form.data('settings'));
                    });

            return $form.data('valid');
        };

        $.fn.reset = function() {
            var $form = $(this);

            $form.find(':input').removeClass('valid error');
            $form[0].reset();

            return $form;
        };

        return $forms;
    };
})();
