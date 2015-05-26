// @@dwait
// @@require jms/lib/jquery/jquery.current.js

// disable sitback and thumb modes
(function($){
    $('.right-buttons a').on('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
    });
})(jQuery);
