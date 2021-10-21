const Button = require('../form/button.jsx');
const FormGroup = require('../form/group.jsx');
const TextInput = require('../form/text.jsx');
const Checkbox = require('../form/checkbox.jsx');
const Submit = require('../form/submit.jsx');

module.exports = (props) => {
    return (
        <form method='GET' action='/orders' className='vt-form-full'>
            <div className='row'>
                <div className='col-xs-2'>
                    <TextInput
                        id='number'
                        name='number'
                        label='Tellimuse number'
                        placeholder='133'
                        size='sm'
                        defaultValue={props.paginator.searchValue('number')}/>                    
                </div>
                <div className='col-xs-2'>
                    <TextInput
                        id='name'
                        name='name'
                        label='Koorma nimetus'
                        placeholder='Koorma nimetus'
                        size='sm'
                        defaultValue={props.paginator.searchValue('name')}/>
                </div>
                <div className='col-xs-2'>
                    <TextInput
                        id='notes'
                        name='notes'
                        label='Märksõna'
                        placeholder='Märksõna'
                        size='sm'
                        defaultValue={props.paginator.searchValue('notes')}/>
                </div>
                <div className='col-xs-2'>
                    <TextInput
                        id='company'
                        name='company'
                        label='Vedaja'
                        placeholder='Vedaja'
                        size='sm'
                        defaultValue={props.paginator.searchValue('company')}/>
                </div>
                <div className='col-xs-2'>
                    <TextInput
                        id='country'
                        name='country'
                        label='Riik'
                        placeholder='Riik'
                        size='sm'
                        defaultValue={props.paginator.searchValue('country')}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xs-2'>
                    <TextInput
                        id='vehicle'
                        name='vehicle'
                        label='Auto number'
                        placeholder='Auto number'
                        size='sm'
                        defaultValue={props.paginator.searchValue('vehicle')}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='uncommitted'
                        name='uncommitted'
                        value='1'
                        label='Ainult kinnitamata'
                        defaultChecked={props.paginator.searchValue('uncommitted') === '1'}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='tomorrow'
                        name='tomorrow'
                        value='1'
                        label='Ainult homsed'
                        defaultChecked={props.paginator.searchValue('tomorrow') === '1'}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='today'
                        name='today'
                        value='1'
                        label='Ainult tänased'
                        defaultChecked={props.paginator.searchValue('today') === '1'}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='cancelled'
                        name='cancelled'
                        value='1'
                        label='Tühistatud'
                        defaultChecked={props.paginator.searchValue('cancelled') === '1'}/>
                </div>
                <div className='col-xs-2 vt-form-grid-checkbox'>
                    <Checkbox
                        id='import'
                        name='import'
                        value='1'
                        label='Ainult import'
                        defaultChecked={props.paginator.searchValue('import') === '1'}/>
                </div>
            </div>
            <FormGroup>
                <Submit icon='search' label='Otsi'/>
                <span> <Button href='/orders/new' icon='edit' label='Uus'/></span>
                <span> <Button href='/orders' icon='refresh' label='Lähtesta'/></span>
            </FormGroup>
        </form>
    );
};
