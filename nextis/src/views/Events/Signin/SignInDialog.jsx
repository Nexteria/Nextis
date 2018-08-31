import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import Slide from 'material-ui/transitions/Slide';
import Checkbox from 'material-ui/Checkbox';

import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';
import RegularCard from 'components/Cards/RegularCard';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';

import { eventSignAction } from 'views/Events/Signin/Queries';
import { meetingsQuery } from 'views/Events/Queries';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function formatLocation(location) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {location.name}
    </a>
  );
}

function getTerms(rootTermId, parentTerms) {
  const terms = [];
  if (parentTerms[rootTermId]) {
    terms.push(parentTerms[rootTermId]);
    terms.concat(getTerms(parentTerms[rootTermId].id, parentTerms));
  }

  return terms;
}

export class SignInDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      choosedTermId: null,
    };

    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.chooseTerm = this.chooseTerm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    // if the sign in form needs to be filled out
    if (!data.loading && data.event.form && !data.event.form.answeredByUser) {
      nextProps.history.push(`/events/${data.event.id}/signInForm`);
    }
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/events');
    }
  }

  chooseTerm(termId) {
    this.setState({ choosedTermId: termId });
  }

  async handleSignIn(hasAlternatives) {
    const {
      signAction,
      student,
      data,
      history,
      refetchMeetings,
      user,
      actions,
    } = this.props;

    const { choosedTermId } = this.state;

    // TODO: fix this asap
    const terms = [];
    if (hasAlternatives) {
      terms.push(choosedTermId);
    } else {
      terms.push(data.event.terms[0].id);
    }

    const response = await signAction({
      variables: {
        studentId: student.id,
        eventId: data.event.id,
        action: 'SIGN_IN',
        terms,
        reason: '',
      }
    });

    if (!response.data.error) {
      await refetchMeetings.refetch({
        id: student.id,
        userId: user.id
      });
      await data.refetch();
      history.push('/events');
      actions.setNotification({
        id: 'eventSignIn',
        place: 'tr',
        color: 'success',
        message: 'Prihlásenie prebehlo úspešne'
      });
    }
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return null;
    }

    // TODO: create event class
    const parentTerms = {};
    const rootTerms = [];
    [...data.event.terms].forEach((term) => {
      if (term.parentTermId) {
        parentTerms[term.parentTermId] = term;
      } else {
        rootTerms.push(term);
      }
    });

    const hasAlternatives = rootTerms.length > 1;

    const { choosedTermId } = this.state;

    return (
      <Dialog
        open
        transition={Transition}
        fullWidth
        onClose={this.handleOnClose}
      >
        <DialogTitle
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            customClass={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={this.handleOnClose}
          >
            <Close className={classes.modalClose} />
          </IconButton>

          <h2 className={classes.modalTitle}>
            {data.event.name}
          </h2>
        </DialogTitle>
        <DialogContent id="event-signin-dialog">
          {hasAlternatives ? rootTerms.map((rootTerm, alternativeIndex) => (
            <div key={rootTerm.id}>
              <b>
                {`${alternativeIndex + 1}. možnosť`}
              </b>
              <RegularCard
                customCardClasses={classes.termOption}
                onClick={() => this.chooseTerm(rootTerm.id)}
                content={(
                  <div className={classes.termOptionInnerWrapper}>
                    <div className={classes.checkboxAndRadio}>
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.chooseTerm(rootTerm.id)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                        checked={choosedTermId === rootTerm.id}
                      />
                    </div>

                    <ol>
                      <li>
                        <span>
                          {`${format(parse(rootTerm.eventStartDateTime), 'DD.MM.YYYY o HH:mm')}, `}
                        </span>
                        <span>
                          {formatLocation(rootTerm.location)}
                        </span>
                      </li>
                      {getTerms(rootTerm.id, parentTerms).map(term => (
                        <li key={term.id}>
                          <span>
                            {`${format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm')}, `}
                          </span>
                          <span>
                            {formatLocation(term.location)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              />
            </div>
          )) : null}

          <ItemGrid xs={12} style={{ textAlign: 'center' }}>
            <Button
              color="success"
              size="sm"
              customClass={classes.marginRight}
              onClick={() => this.handleSignIn(hasAlternatives)}
              disabled={hasAlternatives && choosedTermId === null}
            >
              Záväzne sa prihlásiť
            </Button>
          </ItemGrid>
        </DialogContent>
      </Dialog>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int, $userId: Int){
  event (id: $id){
    id
    name
    parentEvent {
      id
      name
    }
    groupedEvents {
      id
    }
    terms {
      id
      eventStartDateTime
      parentTermId
      location {
        id
        latitude
        longitude
        name
      }
    }
    form {
      id
      answeredByUser (userId: $userId)
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(eventDetailsStyle),
  graphql(eventSignAction, { name: 'signAction' }),
  graphql(meetingsQuery, {
    name: 'refetchMeetings',
    options: (props) => {
      const { student, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: student.id,
          userId: user.id,
        }
      };
    }
  }),
  graphql(eventQuery, {
    options: (props) => {
      const { match, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: match.params.eventId,
          userId: user.id,
        }
      };
    },
  }),
  withRouter,
)(SignInDialog);
