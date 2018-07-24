
const eventDetailsStyle = {
  label: {
    color: '#000',
  },
  placeholderText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  activityPointsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '2em',
  },
  eventName: {
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: '1em',
  },
  avatarContainer: {
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: 'auto',
    marginBottom: '0.5em',
  },
  img: {
    width: "100%",
    height: '100%',
    verticalAlign: "middle",
    border: "0",
    borderRadius: '50px',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.8)',
  },
  lectorContainer: {
    textAlign: 'center',
  },
  section: {
    marginBottom: '1em',
  },
  overviewContainer: {
    marginBottom: '3em',
    "& > div": {
      display: "flex",
      alignItems: "center",
      "& > svg": {
        marginRight: "0.5em",
      },
    },
  },
  termsCard: {
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.5)",
    marginTop: 0,
  },
  sectionTitleBadge: {
    display: "inline-flex",
    alignItems: "center",
    "& > svg": {
      fontSize: "12px",
      marginRight: '5px',
    },
  }
};

export default eventDetailsStyle;