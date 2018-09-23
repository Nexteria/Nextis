import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import SkillView from 'views/Skills/components/SkillView';
import SuggestionsWrapper from './SuggestionsWrapper';

const styles = theme => ({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: '35px'
  },
  input: {
    display: 'block',
    paddingLeft: '2px'
  }
});

const SkillSelect = ({
  classes,
  allItems,
  availableItems,
  onRemoveItem,
  isAdding,
  ...rest
}) => {
  const noSkillsToAdd = !isAdding && availableItems.length === 0;
  return (
    <div className={classes.container}>
      <Downshift itemToString={item => ''} {...rest}>
        {({
          getInputProps,
          getItemProps,
          inputValue,
          selectedItem,
          highlightedIndex,
          toggleMenu,
          isOpen
        }) => (
          <div>
            <SkillView skills={selectedItem} onRemoveItem={onRemoveItem} />

            <TextField
              fullWidth
              label={noSkillsToAdd ? 'No skills to add' : 'Add a skill'}
              disabled={noSkillsToAdd}
              InputProps={{
                classes: {
                  input: classes.input
                },
                ...getInputProps({
                  onClick: toggleMenu
                })
              }}
            />

            {isOpen && (
              <SuggestionsWrapper
                inputValue={inputValue}
                allItems={allItems}
                availableItems={availableItems}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                isAdding={isAdding}
              />
            )}
          </div>
        )}
      </Downshift>
    </div>
  );
};

export default withStyles(styles)(SkillSelect);
