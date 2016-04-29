// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function(root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
  'use strict';

  $.fn.contactMe = function(opts) {
    var options = $.extend(true, {
      id: 1,
      fields: {
        name: true,
        email: true
      },
      onSubmit: onSubmit
    }, opts);

    return this.each(function() {
      options.endpoint = options.endpoint || this.dataset.endpoint;
      options.modal = false;

      if (!options.endpoint) {
        throw new ReferenceError(
          'You have to define an endpoint for the form.'
        );
      }

      var $element = $(this);
      var $form;
      var $modal;

      if ($element.is('a')) {
        options.modal = true;

        $modal = createModalForm(options);
        $form = $modal.find('.cm-form');

        $(document.body).append($modal);
        $element.on('click', openModal);
      } else {
        $modal = null;
        $form = createForm(options);
        $element.html($form);
      }

      options.id++;

      $element.data('modal', $modal);
      $element.data('form', $form);
    });
  };

  $.fn.flashMessage = function(status, msg) {
    var type = 'cm-form__message--' + status;
    var $message = $(this).find('.cm-form__message');

    $message.text(msg).addClass(type);
    setTimeout(function() {
      $message.removeClass(type);
    }, 5000);

    return this;
  };

  /**
   * click event handler used by the element <a> in which contactMe() function was
   * called. This function gets the $form modal wrapper and makes it visible with
   * the css state class 'is-open'.
   * @param  {object} evt Mouse event
   */
  function openModal(evt) {
    evt.preventDefault();

    var $modal = $(this).data('modal');
    $modal.addClass('is-open');
  }

  /**
   * click event handler used by the elements inside the modal wrapper which
   * contain the class .js-model.close. This function remove the css 'is-open'
   * state class and hides the modal.
   * @param  {object} evt Mouse click event
   */
  function closeModal(evt) {
    evt.preventDefault();
    $(this).removeClass('is-open');
  }

  /**
   * If the element used to initialize the contactMe plugin is an <a> element
   * the form will be wrapped with a modal plus overlay elements. This function
   * creates and return the modal wrapper and also binds events to it.
   * @param  {object} options Defaults and options set by the user
   * @return {object}         jQuery object containing the modal structure.
   */
  function createModalForm(options) {
    var $modal = $('<div class="cm-modal">');
    $modal.append($('<div class="js-close-modal cm-overlay">'));
    $modal.append(createForm(options).addClass('cm-form--modal'));
    $modal.on('click', '.js-close-modal', closeModal.bind($modal));
    return $modal;
  }

  /**
   * Function used to create the whole form which will be used. It calls another
   * helper function to create all form fields and buttons.
   * @param  {object} options Object containing all defaults and user chosen options.
   * @return {object}         jQuery object containing all the form structure.
   */
  function createForm(options) {
    var endpoint = options.endpoint;
    var fields = options.fields;
    var $form = $('<form>').attr({
      id: 'contact-me-' + options.id || options.name,
      name: 'contact-me-' + options.id || options.name,
      class: 'cm-form',
      action: endpoint,
      method: 'POST'
    });

    $form.append($('<div class="cm-form__message">'));
    $form.append(createHiddenInput('token', options.token));
    $form.append(createHiddenInput('secret', options.secret));

    for (var field in fields) {
      var value = fields[field];
      if (typeof value === 'boolean') {
        $form.append(createInput(field, value));
      } else if (value.length) {
        $form.append(createSelect(field, value));
      }
    }

    $form.append(createButton(options.modal));

    $form.on('submit', options.onSubmit);

    return $form;
  }

  function createHiddenInput(name, value) {
    return $('<input>')
      .attr({
        type: 'hidden',
        name: name,
        value: value
      });
  }

  /**
   * Create a HTML input. Sets the attribute name and type of the input based on
   * the parameter 'name'. Depending on which name its used for the input, the
   * element will receive a differente type of input.
   * @param  {string} name     Name of the input
   * @param  {boolean} required Field is required
   * @return {object}          The jQuery object containing the input
   */
  function createInput(name, required) {
    var $wrapper = $('<div class="cm-form__field">');
    var $label = $('<label>').html(name.toUpperCase());
    $label.append(
      $('<input>')
        .attr({
          class: 'cm-form__input cm-form__' + name + ' u-full-width',
          type: (name === 'email') ? 'email' :
            (name === 'password') ? 'password' : 'text',
          placeholder: 'Enter your ' + name,
          required: required,
          name: name
        })
    );
    return $wrapper.append($label);
  }

  function createSelect(name, values) {
    var $wrapper = $('<div class="cm-form__field">');
    var $label = $('<label>').html(name.toUpperCase());

    var $select = $('<select>')
      .attr({
        id: name,
        class: 'cm-form__input cm-form__' + name + ' u-full-width',
        name: name
      });

    for (var i in values) {
      var value = values[i];
      $select.append($('<option>').val(value.toLowerCase()).html(value));
    }

    $label.append($select);
    return $wrapper.append($label);
  }

  function createButton(isModal) {
    var $wrapper = $('<div class="cm-form__field">');

    $wrapper.append(
      $('<button>')
        .attr({
          type: 'submit',
          class: 'cm-form__button button-primary'
        })
        .html('Submit')
    );

    $wrapper.append(
      $('<button type="reset">').css('display', 'none')
    );

    if (isModal) {
      $wrapper.append(
        $('<button>')
        .attr({
          type: 'button',
          class: 'js-close-modal cm-form__button'
        })
        .html('Close')
      );
    }

    return $wrapper;
  }

  function onSubmit(evt) {
    evt.preventDefault();

    var $form = $(this);
    var endpoint = $form.attr('action');

    $.post(endpoint, $form.serialize())
      .done(function(data, status) {
        $form.flashMessage(status,
          'Successfully inserted: ' + data.name
        );
        $form.find('[type=reset]').trigger('click');
      })
      .fail(function(jqxhr, status, msg) {
        $form.flashMessage(status, msg);
        $form.find(':invalid').focus();
      });
  }
});
