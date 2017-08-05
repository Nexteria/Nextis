<?php namespace App\Transformers;


class CommentsTransformer extends Transformer
{

    public function transform($comment)
    {
        return [
            'id' => (int) $comment->id,
            'body' => $comment->body,
            'commentableId' => (int) $comment->commentable_id,
            'commentableType' => $comment->commentable_type,
            'creatorId' => (int) $comment->creator_id,
            'creatorType' => $comment->creator_type,
            'updatedAt' => $comment->updated_at->toDateTimeString(),
            'createdAt' => $comment->created_at->toDateTimeString(),
            'parentId' => (int) $comment->parent_id,
            'title' =>  $comment->title,
         ];
    }
}
