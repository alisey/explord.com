function makeRecord(text) {
    function solve(text) {
        text = text.toLowerCase();
        if (!text) return '';
        for (var i = 0; i < text.length - 1; i++) {
            for (j = 0; j < 2; j++) {
                steps.push(['p', i + j / 2]);
                expand(text, i, i+j);
            }
        }
    }

    function expand(text, lo, hi) {
        if (lo < 0 || hi >= text.length) {
            return false;
        } else if (lo == hi) {
            return expand(text, lo - 1, hi + 1) || [lo, hi + 1];
        } else if (text[lo] == text[hi]) {
            steps.push(['c', lo, hi, 1]);
            return expand(text, lo - 1, hi + 1) || [lo, hi + 1];
        } else {
            steps.push(['c', lo, hi, 0]);
            return false;
        }
    }
    
    var steps = [text];
    solve(text);
    return steps;
}