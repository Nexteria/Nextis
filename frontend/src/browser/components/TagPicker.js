import React from 'react';
import './TagPicker.scss';
import { WithContext as ReactTags } from 'react-tag-input';

export default function renderTagPicker(data) {
  const {
    input,
    label,
    contentCol,
    labelCol,
    suggestionsMapFunc,
    maxTags,
    tagsData,
    meta: { touched, error }
  } = data;

  const contentColumn = contentCol || 12;
  const labelColumn = labelCol || 12;

  const disableAddition = maxTags && maxTags === input.value.size;

  return (
    <div className={`form-group ${disableAddition ? 'disabled-tag-addition' : null} ${touched && error ? 'has-error' : ''}`}>
      <label className={`col-sm-${labelColumn} control-label`}>
        {label}
      </label>

      <div className={`col-sm-${contentColumn}`}>
        <ReactTags
          id={input.name}
          placeholder={label}
          handleFilterSuggestions={(value, possibleSuggestions) =>
            possibleSuggestions.filter(suggestion =>
              suggestion.toLowerCase().includes(value.toLowerCase())
            )
          }
          tags={input.value.map(val => ({ id: val.get('id'), text: suggestionsMapFunc(val) })).toArray()}
          suggestions={tagsData.map(suggestionsMapFunc).toArray()}
          handleDelete={i =>
            input.onChange(input.value.delete(input.value.toList().get(i).get('id')))
          }
          handleAddition={tag => {
            const newTag = tagsData.find(tagData => suggestionsMapFunc(tagData) === tag);
            if (input.handleAddition) {
              input.handleAddition(newTag);
            } else {
              input.onChange(input.value.set(newTag.get('id'), newTag));
            }
          }}
        />
        <div className="has-error col-md-12" style={{ paddingLeft: '0px' }}>
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    </div>
  );
}
