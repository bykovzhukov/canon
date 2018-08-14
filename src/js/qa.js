import '../css/special.styl';

import BaseSpecial from './base';
import { makeElement, removeChildren } from './lib/dom';
import { shuffle } from './lib/array';
import Data from './dataQA';
import Svg from './svg';

const CSS = { main: 'Canon' };
const EL = {};

export default class QA extends BaseSpecial {

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
    EL.qa = makeElement('div', CSS.main + '__qa');
    EL.logo = makeElement('img', CSS.main + '__logo', {
      src: 'images/ab.jpg',
      srcset: 'images/ab@2x.jpg 2x'
    });
    EL.desc = makeElement('div', CSS.main + '__desc', {
      textContent: Data.description,
    });
    EL.pages = makeElement('div', CSS.main + '__pages');
    
    EL.options = makeElement('div', CSS.main + '__options');
    EL.option1 = makeElement('div', CSS.main + '__option');
    EL.option2 = makeElement('div', CSS.main + '__option');
    EL.option1.addEventListener('click', this.makeAnswer.bind(this));
    EL.option2.addEventListener('click', this.makeAnswer.bind(this));

    EL.optionSep = makeElement('div', CSS.main + '__option-sep', {
      textContent: 'или'
    });

    EL.optionsArr = [];
    EL.optionsArr.push(EL.option1);
    EL.optionsArr.push(EL.option2);

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

    EL.options.appendChild(EL.option1);
    EL.options.appendChild(EL.optionSep);
    EL.options.appendChild(EL.option2);

    EL.qa.appendChild(EL.logo);
    EL.qa.appendChild(EL.desc);
    EL.qa.appendChild(EL.pages);
    EL.qa.appendChild(EL.options);

  }

  makePages() {
    removeChildren(EL.pages);
    Data.questions.forEach((item, i) => {
      let p = makeElement('div');
      if (i <= this.activeIndex) { p.classList.add('is-filled') }
      EL.pages.appendChild(p);
    });
  }

  makeNextQuestion() {
    let q = Data.questions[this.activeIndex];

    this.makePages();

    let options = q.options.map((item, i) => { item.id = i; return item; });
    shuffle(options);
    options.forEach((item, i) => {
      EL.optionsArr[i].classList.remove('is-correct');
      EL.optionsArr[i].classList.remove('is-incorrect');
      EL.optionsArr[i].dataset.id = item.id;
      EL.optionsArr[i].innerHTML = '<div class="' + CSS.main + '__option-title" style="' + item.titleStyle + '">' + q.title + '</div>' + '<div class="' + CSS.main + '__option-text" style="' + q.textStyle + '">' + q.text + '</div>';
    });
  }

  makeAnswer(e) {
    if (this.inAnswer) { return; }
    this.inAnswer = true;

    let el = e.currentTarget,
        id = el.dataset.id,
        q = Data.questions[this.activeIndex];

    if (q.options[id].isCorrect) {
      this.correctAnswers++
      el.classList.add('is-correct');
    } else {
      el.classList.add('is-incorrect');
    }

    setTimeout(() => {
      this.inAnswer = false;
      if (this.activeIndex < Data.questions.length - 1) {
        this.activeIndex++;
        this.makeNextQuestion();
      } else {
        this.makeResult();
      }
    }, 1000);
  }

  makeResult() {
    EL.qa.removeChild(EL.pages);
    EL.qa.removeChild(EL.options);

    EL.rScore.textContent = this.correctAnswers + '/' + Data.questions.length;
    EL.rScoreText.textContent = Data.results[this.correctAnswers];

    EL.qa.appendChild(EL.result);
  }

  restart() {
    this.activeIndex = 0;
    this.correctAnswers = 0;

    EL.qa.removeChild(EL.result);

    EL.qa.appendChild(EL.pages);
    EL.qa.appendChild(EL.options);

    this.makeNextQuestion();
  }

  init() {
    this.activeIndex = 0;
    this.correctAnswers = 0;
    this.createElements();
    removeChildren(this.container);
    this.container.appendChild(EL.qa);
    this.makeNextQuestion();
  }
}








