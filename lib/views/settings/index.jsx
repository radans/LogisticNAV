const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Buttons>
                <Button href='/settings/user' icon='edit' label='Kasutaja andmed'/>
            </Buttons>
            <h3>Parooli muutmine</h3>
            <Help {...props}>
                Parooli muutmiseks logi välja ning kasuta sisselogimise vormil
                uue parooli tellimise nuppu.
            </Help>
            <h3>Üldised seaded</h3>
            <Help {...props}>
                Logo faili kasutatakse tellimuse dokumendi genereerimisel. Laadimisjuhendid
                saadetakse koos tellimuse e-posti kirjaga. Põhiandmetes on tellimuse dokumendile
                minev Lasita aadress ja muu info.
            </Help>
            <Buttons>
                <Button href='/settings/logo' icon='edit' label='Logo fail'/>
                &nbsp;<Button href='/settings/loading' icon='edit' label='Laadimisjuhendid'/>
                &nbsp;<Button href='/settings/main' icon='edit' label='Põhiandmed'/>
            </Buttons>
        </Layout>
    );
};
