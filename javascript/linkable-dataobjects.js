/**
 * File: HtmlEditorField_Iframe.js
 */
var ss = ss || {};

(function($) {

	$.entwine('ss', function($) {
		
		/**
		 * See framework/javascript/HtmlEditorField.js
		 */
		$('form.htmleditorfield-linkform').entwine({
			
			/**
			 * @return Object Keys: 'href', 'target', 'title'
			 */
			getLinkAttributes: function() {
				
				var href, target = null, anchor = this.find(':input[name=Anchor]').val();
				
				// Determine target
				if(this.find(':input[name=TargetBlank]').is(':checked')) target = '_blank';
								
				// All other attributes
				switch(this.find(':input[name=LinkType]:checked').val()) {
					case 'internal':
						href = '[sitetree_link,id=' + this.find(':input[name=internal]').val() + ']';
						if(anchor) href += '#' + anchor;
						break;

					case 'anchor':
						href = '#' + anchor; 
						break;
					
                    case 'file':
                        href = '[file_link,id=' + this.find('.ss-uploadfield .ss-uploadfield-item').attr('data-fileid') + ']';
                        target = '_blank';
                        break;
					
					case 'email':
						href = 'mailto:' + this.find(':input[name=email]').val();
						target = null;
						break;

					/* g4b0 */
//					// case 'external':
//					default:
//						href = this.find(':input[name=external]').val();
//						// Prefix the URL with "http://" if no prefix is found
//						if(href.indexOf('://') == -1) href = 'http://' + href;
//						break;
						
					case 'external':
						href = this.find(':input[name=external]').val();
						// Prefix the URL with "http://" if no prefix is found
						if(href.indexOf('://') == -1) href = 'http://' + href;
						break;
						
					default:
						var name=this.find(':input[name=LinkType]:checked').val();
						href = '['+name.replace('-', '_')+'_link,id=' + this.find(':input[name='+name+']').val() + ']';
						break;
						
					/* /g4b0 */
				}

				return {
					href : href, 
					target : target, 
					title : this.find(':input[name=Description]').val()
				};
			},
					
			/**
			 * Updates the state of the dialog inputs to match the editor selection.
			 * If selection does not contain a link, resets the fields.
			 */
			updateFromEditor: function() {
				
				var htmlTagPattern = /<\S[^><]*>/g, fieldName, data = this.getCurrentLink();

				if(data) {
					for(fieldName in data) {
						var el = this.find(':input[name=' + fieldName + ']'), selected = data[fieldName];
						// Remove html tags in the selected text that occurs on IE browsers
						if(typeof(selected) == 'string') selected = selected.replace(htmlTagPattern, ''); 

						// Set values and invoke the triggers (e.g. for TreeDropdownField).
						if(el.is(':checkbox')) {
							el.prop('checked', selected).change();
						} else if(el.is(':radio')) {
							el.val([selected]).change();
						} else {
							
							/* g4b0 */							
							//Sobstitution of erroneus label
							if (fieldName !== 'internal' && fieldName !== 'external' && fieldName !== 'file' && fieldName !== 'email') {								
								$('#'+ fieldName +'_chzn > a > span').ready(function() {									
									$('#'+ fieldName +' select.linkabledo > option').each(function() {										
										if (this.value == selected) {
											$('#'+ fieldName +'_chzn > a > span').text(this.text);
										}
									});
								});
							}
							/* /g4b0 */
							
							el.val(selected).change();
						}
					}
				}
			},
			
			/**
			* Return information about the currently selected link, suitable for population of the link form.
			*
			* Returns null if no link was currently selected.
			*/
		 getCurrentLink: function() {
			 
			 var selectedEl = this.getSelection(),
				 href = "", target = "", title = "", action = "insert", style_class = "";

			 // We use a separate field for linkDataSource from tinyMCE.linkElement.
			 // If we have selected beyond the range of an <a> element, then use use that <a> element to get the link data source,
			 // but we don't use it as the destination for the link insertion
			 var linkDataSource = null;
			 if(selectedEl.length) {
				 if(selectedEl.is('a')) {
					 // Element is a link
					 linkDataSource = selectedEl;
				 // TODO Limit to inline elements, otherwise will also apply to e.g. paragraphs which already contain one or more links
				 // } else if((selectedEl.find('a').length)) {
					 // 	// Element contains a link
					 // 	var firstLinkEl = selectedEl.find('a:first');
					 // 	if(firstLinkEl.length) linkDataSource = firstLinkEl;
				 } else {
					 // Element is a child of a link
					 linkDataSource = selectedEl = selectedEl.parents('a:first');
				 }				
			 }
			 if(linkDataSource && linkDataSource.length) this.modifySelection(function(ed){
				 ed.selectNode(linkDataSource[0]);
			 });

			 // Is anchor not a link
			 if (!linkDataSource.attr('href')) linkDataSource = null;

			 if (linkDataSource) {
				 href = linkDataSource.attr('href');
				 target = linkDataSource.attr('target');
				 title = linkDataSource.attr('title');
				 style_class = linkDataSource.attr('class');
				 href = this.getEditor().cleanLink(href, linkDataSource);
				 action = "update";
			 }
			 
			 if(href.match(/^mailto:(.*)$/)) {
				 return {
					 LinkType: 'email',
					 email: RegExp.$1,
					 Description: title
				 };
			 } else if(href.match(/^(assets\/.*)$/) || href.match(/^\[file_link\s*(?:\s*|%20|,)?id=([0-9]+)\]?(#.*)?$/)) {
				 return {
					 LinkType: 'file',
					 file: RegExp.$1,
					 Description: title,
					 TargetBlank: target ? true : false
				 };
			 } else if(href.match(/^#(.*)$/)) {
				 return {
					 LinkType: 'anchor',
					 Anchor: RegExp.$1,
					 Description: title,
					 TargetBlank: target ? true : false
				 };
			 } else if(href.match(/^\[sitetree_link(?:\s*|%20|,)?id=([0-9]+)\]?(#.*)?$/i)) {
				 return {
					 LinkType: 'internal',
					 internal: RegExp.$1,
					 Anchor: RegExp.$2 ? RegExp.$2.substr(1) : '',
					 Description: title,
					 TargetBlank: target ? true : false
				 };
			 }
			 
			 /* g4b0 */
			 else if(href.match(/^\[(.+)_link(?:\s*|%20|,)?id=([0-9]+)\]?(#.*)?$/i)) {
				var retVal = {};
				var type = RegExp.$1
				retVal['LinkType'] = RegExp.$1;
				retVal[type] = RegExp.$2;
				retVal['Anchor'] = RegExp.$3 ? RegExp.$3.substr(1) : '';
				retVal['TargetBlank'] = target ? true : false;
				return retVal;
			 }
			 /* /g4b0 */
			 
			 else if(href) {
				 return {
					 LinkType: 'external',
					 external: href,
					 Description: title,
					 TargetBlank: target ? true : false
				 };
			 } else {
				 // No link/invalid link selected.
				 return null;
			 }
		 }
			
		});

	});
})(jQuery);
