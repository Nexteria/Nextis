
const contactsStyle = {
  actionButton: {
    margin: '5px 0 0 5px',
    padding: '5px',
  },
  center: {
    textAlign: 'center',
  },
  contactsTable: {
    width: '100%',
    top: '1em',
    '& .-header': {
      height: '2em',
    },
    '& .rt-td': {
      whiteSpace: 'normal',
    },
  },
  searchInput: {
    '& input': {
      paddingLeft: '2em !important',
    },
  },
  underline: {
    '&:before': {
      backgroundColor: '#fff',
      height: '1px !important'
    },
    '&:after': {
      backgroundColor: '#ff9920',
      transition: '0.3s ease all'
    }
  },
  inputAdornmentIcon: {
    position: 'absolute',
    left: 0,
    bottom: '0.5em',
    color: '#ccc',
  }
};

export default contactsStyle;
