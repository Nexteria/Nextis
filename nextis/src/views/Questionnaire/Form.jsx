import React from 'react';
import Spinner from 'react-spinkit';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'common/store';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { withStyles } from 'material-ui';

import Question from 'views/Questionnaire/Question';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';


import buttonsStyles from 'assets/jss/material-dashboard-pro-react/views/buttonsStyle';

export class Form extends React.Component {
  constructor(props) {
    super(props);

    this.isFormValid = this.isFormValid.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);

    this.state = {
      answers: {},
    };
  }

  isFormValid() {
    const { data } = this.props;
    if (!data || data.loading) {
      return false;
    }

    const { event } = data;
    const { form } = event;

    const { answers } = this.state;

    const isFormValid = form.questions.filter(question => question.required)
      .every((question) => {
        let isValid = true && Object.prototype.hasOwnProperty.call(answers, question.id);

        if (question.type === 'shortText' || (question.type === 'longText' && question.minSelection)) {
          isValid = isValid && (answers[question.id].length >= question.minSelection);
        }

        if (question.type === 'multichoice') {
          isValid = isValid && (Object.keys(answers[question.id]).length >= question.minSelection);
        }

        return isValid;
      });

    return isFormValid;
  }

  async handleFormSubmission() {
    const { data, submitQuestionaire, history } = this.props;
    const formId = data.event.form.id;
    const { answers } = this.state;

    const formAnswers = Object.keys(answers).map(questionId => ({
      questionId,
      answer: answers[questionId] !== null && typeof answers[questionId] === 'object' ? Object.keys(answers[questionId]) : [answers[questionId]],
    }));

    await submitQuestionaire({ variables: { formId, answers: formAnswers } });
    await data.refetch();
    history.push(`/events/${data.event.id}/signin`);
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { event } = data;
    const { form } = event;

    const description = form.descriptions && form.descriptions.length ? form.descriptions[0] : form.description;
    const { answers } = this.state;

    // TODO: filter questions

    return (
      <div>
        <div className="col-md-12" style={{ marginBottom: '3em' }}>
          <h1>
            {form.name}
          </h1>
          {description ? description.split('\n').map(descriptionPart => (
            <p style={{ fontSize: '1.2em' }}>
              <i>
                {descriptionPart}
              </i>
            </p>
          )) : null}
        </div>

        {[...form.questions].sort((a, b) => a.order - b.order)
          .map((question, index) => (
            <ItemGrid xs={12} key={question.id}>
              <Question
                question={question}
                index={index}
                answer={answers[question.id]}
                onChange={(questionData) => {
                  this.setState({
                    answers: {
                      ...answers,
                      [question.id]: questionData
                    }
                  });
                }}
              />
            </ItemGrid>
          ))
        }

        <ItemGrid xs={12}>
          {!this.isFormValid()
            ? (
              <div className={classes.requiredWarning}>
                Prosím vyplň všetky povinné otázky
              </div>
            )
            : null
          }

          <Button
            color="success"
            size="sm"
            customClass={classes.marginRight}
            disabled={!this.isFormValid()}
            onClick={this.handleFormSubmission}
          >
            Odoslať
          </Button>
        </ItemGrid>
      </div>
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
    form {
      id
      name
      answeredByUser (userId: $userId)
      description
      descriptions (userId: $userId) {
        id
        description
      }
      questions {
        id
        question
        type
        required
        order
        minSelection
        maxSelection
        dependencies {
          id
        }
        choices {
          id
          title
          order
        }
      }
    }
  }
}
`;

const submitQuestionaire = gql`
    mutation SubmitQuestionaire(
    $formId: String!
    $answers: [QuestionAnswer]
  ) {
    SubmitQuestionaire(
      formId: $formId
      answers: $answers
    )
  }
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user, student: state.student })),
  graphql(submitQuestionaire, { name: 'submitQuestionaire' }),
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
  withStyles(buttonsStyles),
)(Form);
