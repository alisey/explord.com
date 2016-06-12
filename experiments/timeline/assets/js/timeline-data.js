var timelineData = (function() {
    var media = [
        'assets/images/slides/01.jpg',
        'assets/images/slides/02.jpg',
        'assets/images/slides/03.jpg',
        'assets/images/slides/04.jpg',
        'assets/images/slides/05.jpg',
        'assets/images/slides/06.jpg',
        'assets/images/slides/07.jpg',
        'assets/images/slides/08.jpg',
        'assets/images/slides/09.jpg',
        'assets/images/slides/10.jpg',
        'assets/images/slides/11.jpg',
        'assets/images/slides/12.jpg',
        'assets/images/slides/13.jpg',
        'assets/images/slides/14.jpg',
        'assets/images/slides/15.jpg',
        'assets/images/slides/16.jpg',
        'assets/images/slides/17.jpg',
        'assets/images/slides/18.jpg',
        'assets/images/slides/19.jpg',
        'assets/images/slides/20.jpg',
        'assets/images/slides/21.jpg',
        'assets/images/slides/22.jpg',
        'assets/images/slides/23.jpg',
        'assets/images/slides/24.jpg',
        'assets/images/slides/25.jpg',
        'assets/images/slides/26.jpg',
        'assets/images/slides/27.jpg',
        'assets/images/slides/28.jpg',
        'assets/images/slides/29.jpg',
        'assets/images/slides/30.jpg',
        'assets/images/slides/31.jpg',
        'assets/images/slides/32.jpg',
        'assets/images/slides/33.jpg',
        'assets/images/slides/34.jpg',
        'assets/images/slides/35.jpg',
        'assets/images/slides/36.jpg',
        'assets/images/slides/37.jpg',
        'assets/images/slides/38.jpg',
        'assets/images/slides/39.jpg',
        'assets/images/slides/40.jpg',
        'assets/images/slides/41.jpg',
        'assets/images/slides/42.jpg',
        'assets/images/slides/43.jpg',
        'https://www.youtube.com/watch?v=6Vg54g51nb4',
        'https://www.youtube.com/watch?v=_f-18GyVUWM',
        'https://www.youtube.com/watch?v=ck25bSSnwFU',
        'https://www.youtube.com/watch?v=9HI8FerKr6Q',
        'https://www.youtube.com/watch?v=YGZP0ijukt8',
        'https://www.youtube.com/watch?v=BickMFHAZR0',
        'https://www.youtube.com/watch?v=mvADH_dLb4w'
    ];

    var rand = function(a, b) {
        return a + Math.random() * (b - a);
    };

    var randint = function(a, b) {
        return Math.floor(rand(a, b));
    };

    var randchoice = function(atoms) {
        return atoms[randint(0, atoms.length)];
    };

    var shuffle = function(atoms) {
        for (var i = 0; i < atoms.length; i++) {
            var j = randint(i, atoms.length);
            var temp = atoms[i];
            atoms[i] = atoms[j];
            atoms[j] = temp;
        }
    };

    var range = function(a, b) {
        var values = [];
        for (var i = a; i < b; i++) {
            values.push(i);
        }
        return values;
    };

    var generateWord = function(length) {
        var vowels = ['a', 'e', 'i', 'o', 'u'];
        var consonants = [
            'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q',
            'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
        ];
        var start = randint(0, 2);
        return range(0, length).map(function(_, i) {
            return randchoice([vowels, consonants][(i + start) % 2]);
        }).join('');
    };

    var generateText = function(length) {
        return range(0, length).map(function() {
            return generateWord(randint(1, 9));
        }).join(' ');
    };

    var capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var now = Date.now();
    var year = 365 * 24 * 60 * 60 * 1000;
    var eventCount = media.length;
    var minDate = now - 5 * year;
    var maxDate = now + 1 * year;
    var dates = range(0, eventCount).map(function(_, i) {
        var step = (maxDate - minDate) / eventCount;
        return minDate + step * rand(i - 1, i + 1);
    });
    dates.sort(function(a, b) { return a - b; });
    shuffle(media);
    var events = dates.map(function(date, i) {
        return {
            date: new Date(date).toISOString().substr(0, 10),
            title: capitalizeFirstLetter(generateText(randint(3, 10))),
            text: capitalizeFirstLetter(generateText(randint(20, 60))) + '.',
            link: '',
            media: media[i % media.length],
            mediaCaption: ''
        };
    });
    var selected = dates.reduce(function(prev, cur, i) {
        return cur < now ? i : prev;
    }, 0);
    return {
        events: events,
        selected: selected
    };
})();
