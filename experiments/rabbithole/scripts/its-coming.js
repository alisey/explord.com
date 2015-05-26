// @@dwait
// @@require jms/lib/jquery/jquery.current.js
// @@require jms/pages/its-coming/camera.js
// @@require jms/pages/its-coming/controls.js
// @@require jms/pages/its-coming/platform.js
// @@require jms/pages/its-coming/player-behavior.js
// @@require jms/pages/its-coming/player-sprite.js
// @@require jms/pages/its-coming/player.js
// @@require jms/pages/its-coming/speech-bubble.js
// @@require jms/pages/its-coming/utilities.js
// @@require jms/pages/its-coming/world-exit.js
// @@require jms/pages/its-coming/world.js


window.scrollTo(0, 0);
$('.mlt-link').remove();
preload(['//st.deviantart.com/its-coming/fella-spritesheet.png']).done(function() {
    world = new World();
});

// TODO: preload backgrounds
//preload([...]);