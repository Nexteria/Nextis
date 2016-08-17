<?php namespace App\React;

use Collective\Html\HtmlFacade as HTML;
use Illuminate\Support\Facades\App as App;

class React
{

    /**
     * Generate a link to a React JavaScript file.
     *
     * @param  string  $url
     * @param  array   $attributes
     * @param  bool    $secure
     * @return string
     */
    public static function script($module_name, $attributes = array(), $secure = null)
    {
        if (App::environment('local')) {
            $url = env('HOT_LOAD_SERVER')."/build/".$module_name.'.js';
            $attributes['src'] = $url;
        } else {
            $contents = file_get_contents(base_path().'/public/build/file_hash.json');
            $contents = utf8_encode($contents);
            $hashes = json_decode($contents);

            $name = is_array($hashes->{$module_name}) ? $hashes->{$module_name}[0] : $hashes->{$module_name};
            return HTML::script('/build/'.$name);
        }

        return '<script'.HTML::attributes($attributes).'></script>'.PHP_EOL;
    }

    /**
     * Generate a link to a React CSS file.
     *
     * @param  string  $url
     * @param  array   $attributes
     * @param  bool    $secure
     * @return string
     */
    public static function style($module_name, $attributes = array(), $secure = null)
    {
        $defaults = array('media' => 'all', 'type' => 'text/css', 'rel' => 'stylesheet');

        $attributes = $attributes + $defaults;

        if (App::environment('local')) {
            return '';
        } else {
            $contents = file_get_contents(public_path().'/build/file_hash.json');
            $contents = utf8_encode($contents);
            $hashes = json_decode($contents);

            $name = is_array($hashes->{$module_name}) ? $hashes->{$module_name}[1] : $hashes->{$module_name};
            return HTML::style('/build/'.$name);
        }

        return '<link'.HTML::attributes($attributes).'>'.PHP_EOL;
    }
}
