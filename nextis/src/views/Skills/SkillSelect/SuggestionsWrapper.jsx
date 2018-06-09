import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';

import Suggestion from './Suggestion';
import { isValidSkillName, toValidSkillName } from 'views/Skills/utils';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: '100%',
    maxHeight: '250px',
    overflowY: 'auto',
    zIndex: '999'
  }
});

const getSuggestions = (inputValue, itemList, allItems, isAdding) => {
  const suggs = itemList.filter(
    item =>
      !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const adding = { name: toValidSkillName(inputValue), id: -47 };

  const showAdding =
    isAdding &&
    isValidSkillName(inputValue) &&
    !allItems.some(
      item => item.name.toLowerCase() === inputValue.toLowerCase()
    );

  return showAdding ? suggs.concat([adding]) : suggs;
};

const SuggestionsWrapper = ({
  classes,
  inputValue,
  allItems,
  availableItems,
  getItemProps,
  highlightedIndex,
  isAdding
}) => (
  <Paper className={classes.paper}>
    {getSuggestions(inputValue, availableItems, allItems, isAdding).map(
      (item, index) => (
        <Suggestion
          key={item.name}
          item={item}
          index={index}
          itemProps={getItemProps({ item })}
          highlightedIndex={highlightedIndex}
        />
      )
    )}
  </Paper>
);

export default withStyles(styles)(SuggestionsWrapper);
