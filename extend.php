<?php
use Flarum\Extend;
return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/less/forum.less')
        ->js(__DIR__ . '/js/dist/forum.js'),
    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/less/admin.less'),
    new Extend\Locales(__DIR__ . '/locale'),
];
