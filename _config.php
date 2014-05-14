<?php

define('LINKABLE_DATAOBJECTS_DIR', basename(dirname(__FILE__)));

$linkables = ClassInfo::implementorsOf('Linkable');
foreach ($linkables as $class) {
	//die(strtolower($class).'_link');
	ShortcodeParser::get('default')->register(strtolower($class).'_link', array($class, 'link_shortcode_handler'));
}

