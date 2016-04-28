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

  function createContainer(title) {
    return $([
      '<div class="container-fluid">',
      '<div class="panel panel-default">',
      '<div class="panel-heading">',
      '<div class="panel-title"><h3>' + title + '</h3></div>',
      '</div>',
      '<div class="panel-body"></div>',
      '</div>',
      '</div>'
    ].join(''));
  }

  function createForm(endpoint, fields) {
    var $form = $('<form class="contact-me-form">');

    $form.attr({
      action: endpoint,
      method: 'POST'
    });

    for (var field in fields) {
      var value = fields[field];
      if (typeof value === 'boolean') {
        $form.append(createInput(field, value));
      } else if (value.length) {
        $form.append(createSelect(field, value));
      }
    }

    $form.append(
      $('<button type="submit" class="btn btn-primary">').html('Submit')
    );

    return $form;
  }

  function createInput(name, required) {
    var $group = $('<div class="form-group">');
    $group.append($('<label>').attr('for', name).html(name.toUpperCase()));
    $group.append(
      $('<input class="form-control">')
        .attr({
          id: name,
          type: (name === 'email') ? 'email' :
            (name === 'password') ? 'password' : 'text',
          placeholder: 'Enter your ' + name,
          required: required,
          name: name
        })
    );
    return $group;
  }

  function createSelect(name, values) {
    var $group = $('<div class="form-group">');
    $group.append($('<label>').attr('for', name).html(name.toUpperCase()));

    var $select = $('<select class="form-control">').attr('name', name);

    for (var i in values) {
      var value = values[i];
      $select.append($('<option>').val(value.toLowerCase()).html(value));
    }

    return $group.append($select);
  }

  $.fn.contactMe = function(options) {
    var defaults = {
      title: 'Contact Me Form',
      fields: {
        name: true,
        email: true
      }
    };

    $.extend(true, defaults, options);

    return this.each(function() {
      var endpoint = defaults.endpoint || this.dataset.endpoint;

      if (!endpoint) {
        throw new ReferenceError(
          'You have to define an endpoint for the form.'
        );
      }

      var $container = createContainer(defaults.title);
      $container.find('.panel-body').append(
        createForm(endpoint, defaults.fields)
      );

      $(this).html($container);
    });
  };
});
