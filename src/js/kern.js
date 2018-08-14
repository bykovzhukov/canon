// import '../css/special.styl';

import BaseSpecial from './base';
import { makeElement, removeChildren } from './lib/dom';
import { shuffle } from './lib/array';
import Data from './dataKern';
import Svg from './svg';

const CSS = { main: 'Canon' };
const EL = {};

export default class Kern extends BaseSpecial {

  constructor(params = {}) {
    super();

    Object.assign(this.params, params);
    this.saveParams();

    if (Data && params.data) {
      Object.assign(Data, params.data);
    }

    this.init();
  }

  createElements() {
    EL.kern = makeElement('div', CSS.main + '__kern');
    EL.logo = makeElement('img', CSS.main + '__logo', {
      src: 'images/va.jpg',
      srcset: 'images/va@2x.jpg 2x'
    });
    EL.desc = makeElement('div', [CSS.main + '__desc', CSS.main + '__desc--kern'], {
      textContent: Data.description,
    });
    EL.pages = makeElement('div', CSS.main + '__pages');
    EL.string = makeElement('div', [CSS.main + '__string', CSS.main + '-str']);
    EL.sSample = makeElement('div', CSS.main + '-str__sample');

    EL.lettersArr = [];
    Data.questions.forEach((item, i) => {
      let letters = makeElement('div', [CSS.main + '-str__letters', CSS.main + '-str__letters--' + (i+1)], {
        innerHTML:  item.svg + '<span></span>',
      });

      makeDraggable(letters);
      EL.lettersArr.push(letters);
    });

    EL.notice = makeElement('div', CSS.main + '__notice');
    EL.compare = makeElement('div', CSS.main + '__compare');
    EL.nextBtn = makeElement('button', CSS.main + '__next-btn', {
      textContent: 'Далее',
      data: {
        click: 'continue'
      }
    });

    EL.kern.appendChild(EL.logo);
    EL.kern.appendChild(EL.desc);
    EL.kern.appendChild(EL.pages);
    EL.kern.appendChild(EL.string);
    EL.kern.appendChild(EL.notice);
    EL.kern.appendChild(EL.nextBtn);

  }

  makePages() {
    removeChildren(EL.pages);
    Data.questions.forEach((item, i) => {
      let p = makeElement('div');
      if (i <= this.activeIndex) { p.classList.add('is-filled') }
      EL.pages.appendChild(p);
    });
  }

  lettersShift(el) {
    let paths = el.querySelectorAll('path:not(:first-child):not(:last-child)');
    [].slice.call(paths).forEach(item => {
      let offsetX = Math.random() * (10 + 10) - 10;
      item.setAttribute('transform', 'translate(' + offsetX + ', 0)');
      item.setAttribute('data-x', offsetX);
    });
  }

  lettersCompare(el) {
    let paths = el.querySelectorAll('path:not(:first-child):not(:last-child)'),
        number = 20,
        arr;

    arr = [].slice.call(paths).map((item, i) => {
      let x = item.getAttribute('data-x'),
          offsetPer = Math.round(Math.abs(x / number) * 100);

      return offsetPer > 100 ? 100 : offsetPer;
    });

    console.log(arr);

    return 100 - Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  makeNextQuestion() {
    let q = Data.questions[this.activeIndex];

    this.makePages();

    removeChildren(EL.string);

    EL.string.classList = '';
    EL.string.classList.add(CSS.main + '__string');
    EL.string.classList.add(CSS.main + '-str');
    EL.string.classList.add(CSS.main + '-str--' + (this.activeIndex+1));

    this.lettersShift(EL.lettersArr[this.activeIndex]);
    EL.string.appendChild(EL.lettersArr[this.activeIndex]);
    EL.notice.textContent = q.notice;

    EL.nextBtn.dataset.click = 'compare';
  }

  compare() {
    let q = Data.questions[this.activeIndex];
    
    this.results[this.activeIndex] = this.lettersCompare(EL.lettersArr[this.activeIndex]);

    EL.sSample.innerHTML = q.svg;
    EL.string.appendChild(EL.sSample);

    EL.kern.removeChild(EL.notice);
    EL.compare.textContent = this.results[this.activeIndex] + '%';
    EL.kern.appendChild(EL.compare);

    EL.nextBtn.dataset.click = 'continue';
  }

  continue() {
    if (this.activeIndex < Data.questions.length - 1) {
      this.activeIndex++;
      EL.string.removeChild(EL.sSample);
      EL.kern.removeChild(EL.compare);
      EL.kern.appendChild(EL.notice);
      this.makeNextQuestion();
    } else {
      console.log('result');
      console.log(Math.round(this.results.reduce((a, b) => a + b, 0) / this.results.length));
    }
  }

  init() {
    this.activeIndex = 0;
    this.results = [];
    this.createElements();
    removeChildren(this.container);
    this.container.appendChild(EL.kern);

    this.makeNextQuestion();
  }

}


function makeDraggable(el) {
  var selectedElement, offset;
  var svg = el.children[0];
  el.addEventListener('mousedown', startDrag);
  el.addEventListener('mousemove', drag);
  el.addEventListener('mouseup', endDrag);
  el.addEventListener('mouseleave', endDrag);

  function startDrag(e) {
    if (e.target.tagName === 'path'
        && (e.target.previousSibling && e.target.nextSibling)
    ) {
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
          // x = Math.ceil(coord.x - offset.x);
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
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  }

}