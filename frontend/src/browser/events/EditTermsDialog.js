import { Map } from 'immutable';
import uuidv4 from 'uuid';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Modal, { Header, Title, Body } from 'react-bootstrap/lib/Modal';
import Popover from 'react-bootstrap/lib/Popover';
import { FormattedTime, FormattedDate } from 'react-intl';

import InputComponent from '../components/Input';
import SelectComponent from '../components/Select';
import DatePickerComponent from '../components/DatePicker';
import TagsComponent from '../components/TagPicker';

export function renderTermPopover(term, users, locations) {
  const host = users.find(u => u.get('id') === term.get('hostId'));
  const location = locations.find(l => l.get('id') === term.get('nxLocationId'));

  return (
    <Popover id="popover-positioned-top" title="Termín">
      <div><strong>Od: </strong>
        <span> </span>
        <FormattedDate value={term.get('eventStartDateTime')} />
        <span> o </span>
        <FormattedTime value={term.get('eventStartDateTime')} />
      </div>
      <div><strong>Od: </strong>
        <span> </span>
        <FormattedDate value={term.get('eventEndDateTime')} />
        <span> o </span>
        <FormattedTime value={term.get('eventEndDateTime')} />
      </div>
      <div><strong>Min. kapacita:</strong> {term.get('minCapacity')}</div>
      <div><strong>Max. kapacita:</strong> {term.get('maxCapacity')}</div>
      <div><strong>Host:</strong> {host ? `${host.get('firstName')} ${host.get('lastName')}` : '-'}</div>
      <div><strong>Miesto:</strong> {location.name}</div>
    </Popover>
  );
}

export default class EditTermsDialog extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    terms: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    checkFeedbackFormLink: PropTypes.func.isRequired,
  }

  validateNewTerm(data, onChange) {
    let newTerm = data.get('newTerm');
    const newId = newTerm.get('id') || uuidv4();

    if (!newTerm.has('terms')) {
      newTerm = newTerm.set('terms', new Map());
    }

    const parentTermId = newTerm.get('parentTermId');
    const isOldStream = data.hasIn(['streams', newTerm.get('id')]);

    let oldParentStreamId = null;
    data.get('streams').forEach(stream => {
      if (stream.hasIn(['terms', newTerm.get('id')])) {
        oldParentStreamId = stream.get('id');
      }
    });

    if (isOldStream && parentTermId) {
      newTerm = newTerm.set('terms', new Map());
    }

    let newData = data;
    if (oldParentStreamId) {
      newData = newData.deleteIn(['streams', oldParentStreamId, 'terms', newTerm.get('id')]);
    }

    if (!data.hasIn(['streams', parentTermId])) {
      onChange(
        newData.setIn(['streams', newId], newTerm.set('id', newId))
            .set('newTerm', null)
      );
    } else {
      onChange(
        newData.setIn(['streams', parentTermId, 'terms', newId], newTerm.set('id', newId))
            .set('newTerm', null)
      );
    }
  }

  render() {
    const {
      onChange,
      open,
      closeDialog,
      terms,
      users,
      locations,
      checkFeedbackFormLink,
    } = this.props;

    let maxTerms = terms.get('streams').size > 0 ? 1 : 0;
    terms.get('streams').forEach(stream => {
      maxTerms = Math.max(maxTerms, stream.get('terms').size);
    });

    return (
      <Modal
        show={open}
        dialogClassName="event-terms-modal"
        onHide={closeDialog}
      >
        <Header closeButton>
          <Title>Termíny</Title>
        </Header>

        <Body>
          <table className="table table-hover">
            <thead>
              <tr>
              {terms.get('streams').valueSeq().map((v, index) =>
                <th style={{ textAlign: 'center' }}>Termín #{index + 1}</th>
              )}
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              <tr>
                {terms.get('streams').map(stream =>
                  <td>
                    <span
                      className="label label-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onChange(terms.set('newTerm', stream))}
                    >
                      <FormattedDate value={stream.get('eventStartDateTime')} />
                      <span> o </span>
                      <FormattedTime value={stream.get('eventStartDateTime')} />
                    </span>
                    <span
                      className="label label-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const resultStreams = terms.get('streams');
                        if (stream.get('terms').size < 1) {
                          return onChange(terms.set('streams', resultStreams.delete(stream.get('id'))));
                        }

                        const firstTerm = stream.get('terms').first();
                        return onChange(terms.set('streams', resultStreams.set(
                          firstTerm.get('id'),
                          firstTerm.set('terms', stream.get('terms').delete(firstTerm.get('id')))
                        ).delete(stream.get('id'))));
                      }}
                    >x</span>
                  </td>
                )}
              </tr>
              {[...Array(maxTerms + 1)].map((v, index) =>
                <tr>
                  {terms.get('streams').map(stream => {
                    const term = stream.get('terms').toList().get(index);
                    return (
                      <td>
                        {stream.get('terms').size === index &&
                          <i
                            className="fa fa-plus text-green"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onChange(terms.set('newTerm', new Map({
                              parentTermId: stream.get('id'),
                              minCapacity: stream.get('minCapacity'),
                              maxCapacity: stream.get('maxCapacity'),
                              nxLocationId: stream.get('nxLocationId'),
                              hostId: stream.get('hostId'),
                            })))}
                          ></i>
                        }

                        {stream.get('terms').size > index &&
                          <span>
                            <span
                              className="label label-success"
                              style={{ cursor: 'pointer' }}
                              onClick={() => onChange(terms.set('newTerm', term))}
                            >
                              <FormattedDate value={term.get('eventStartDateTime')} />
                              <span> o </span>
                              <FormattedTime value={term.get('eventStartDateTime')} />
                            </span>
                            <span
                              className="label label-danger"
                              style={{ cursor: 'pointer' }}
                              onClick={() => onChange(
                                terms.deleteIn(['streams', stream.get('id'), 'terms', term.get('id')])
                              )}
                            >x</span>
                          </span>
                        }
                        {stream.get('terms').size < index && <span>&nbsp;</span>}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
          {!terms.get('newTerm') &&
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn btn-info"
                type="button"
                onClick={() => onChange(terms.set('newTerm', new Map()))}
              >
              Pridať ďalšiu možnosť
              </button>
              <button
                className="btn btn-success"
                style={{ marginLeft: '1em' }}
                type="button"
                onClick={closeDialog}
              >
              Uložiť
              </button>
            </div>
          }
          {terms.get('newTerm') &&
            <div>
              <div className="col-md-6">
                <InputComponent
                  label="Min. kapacita:"
                  input={{
                    value: terms.getIn(['newTerm', 'minCapacity']),
                    onChange: e => onChange(terms.setIn(['newTerm', 'minCapacity'], e.target.value)),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                  type="number"
                />
              </div>
              <div className="col-md-6">
                <InputComponent
                  label="Max. kapacita:"
                  input={{
                    value: terms.getIn(['newTerm', 'maxCapacity']),
                    onChange: e => onChange(terms.setIn(['newTerm', 'maxCapacity'], e.target.value)),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: true }}
                  type="number"
                />
              </div>
              <div className="col-md-6">
                <DatePickerComponent
                  label="Začiatok:"
                  input={{
                    value: terms.getIn(['newTerm', 'eventStartDateTime']),
                    onChange: value => onChange(terms.setIn(['newTerm', 'eventStartDateTime'], value)),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                />
              </div>
              <div className="col-md-6">
                <DatePickerComponent
                  label="Koniec:"
                  input={{
                    value: terms.getIn(['newTerm', 'eventEndDateTime']),
                    onChange: value => onChange(terms.setIn(['newTerm', 'eventEndDateTime'], value)),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                />
              </div>
              <div className="col-md-6">
                <SelectComponent
                  label="Miesto konania"
                  input={{
                    value: terms.getIn(['newTerm', 'nxLocationId']),
                    onChange: e => onChange(terms.setIn(['newTerm', 'nxLocationId'], parseInt(e.target.value, 10))),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                >
                  <option readOnly>Zvoľte miesto konania</option>
                  {locations.valueSeq().map(location =>
                    <option key={location.id} value={location.id}>
                    {`${location.name} (${location.addressLine1}`}
                    {`${location.addressLine2 ? `, ${location.addressLine2}` : ''}`}
                    {`, ${location.city}, ${location.zipCode}, ${location.countryCode})`}
                    </option>
                  )}
                </SelectComponent>
              </div>
              <div className="col-md-6">
                <SelectComponent
                  label="Nadradený termín"
                  input={{
                    value: terms.getIn(['newTerm', 'parentTermId']),
                    onChange: e => onChange(terms.setIn(['newTerm', 'parentTermId'], parseInt(e.target.value, 10))),
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                >
                  <option value="">Žiadny - nová možnosť</option>
                  {terms.get('streams').valueSeq().map((v, index) =>
                    <option key={index} value={v.get('id')}>
                    Termín #{index + 1}
                    </option>
                  )}
                </SelectComponent>
              </div>
              <div className="col-md-12">
                <InputComponent
                  label="Editorský odkaz na feedback"
                  input={{
                    value: terms.getIn(['newTerm', 'feedbackLink']) || '',
                    onChange: e => onChange(terms.setIn(['newTerm', 'feedbackLink'], e.target.value)),
                    onBlur: (e) => {
                      checkFeedbackFormLink(e.target.value).then(
                      resp => {
                        onChange(terms.setIn(['newTerm', 'publicFeedbackLink'], resp.action.payload));
                      },
                      () => {
                        onChange(terms.setIn(['newTerm', 'publicFeedbackLink'], null));
                        onChange(terms.setIn(['newTerm', 'feedbackLink'], null));
                      });
                    },
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                  type="text"
                />
              </div>
              <div className="col-md-12">
                <TagsComponent
                  label="Host:"
                  suggestionsMapFunc={user => `${user.firstName} ${user.lastName} (${user.username})`}
                  tagsData={users}
                  maxTags={1}
                  input={{
                    value: terms.hasIn(['newTerm', 'hostId']) ?
                      users.filter(user => user.get('id') === terms.getIn(['newTerm', 'hostId']))
                      : new Map(),
                    onChange: value =>
                      onChange(terms.setIn(['newTerm', 'hostId'], value.first() ? value.first().get('id') : null))
                    ,
                  }}
                  meta={{ asyncValidating: false, touched: false, error: false }}
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => onChange(terms.set('newTerm', null))}
                  className="btn btn-danger"
                  style={{ marginRight: '1em' }}
                >Zrušiť</button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => this.validateNewTerm(terms, onChange)}
                >Pridať/Upraviť</button>
              </div>
            </div>
          }
          <div className="clearfix"></div>
        </Body>
      </Modal>
    );
  }
}
