module.exports = function parsed(text) {
    var emoji = [
        {
            re: /:-\)/g,
            name: 'smiley'
        },
        {
            re: /:\)/g,
            name: 'smiley'
        },
        {
            re: /:D/g,
            name: 'laughing'
        },
        {
            re: /:-D/g,
            name: 'laughing'
        },
        {
            re: /:d/g,
            name: 'laughing'
        },
        {
            re: /:-d/g,
            name: 'laughing'
        },
        {
            re: /:O/g,
            name: 'open-mouth'
        },
        {
            re: /:-O/g,
            name: 'open-mouth'
        },
        {
            re: /:o/g,
            name: 'open-mouth'
        },
        {
            re: /:-o/g,
            name: 'open-mouth'
        },
        {
            re: /:-\(/g,
            name: 'worried'
        },
        {
            re: /:\(/g,
            name: 'worried'
        },
        {
            re: /;-\)/g,
            name: 'wink'
        },
        {
            re: /;\)/g,
            name: 'wink'
        },
        {
            re: /:'-\(/g,
            name: 'cry'
        },
        {
            re: /:'\(/g,
            name: 'cry'
        },
        {
            re: /:3/g,
            name: 'heart'
        },
        {
            re: /:P/g,
            name: 'stuck-out-tongue'
        },
        {
            re: /:p/g,
            name: 'stuck-out-tongue'
        },
        {
            re: /;P/g,
            name: 'stuck-out-tongue-winking-eye'
        },
        {
            re: /;p/g,
            name: 'stuck-out-tongue-winking-eye'
        }
    ];
    emoji.forEach(function (emo) {
        text = text.replace(emo.re, '<i class="twa twa-' + emo.name + ' twa-lg"></i>');
    });
    return text;
};
