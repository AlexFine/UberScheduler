var controller = new ScrollMagic.Controller();

var scene = ScrollMagic.Scene({
    duration: $(window).height() - 100, // pin element for the window height - 1
    triggerHook: 0, // don't trigger until #pinned-trigger1 hits the top of the viewport
    reverse: true // allows the effect to trigger when scrolled in the reverse direction

}).setPin("#car");

controller.addScene([
  scene,
  scene2
]);
