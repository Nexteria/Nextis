<?php

namespace App\GraphQL\Mutations;

use GraphQL;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use App\Skill;

class CreateSkillMutation extends Mutation
{

    protected $attributes = [
        'name' => 'CreateSkill'
    ];
    
    public function type()
    {
        return GraphQL::type('skill');
    }
    
    public function args()
    {
        return [
            'name' => [
                'name' => 'name',
                'type' => Type::nonNull(Type::string()),
                'rules' => ['required'],
            ],
        ];
    }
    
    public function resolve($root, $args)
    {
        $skill = new Skill;
        $skill->name = $args['name'];

        $skill->save();
        
        return $skill;
    }

}