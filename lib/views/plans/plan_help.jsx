const Help = require('../common/help.jsx');

module.exports = (props) => {
    return (
        <Help {...props}>
            JUHEND: sisesta töölehe andmed ja sõiduki mõõdud. Seejärel
            lisa pakid nimekirja. Enne pakkide paigutamist vaata, et prindi
            vaates mahuks tabel + koorma plaan lehele ära. Vajadusel muuda
            töölehe laiust väiksemaks. Vajuta F11 et kasutada täisekraani vaadet.<br/><br/>

            Autosse paigutatud paki kustutamine: SHIFT+click. Paigutamisel
            abistaja väljalülitamine: CTRL+click (CTRL all hoida paigutamise
            lõpukliki tegemise ajal). Paigutamise abi ainult alumise ääre järgi
            aktiveerimiseks vajuta A+click. Paigutamise abi aktiveerimiseks
            parema ääre järgi (vaikimisi on vasaku ääre järgi) vajuta S+click.
            Vajutusega D+click saab pakki paigutada teiste pakkide kõrvale.<br/><br/>

            Värviliselt printimiseks peab olema printimise seadistusest valitud
            linnukesega 'Background graphics'.
        </Help>
    );
};
