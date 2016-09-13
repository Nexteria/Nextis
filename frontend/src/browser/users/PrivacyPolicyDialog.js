import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';

import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  decline: {
    defaultMessage: 'Decline',
    id: 'app.users.privacyPolicy.decline',
  },
  aggree: {
    defaultMessage: 'Agree',
    id: 'app.users.privacyPolicy.aggree',
  },
});

export class PrivacyPolicyDialog extends Component {

  static propTypes = {
  }

  render() {
    const { fields, confirmPrivacyPolicy } = this.props;
    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={() => window.location = '/logout'}
      >
        <Header closeButton>
          <Title>Súhlas so spracúvaním osobných údajov</Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <p>Kliknutím na tlačidlo “Súhlasím” nižšie týmto udeľujem prevádzkovateľovi Manageria, o.z., so sídlom sídlom: Kysucká 5, 811 04 Bratislava, IČO: 42 136 571, zapísaná v registri združení občanov, Ministerstvo vnútra SR: VVS/1-900/90-27783, (ďalej len „Prevádzkovateľ“) súhlas so spracúvaním nasledovných osobných údajov podľa § 11 zákona č. 122/2013 Z.z., o ochrane osobných údajov, v znení neskorších predpisov: titul, meno, priezvisko, email, dátum narodenia, telefónne číslo, číslo účtu, dosiahnute štúdium, aktuálne zamestnanie, odkaz na profil na sociálnych sietiach na účel: evidencia štúdia a plnenia si štúdijných povinností a ďalšia analýza dát; a to na dobu, počas ktorej trvá účel spracúvania mojich osobných údajov.</p>

            <label>Beriem na vedomie a súhlasím s tým, že:</label>
            <ul>
              <li>tento súhlas je udelený dobrovoľne, môžem ho kedykoľvek bezplatne odvolať na office@nexteria.sk alebo písomne na adresu Prevádzkovateľa, avšak v takom prípade nebudem môcť ďalej využívať informačný systém Nexteria Space;</li>
              <li>moje osobné údaje môžu byť poskytnuté, sprístupnené a ďalej spracúvané len na hore uvedený účel aj inými prevádzkovateľmi so sídlom v EÚ/EHP, ktorých zoznam sa môže časom meniť, pričom ich úplný zoznam je prístupný na www.nexteria.sk;</li>
              <li>moje práva sú bližšie upravené v § 28 zákona č. 122/2013 Z.z. o ochrane osobných údajov a môžem ich uplatniť u Prevádzkovateľa na vyššie uvedených kontaktných údajoch;</li>
              <li>bližšie informácie týkajúce sa ochrany osobných údajov nájdem na www.nexteria.sk;</li>
              <li>moje osobné údaje v rozsahu uvedenom vyššie môžu byť poskytnuté Prevádzkovateľovi na vyššie uvedený účel.</li>
            </ul>

            <div className="col-md-12">
              <input type="checkbox" className="col-md-1" {...fields.confirmedMarketingUse} />
              <p className="col-md-11">
                Označením zároveň dávam Prevádzkovateľovi súhlas s tým, aby moje osobné údaje (meno, priezvisko, email, telefónne číslo, dosiahnuté vzdelania) spracúval aj na marketingové účely, t.j. zasielanie marketingových materiálov, newslettrov, informácií o nových produktoch a službách, akciách, zľavách, a pod. a za týmto účelom ma kontaktoval emailom, telefonicky alebo poštou, pričom tento súhlas je platný po dobu trvania účelu spracúvania osobných údajov.
              </p>
            </div>
          </div>
        </Body>

        <Footer>
          <button className="btn btn-danger" onClick={() => window.location = '/logout'}>
            <FormattedMessage {...messages.decline} />
          </button>
          <button className="btn btn-success" onClick={() => confirmPrivacyPolicy(fields)}>
            <FormattedMessage {...messages.aggree} />
          </button>
        </Footer>
      </Modal>
    );
  }
}

PrivacyPolicyDialog = fields(PrivacyPolicyDialog, {
  path: 'privacyPolicyDialog',
  fields: [
    'confirmedMarketingUse',
  ],
});

export default connect(null, actions)(PrivacyPolicyDialog);
