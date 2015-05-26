<?
function utf8_str_split($string) {
    $length = mb_strlen($string, 'UTF-8');
    $chars = [];
    for ($i = 0; $i < $length; $i++) {
        $chars []= mb_substr($string, $i, 1, 'UTF-8');
    }
    return $chars;
}

function render_into_html($string, $encoding) {
    $chars = ($encoding == 'UTF-8') ? utf8_str_split($string) : str_split($string);
    $html = '';
    foreach ($chars as $char) {
        $is_valid = ($encoding == 'UTF-8') ? is_valid_utf8($char) : is_valid_cp1252($char);
        if ($char == ' ') {
            $html_class = 'space-char';
            $html_char  = '&#x2423;';
        } elseif ($is_valid && strlen($char) == 1 && $char <= ' ') {
            $html_class = 'special-char';
            $html_char = '&#x24' . bin2hex($char) . ';';
        } elseif ($is_valid) {
            $html_class = '';
            $html_char  = mb_encode_numericentity($char, [0x0, 0xffff, 0, 0xffff], $encoding);
        } else {
            $html_class = 'invalid-char';
            $html_char  = '&#xFFFD;';
        }
        $html .= '<span class="' . $html_class . '">' . $html_char . '</span>';
    }
    return $html;
}

function raw_query_blocks($string) {
    preg_match_all('/%..|./', $string, $chars);
    return implode('', array_map('raw_query_block', $chars[0]));
}

function raw_query_block($char) {
    $html  = '<table class="char-block">';
    $html .= '<tr class="url"><td>' . $char;
    $html .= '<tr class="hex"><td>' . strtoupper(bin2hex(urldecode($char)));
    $html .= '</table>';
    return $html;
}

function is_valid_utf8($string) {
    return mb_check_encoding($string, 'UTF-8');
}

function is_valid_cp1252($string) {
    return mb_check_encoding($string, 'CP1252');
}

function char_blocks($string) {
    return implode('', array_map('char_block', utf8_str_split($string)));
}

function char_block($utf8_char) {
    $block  = '<table class="char-block">';

    $block .= '<tr class="utf8">';
    $block .= '<td class="char"' .
              ' colspan="' . strlen($utf8_char) . '">' .
              render_into_html($utf8_char, 'UTF-8') .
              '<div class="bracket-wrap"><div class="bracket"></div></div>';

    $block .= '<tr class="hex">';
    foreach (str_split($utf8_char) as $byte) {
        $block .= '<td>' . strtoupper(bin2hex($byte));
    }

    $block .= '<tr class="cp1252">';
    foreach (str_split($utf8_char) as $byte) {
        $block .= '<td class="char">' .
                  '<div class="bracket-wrap"><div class="bracket"></div></div>' .
                  render_into_html($byte, 'CP1252');
    }

    $block .= '</table>';
    return $block;
}

$cp1252_url = '/experiments/encoding/latin1/';
$utf8_url   = '/experiments/encoding/utf8/';

$text = $_GET['text'];
$base_url = $utf8 ? $utf8_url : $cp1252_url;

preg_match('/text=([^&#]+)/', $_SERVER['QUERY_STRING'], $raw_query);
$raw_query = array_pop($raw_query);

if ($utf8) {
    header('content-type:text/html; charset=UTF-8');
} else {
    header('content-type:text/html; charset=ISO-8859-1');
}

?>
<!doctype html>
<head>
    <title><?= $utf8 ? 'UTF-8' : 'CP-1252' ?></title>
    <meta charset="<?= $utf8 ? 'UTF-8' : 'ISO-8859-1' ?>">
    <style>
        html {
            margin: 0;
            padding: 0;
            border: 0;
            font: 14px/1.4 Arial;
            background: #fff;
        }

        body {
            margin: 0;
            padding: 30px 0;
            border: 0;
            width: 600px;
            margin: 0 auto;
        }

        a {
            color: #556e8c;
        }

        .encoding-link {
            margin-left: 5px;
        }

        .encoding-link.active {
            background: #556E8C;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            text-decoration: none;
        }

        label {
            color: #999;
        }

        label .example {
            cursor: pointer;
            color: #556e8c;
            border-bottom: 1px dotted;
        }

        form {
            margin: 30px 0 0 0;
            padding: 0;
        }

        textarea {
            box-sizing: border-box;
            width: 100%;
            height: 100px;
            margin-top: 2px;
            font: 14px/1.4 Consolas, Menlo, monospace;
            padding: 5px;
        }

        .results {
            margin-top: 30px;
        }

        .results .section {
            margin-bottom: 20px;
            padding: 10px;
            background: #f3f3f3; /* #EBEFF0; */
            border-radius: 5px;
        }

        .char-block {
            display: inline-table;
            border: 0;
            border-collapse: separate;
            border-spacing: 10px 0;
            margin-left: -10px;
        }

        .char-block td {
            text-align: center;
            line-height: 20px;
            padding: 0;
            min-width: 20px;
            vertical-align: middle;
            font-family: Consolas, Menlo, monospace;
        }

        .char-block .hex {
            font-weight: bold;
        }

        .char-block-labels {
            display: inline-table;
            border-spacing: 0;
            color: #999;
        }

        .char-block-labels td {
            line-height: 20px;
            vertical-align: middle;
            padding: 0;
            width: 95px;
        }

        .output {
            font-family: Consolas, Menlo, monospace;
            letter-spacing: 2px;
        }

        .invalid-char {
            color: #D66;
        }

        .space-char {

        }

        .url td {
            font-size: 9px;
        }

        .bracket-wrap {
            position: relative;
        }

        .bracket {
            position: absolute;
            border: 1px solid #aaa;
            box-sizing: border-box;
            width: 100%;
            height: 3px;
        }

        .utf8 .bracket {
            border-bottom: 0;
        }

        .cp1252 .bracket {
            border-top: 0;
            margin-top: -3px;
        }
    </style>
</head>
<body>
    <label>Page charset</label>
    <a class="encoding-link <?= $utf8 ? '' : 'active' ?>" href="<?= $cp1252_url ?>">ISO-8859-1</a>
    <a class="encoding-link <?= $utf8 ? 'active': ''  ?>" href="<?= $utf8_url ?>">UTF-8</a>

    <form action="<?= $base_url ?>">
        <label>Type something, e.g.
            <span class="example">Q &euro; &Psi;</span></label>
        <textarea name="text"><?= htmlspecialchars($text, ENT_QUOTES, 'CP1252') ?></textarea><br>
        <input type="submit">
    </form>

    <? if ($text): ?>
        <div class="results">

            <div class="section">
                <label>GET data echoed:</label>
                <span class="output"><?= $text ?></span>
            </div>

            <div class="section">
                <table class="char-block-labels">
                    <tr><td>Raw query
                    <tr><td>URL-decoded
                </table>
                <?= raw_query_blocks($raw_query) ?>
            </div>

            <div class="section">
                <table class="char-block-labels">
                    <tr><td>UTF-8
                    <tr><td>Bytes
                    <tr><td>CP-1252
                </table>
                <?= char_blocks($text) ?>
            </div>

            <!-- div class="section">
                <label>GET data interpreted as UTF-8:</label>
                <span class="output"><?= render_into_html($text, 'UTF-8') ?></span>
            </div>

            <div class="section">
                <label>GET data interpreted as CP-1252:</label>
                <span class="output"><?= render_into_html($text, 'CP1252') ?></span>
            </div -->

        </div>
    <? endif ?>

    <script>
        var textarea = document.querySelector('textarea');
        var example  = document.querySelector('.example');
        example.onclick = function() {
            textarea.value = this.textContent;
            textarea.focus();
        };
    </script>
</body>