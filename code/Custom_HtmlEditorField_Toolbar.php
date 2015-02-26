<?php

/**
 * Custom_HtmlEditorField_Toolbar extension that permit to link DataObjects
 * arbitrari tramite TinyMce
 *
 * @author Gabriele Brosulo <gabriele.brosulo@zirak.it>
 * @creation-date 10-Mar-2014
 */
class Custom_HtmlEditorField_Toolbar extends Extension{

	/**
	 * Aggiorna l'elenco delle possibili opzioni di link
	 * @param Form $form
	 * @return type
	 */
	public function updateLinkForm($form) {
		
		Requirements::javascript(LINKABLE_DATAOBJECTS_DIR . "/javascript/linkable-dataobjects.js");
		
		$fields = $form->Fields();
		/* @var $linkTipe CompositeField */
		$compositeField = $fields[1];
		/* @var $linkTipe OptionsetField */
		$linkTipe = $fields[1]->fieldByName("LinkType");
		
		$options = $linkTipe->getSource();
		
		$linkables = ClassInfo::implementorsOf('Linkable');
		foreach ($linkables as $class) {
			$identifier = str_replace('\\', '-', strtolower($class));			
			$options[$identifier] = $class::LinkLabel();
			$linkTipe->setSource($options);

			$dropdown = new DropdownField($identifier, _t('HtmlEditorField.NEWS', $class::LinkLabel()), $class::get()->map('ID', 'Title'));
			$dropdown->addExtraClass('linkabledo');
			$compositeField->push($dropdown);
		}
		
		return $form;
	}
}
