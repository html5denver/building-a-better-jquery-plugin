// Outer wrapper to test for AMD support. factory is a function defined below
(function(factory) {
  // If AMD support is found then start the loading
  if(typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    // Else just execute the function, jQuery is passed in just in case
    // noconflict is turned on
    factory(jQuery);
  }
})(function($){
  // This is our factory function, jQuery is passed in as '$'

  'use strict';

  // If you are going to test this you probably need to make
  // this available to the global scope (global.Outliner = function) or
  // have some other testing setup.
  //
  var Outliner = function(el, options) {
    // Set our element to a property
    this.$el = $(el);

    // Save a new function with 'this' set to
    // the correct context, also makes it easy to destroy
    // the plugin later by removing the handler
    this.handler = $.proxy(
      function() { this.set_props(options) },
      this
    );

    // Add the click handler
    this.$el.on('click', this.handler);
  };


  Outliner.prototype = {
    // separate methods for setting our border props
    set_color: function(color) {
      this.$el.css('borderColor', color);
    },

    set_style: function(style) {
      this.$el.css('borderStyle', style);
    },

    set_width: function(width) {
      this.$el.css('borderWidth', width);
    },

    // convenience function to set all the props at once
    // options is an object. This is called when the user
    // clicks on the div
    set_props: function(options) {
      this.set_color(options.borderColor);
      this.set_style(options.borderStyle);
      this.set_width(options.borderWidth);
    },

    // always a good idea to add a destroy method to clean
    // up after your plugin
    destroy: function() {
      this.$el.off('click', this.handler);
    }
  }

  // The jQuery plugin Code
  $.fn.outliner = function(options) {

    // This gets all the arguments AFTER the first one
    // Used to pass arguments to methods
    var args  = $.makeArray(arguments),
        after = args.slice(1);

    // Start the plugin loop, loops each matched element
    return this.each(function() {
      var instance,
          $el = $(this);

      // Check to see if we have already created the plugin for
      // this element
      instance = $el.data('outliner');

      if(instance) {
        // If we have a plugin, assume we're calling a method
        // First argument is the method name, other arguments
        // are parameters to that method
        instance[ args[0] ].apply(instance, after);
      } else {
        // Otherwise just create the plugin. Start by mixing
        // in any options to the defaults
        options = $.extend({
          borderColor: 'red',
          borderWidth: '3px',
          borderStyle: 'solid'
        }, options);

        // Initialize the object and add a reference using
        // the jQuery data method.
        $el.data( 'outliner', new Outliner($el, options) );
      }

    });
  }

});

