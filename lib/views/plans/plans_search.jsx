const Button = require('../form/button.jsx');
const FormGroup = require('../form/group.jsx');
const TextInput = require('../form/text.jsx');
const Select = require('../form/select.jsx');
const Checkbox = require('../form/checkbox.jsx');
const Submit = require('../form/submit.jsx');

module.exports = ({authors, topAuthors, paginator}) => {
        const authorsOptions = authors.map(({id, name}) =>
            ({ value: id, label: name }));
        authorsOptions.unshift({ value: 0, label: 'Valimata' });
    return (
        <form method='GET' action='/plans' className='vt-form-full'>
            <input type='hidden' name='package_code'
                value={paginator.searchValue('package_code')}/>
            <div className='row'>
                <div className='col-xs-2'>
                    <Select
                        name='author_id'
                        label='Koostaja'
                        options={authorsOptions}
                        defaultValue={paginator.searchValue('author_id')}/>
                </div>
                <div className='col-xs-6 vt-form-grid-button'>
                    {topAuthors.map(author => <span key={author.id}><Button href={`/plans?author_id=${author.id}`} label={author.name}/> </span>)}
                </div>
            </div>
            <FormGroup>
                <Submit icon='search' label='Otsi'/>
                <span> <Button href='/plans/new' icon='photo' label='Uus plaan'/></span>
            </FormGroup>
        </form>
    );
};
