import React from 'react';
import TextField from 'material-ui/TextField';

export default function renderTextQuestion(data) {
  const { question, onChange } = data;

  return (
    <div>
      <TextField
        name={`question-answer-${question.get('id')}`}
        value={question.get('answer')}
        onChange={(e, v) => onChange(question.set('answer', v))}
        multiLine={question.get('type') === 'longText'}
        floatingLabelText="Odpoveď"
        rows={question.get('type') === 'longText' ? 3 : 1}
        fullWidth
        textareaStyle={{ border: '1px solid #ccc' }}
      />
    </div>
  );
}
