import BaseSpecial from './base';
import { makeElement, removeChildren } from './lib/dom';
import { shuffle } from './lib/array';
import { animate, requestAnimate } from './lib/animate';
import makeDraggable from './lib/drag';
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

    EL.result = makeElement('div', CSS.main + '__result');
    EL.rScore = makeElement('div', CSS.main + '__score');
    EL.rScoreText = makeElement('div', CSS.main + '__score-text');
    EL.rRestartBtn = makeElement('div', CSS.main + '__restart-btn', {
      innerHTML: '<span>Пройти еще раз</span>' + Svg.refresh,
      data: {
        click: 'restart'
      }
    });

    EL.result.appendChild(EL.rScore);
    EL.result.appendChild(EL.rScoreText);
    EL.result.appendChild(EL.rRestartBtn);

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

    EL.lettersArr[this.activeIndex].dataset.draggable = true;
    this.lettersShift(EL.lettersArr[this.activeIndex]);
    EL.string.appendChild(EL.lettersArr[this.activeIndex]);
    EL.notice.textContent = q.notice;

    EL.nextBtn.dataset.click = 'compare';
  }

  compare() {
    let q = Data.questions[this.activeIndex],
        score = 0;

    score = this.lettersCompare(EL.lettersArr[this.activeIndex]);

    this.results[this.activeIndex] = score;
    EL.lettersArr[this.activeIndex].dataset.draggable = '';

    EL.sSample.innerHTML = q.svg;
    EL.string.appendChild(EL.sSample);
    animate(EL.sSample, 'fadeIn', '800ms');

    EL.kern.removeChild(EL.notice);

    requestAnimate({
      duration: score*10,
      timing: timeFraction => timeFraction,
      draw: progress => {
        let n = Math.ceil(score * progress);
        EL.compare.textContent = n + '%';
      }
    });

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
      this.makeResult();
    }
  }

  restart() {
    this.activeIndex = 0;
    this.results = [];

    EL.kern.removeChild(EL.result);

    EL.kern.appendChild(EL.pages);
    EL.kern.appendChild(EL.string);
    EL.kern.appendChild(EL.notice);
    EL.kern.appendChild(EL.nextBtn);

    this.makeNextQuestion();
  }

  getResultText(score) {
    let text = '';
    Data.results.some(item => {
      if (item.range[0] <= score && item.range[1] >= score) {
        text = item.text;
        return true;
      }
    });

    return text;
  }

  makeResult() {
    EL.kern.removeChild(EL.pages);
    EL.kern.removeChild(EL.string);
    EL.kern.removeChild(EL.compare);
    EL.kern.removeChild(EL.nextBtn);

    let score = Math.round(this.results.reduce((a, b) => a + b, 0) / this.results.length);

    // requestAnimate({
    //   duration: 1000,
    //   timing: timeFraction => timeFraction,
    //   draw: progress => {
    //     console.log(progress);

    //     EL.rScore.textContent = score + '%';
    //   }
    // });

    requestAnimate({
      duration: score*10,
      timing: timeFraction => timeFraction,
      draw: progress => {
        let n = Math.ceil(score * progress);
        EL.rScore.textContent = n + '%';
      }
    });

    // EL.rScore.textContent = score + '%';
    EL.rScoreText.textContent = this.getResultText(score);

    EL.kern.appendChild(EL.result);
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