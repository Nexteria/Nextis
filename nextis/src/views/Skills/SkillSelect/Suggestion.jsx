import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/AddCircleOutline';

const Suggestion = ({ item, index, itemProps, highlightedIndex }) => {
  const isHighlighted = highlightedIndex === index;
  const isAddingItem = item.id === -47;

  return (
    <MenuItem
      {...itemProps}
      key={item.id}
      selected={isHighlighted}
      style={isAddingItem ? { color: 'green' } : {}}
    >
      {isAddingItem && [
        <AddIcon key="icon" color="secondary" style={{ margin: '5px' }} />,
        <span key="label" style={{ marginRight: '5px' }}>Add new skill: </span>
      ]}
      <span>{item.name}</span>
    </MenuItem>
  );
};

export default Suggestion;
