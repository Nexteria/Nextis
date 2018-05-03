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
            $url = env('HOT_LOAD_SERVER')."/static/js/bundle.js";
            $attributes['src'] = $url;
        } else {
            $contents = file_get_contents(base_path().'/public/asset-manifest.json');
            $contents = utf8_encode($contents);
            $hashes = json_decode($contents);

            $name = $hashes->{$module_name.'.js'};
            return HTML::script('/'.$name);
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
            $contents = file_get_contents(base_path().'/public/asset-manifest.json');
            $contents = utf8_encode($contents);
            $hashes = json_decode($contents);

            $name = $hashes->{$module_name.'.css'};
            return HTML::style('/'.$name);
        }

        return '<link'.HTML::attributes($attributes).'>'.PHP_EOL;
    }
}
