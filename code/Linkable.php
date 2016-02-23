<?php

/**
 * Searchable - interface to implement in order to be a searchable DO
 *
 * @author Gabriele Brosulo <gabriele.brosulo@zirak.it>
 * @creation-date 14-May-2014
 */
interface Linkable
{
    
    /**
     * Link to this DO
     * @return string
     */
    public function Link();
    
    /**
     * Label displayed in "Insert link" menu
     * @return string
     */
    public static function LinkLabel();
    
    /**
     * Replace a "[{$class}_link,id=n]" shortcode with a link to the page with the corresponding ID.
     * @param array  $arguments Arguments to the shortcode
     * @param string $content   Content of the returned link (optional)
     * @param object $parser    Specify a parser to parse the content (see {@link ShortCodeParser})
     * @return string anchor Link to the DO page
     *
     * @return string
     */
    public static function link_shortcode_handler($arguments, $content = null, $parser = null);
}
