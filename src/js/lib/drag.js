import { animate } from './animate';

export default function makeDraggable(el) {
  var selectedElement, offset;
  var svg = el.children[0];
  el.addEventListener('mousedown', startDrag);
  el.addEventListener('mousemove', drag);
  el.addEventListener('mouseup', endDrag);
  el.addEventListener('mouseleave', endDrag);

  el.addEventListener('touchstart', startDrag);
  el.addEventListener('touchmove', drag);
  el.addEventListener('touchend', endDrag);
  el.addEventListener('touchleave', endDrag);
  el.addEventListener('touchcancel', endDrag);

  function startDrag(e) {
    if (e.target.tagName === 'path' && el.dataset.draggable) {

      if (!(e.target.previousSibling && e.target.nextSibling)) {
        animate(e.target, 'shakeEffect', '800ms');
        return;
      }

      selectedElement = e.target;
      offset = getMousePosition(e);

      selectedElement.classList.add('is-dragged');
      
      if (selectedElement.getAttribute('data-x')) {
        offset.x -= parseFloat(selectedElement.getAttribute('data-x'));
      }
    }
  }

  function drag(e) {
    if (selectedElement) {
      e.preventDefault();
      var coord = getMousePosition(e),
          x = coord.x - offset.x;

      selectedElement.setAttribute('transform', 'translate(' + x + ', 0)');
      selectedElement.setAttribute('data-x', x);
    }
  }

  function endDrag(e) {
    if (selectedElement) {
      selectedElement.classList.remove('is-dragged');
      selectedElement = null;
    }
  }

  function getMousePosition(e) {
    var CTM = svg.getScreenCTM();
    if (e.touches) { e = e.touches[0]; }
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  }

}