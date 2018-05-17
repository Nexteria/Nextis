<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use GraphQL\Upload\UploadMiddleware;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\DiactorosFactory;

class GraphQLController extends \Rebing\GraphQL\GraphQLController
{
    public function query(Request $request, $schema = null)
    {
        $oldRequest = $request;
        if ($request->has('operations')) {
            // convert to a psr-7 request
            $psr7request = (new DiactorosFactory())->createRequest($request);

            // Process uploaded files
            $uploadMiddleware = new UploadMiddleware();
            $psr7request = $uploadMiddleware->processRequest($psr7request);

            // convert back to a Illuminate\Http\Request
            $httpFoundationFactory = new HttpFoundationFactory();
            $request = $httpFoundationFactory->createRequest($psr7request);
            $request = Request::createFromBase($request);
            $request->setRouteResolver(function () use ($oldRequest) {
                return $oldRequest->route();
            });
        }
        
        return parent::query($request, $schema);
    }
}
