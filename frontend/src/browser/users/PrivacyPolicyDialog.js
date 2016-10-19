/* eslint-disable max-len */
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';


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
    confirmPrivacyPolicy: PropTypes.func.isRequired,
  }

  render() {
    const { confirmPrivacyPolicy } = this.props;
    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={() => { window.location = '/logout'; }}
      >
        <Header closeButton>
          <Title>Súhlas so spracúvaním osobných údajov</Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <p>Kliknutím na tlačidlo “Súhlasím” nižšie týmto udeľujem v zmysle § 11 Zákona č. 122/2013 Z. z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov súhlas so spracúvaním svojich osobných údajov pre občianske združenie Manageria o.z., Kysucká 5, 811 04 Bratislava, Slovenská republika, IČO: 421 365 71, (ďalej len „Prevádzkovateľ“). </p>
            <p>Údaje budú spracované v informačnom systéme Prevádzkovateľa a sú poskytnuté pre účely ich interného využitia v rámci občianskeho združenia Manageria za účelom vytvárania databázy členov programu Nexteria Leadership Academy a priebehu vzdelávania, ako aj komunikácie a spolupráce s členmi programu Nexteria Leadership Academy.</p>
            <p>Rozsah osobných údajov: titul, meno a priezvisko, dátum narodenia, trvalé bydlisko, kontaktné údaje (telefónne číslo, e-mail), číslo občianskeho preukazu, číslo bankového účtu, údaje o škole, údaje o pracovných skúsenostiach, údaje o priebehu vzdelávania v rámci programu Nexteria Leadership Academy. Údaje v rozsahu meno, priezvisko, údaje o škole a pracovných skúsenostiach môžu byť poskytnuté, sprístupnené a ďalej spracúvané lektormi a partnermi programu Nexteria Leadership Academy za účelom prípravy a realizácie vzdelávacích aktivít a prípadnej ďalšej spolupráce s lektormi alebo partnerskými organizáciami programu Nexteria Leadership Academy.</p>
            <p>Tento súhlas je udelený na dobu nevyhnutnú pre dosiahnutie účelu spracovania a je ho možné kedykoľvek písomne odvolať. Všetky moje práva sú zadefinované v <a href="https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2013/122/20140415#paragraf-28" target="_blank">§ 28 ods. 1. zákona č. 122/2013 Z. z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov.</a></p>
          </div>
        </Body>

        <Footer>
          <button className="btn btn-danger" onClick={() => { window.location = '/logout'; }}>
            <FormattedMessage {...messages.decline} />
          </button>
          <button className="btn btn-success" onClick={confirmPrivacyPolicy}>
            <FormattedMessage {...messages.aggree} />
          </button>
        </Footer>
      </Modal>
    );
  }
}

export default connect(() => ({}), actions)(PrivacyPolicyDialog);
