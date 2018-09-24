import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from '@material-ui/core/styles/withStyles';
import Spinner from 'react-spinkit';
import { connect } from 'common/store';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';
import RegularCard from 'components/Cards/RegularCard';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';

import { eventSignAction, meetingsQuery } from 'views/Events/Signin/Queries';

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
      loading: false,
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
      data,
      history,
      refetchMeetings,
      user,
      actions,
    } = this.props;

    const { choosedTermId } = this.state;
    this.setState({ loading: true });

    // TODO: fix this asap
    const terms = [];
    if (hasAlternatives) {
      terms.push(choosedTermId);
    } else {
      terms.push(data.event.terms[0].id);
    }

    try {
      await signAction({
        variables: {
          userId: user.id,
          eventId: data.event.id,
          action: 'SIGN_IN',
          terms,
          reason: '',
        }
      });

      await refetchMeetings.refetch({
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
    } catch (error) {
      actions.setNotification({
        id: 'eventSignIn',
        place: 'tr',
        color: 'danger',
        message: error.graphQLErrors[0].message
      });
      history.push('/events');
    }

    this.setState({ loading: false });
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return null;
    }

    const event = data.event;

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
    const hasEventChoices = event.groupedEvents.length || (event.parentEvent && event.parentEvent.id);
    const isBaseEvent = event.groupedEvents.length && !event.parentEvent;

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
                customCardClasses={classes.termOption + " " + `${rootTerm.canNotSignInReason ? classes.disabledCard : ''}`}
                onClick={() => !rootTerm.canNotSignInReason ? this.chooseTerm(rootTerm.id) : null}
                content={(
                  <div className={classes.termOptionInnerWrapper}>
                    <div className={classes.checkboxAndRadio}>
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => !rootTerm.canNotSignInReason ? this.chooseTerm(rootTerm.id) : null}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                        disabled={rootTerm.canNotSignInReason}
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

                    <div>
                      {rootTerm.canNotSignInReason === 'term_max_capacity_reached' ?
                        <div>Kapacita tohto termínu je už naplnená</div>
                        : null
                      }
                    </div>
                  </div>
                )}
              />
            </div>
          )) : null}

          {hasEventChoices && event.parentEvent && event.parentEvent.exclusionaryEvents ?
            <ItemGrid xs={12} sm={12} md={12} lg={12}>
              <span className={classes.red}>Prihasením na tento event, stratíš možnosť prihlásiť sa na:</span>
              <ul>
                {event.parentEvent.exclusionaryEvents.filter(exclusionaryEvent => exclusionaryEvent.id !== event.id)
                  .map((exclusionaryEvent, index) =>
                  <li key={index}>{exclusionaryEvent.name}</li>
                )}
               </ul>
            </ItemGrid>
            : null
          }

          <ItemGrid xs={12} style={{ textAlign: 'center' }}>
            {!isBaseEvent ?
              <Button
                color="success"
                size="sm"
                customClass={classes.marginRight}
                onClick={() => this.handleSignIn(hasAlternatives)}
                disabled={hasAlternatives && choosedTermId === null}
              >
              {this.state.loading === true ? (
                  <Spinner
                    name="line-scale-pulse-out"
                    fadeIn="none"
                    className={classes.buttonSpinner}
                    color="#fff"
                  />
                ) : (
                  'Záväzne sa prihlásiť'
                )
              }
              </Button>
            : <div>
              <p>Prosím prihlás sa na na jeden  z eventov:</p>
              {hasEventChoices && event.exclusionaryEvents ?
                <ItemGrid xs={12} sm={12} md={12} lg={12}>
                  <ul>
                    {event.exclusionaryEvents.filter(exclusionaryEvent => exclusionaryEvent.id !== event.id)
                      .map((exclusionaryEvent, index) =>
                      <li key={index}>{exclusionaryEvent.name}</li>
                    )}
                  </ul>
                </ItemGrid>
                : null
              }
              </div>
            }
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
      exclusionaryEvents {
        id
        name
      }
    }
    exclusionaryEvents {
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
      canNotSignInReason (userId: $userId)
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
  connect(state => ({ user: state.user })),
  withStyles(eventDetailsStyle),
  graphql(eventSignAction, { name: 'signAction' }),
  graphql(meetingsQuery, {
    name: 'refetchMeetings',
    options: (props) => {
      const { user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
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
