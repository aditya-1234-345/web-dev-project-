<?php
session_start();
session_unset();
session_destroy();

if (isset($_GET['ajax'])) {
    echo 'OK';      // सिर्फ़ टेक्स्ट वापस भेज रहे हैं
    exit;
}
header('Location: index.html');
exit;
