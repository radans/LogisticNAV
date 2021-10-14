const Button = require('../form/button.jsx');
const FormGroup = require('../form/group.jsx');
const TextInput = require('../form/text.jsx');
const Checkbox = require('../form/checkbox.jsx');
const Submit = require('../form/submit.jsx');

module.exports = ({paginator}) => {
    return (
        <form method='GET' action='/packages' className='vt-form-full'>
            <div className='row'>
                <div className='col-xs-2'>
                    <TextInput
                        id='code'
                        name='code'
                        label='Kood'
                        placeholder='Kood'
                        size='sm'
                        defaultValue={paginator.searchValue('code')}/>
                </div>
                <div className='col-xs-2'>
                    <TextInput
                        id='name'
                        name='name'
                        label='Nimetus'
                        placeholder='Nimetus'
                        size='sm'
                        defaultValue={paginator.searchValue('name')}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='archived'
                        name='archived'
                        value='1'
                        label='Arhiveeritud'
                        defaultChecked={paginator.searchValue('archived') === '1'}/>
                </div>
            </div>
            <FormGroup>
                <Submit icon='search' label='Otsi'/>
                <span> <Button href='/packages' icon='refresh' label='Lähtesta'/></span>
                <span> <Button href='/packages/excel' icon='save' label='Uuenda failist'/></span>
            </FormGroup>
        </form>
    );
};
