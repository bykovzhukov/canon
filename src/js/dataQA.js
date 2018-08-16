export default {
    description: 'Некоторые шрифты особенно хорошо сочетаются, составляя пару для заголовка и текста. Попробуйте угадать, какие.',
    questions: [{
        title: 'Ещё одна<br>особенность',
        text: 'Прозрачные емкости, расположенные спереди, позволяют определить уровень чернил, а за счет особой конструкции принтера перезаправка проходит быстро.',
        textStyle: 'font-family: Verdana; line-height: 24px;',
        options: [{
            titleStyle: 'font-family: Georgia; line-height: 24px;',
            isCorrect: true
        }, {
            titleStyle: 'font-family: Times New Roman; line-height: normal; margin-bottom: 15px;'
        }]
    }, {
        title: 'Преимущество',
        text: 'Система подачи бумаги вмещает 100 листов бумаги. Она обеспечивает прохождение самых разных типов носителей, включая глянцевую квадратную фотобумагу.',
        textStyle: 'font-family: Bookman Old Style; line-height: 23px;',
        options: [{
            titleStyle: 'font-family: Roboto; line-height: 25px; margin-bottom: 16px;',
            isCorrect: true
        }, {
            titleStyle: 'font-family: PT Serif; line-height: 25px; margin-bottom: 15px;'
        }]
    }, {
        title: 'Подойдёт<br>для офиса',
        text: 'Компания Canon разработала пигментные черные и цветные чернила для больших объёмов печати.',
        textStyle: 'font-family: Lucida Console; line-height: 19px;',
        options: [{
            titleStyle: 'font-family: Lora; line-height: 24px; margin-bottom: 11px',
            isCorrect: true
        }, {
            titleStyle: 'font-family: Impact; line-height: normal; margin-bottom: 15px;'
        }]
    }],
    results: [
        'Шрифты — это не ваше',
        'Вам только в экспресс-дизайн.',
        'У вас есть задатки дизайнера!',
        'Дизайн спасёт мир.'
    ]
};