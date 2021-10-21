const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const validate = require('../../../lib/validation/address');
const api = require('../common/api');

const UserForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);  
    }

    render() {
        const {            
            error,
            errors,
            values,
            submit,
            loading,
            inputChange
        } = this.props;
        return (
            <form className='vt-form' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}                
                <Checkbox
                    name='active'
                    id='user-active'
                    label='Aktiivne kasutaja'
                    checked={values.active}                    
                    onChange={inputChange}/>
                <Checkbox
                    name='master_user'
                    id='user-master_user'
                    label='Peakasutaja'
                    checked={values.master_user}
                    onChange={inputChange}/>
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Salvesta'
                        disabled={loading}/>
                    <span> <Button
                        href='#'
                        icon='window-close-o'
                        label='Loobu'
                        onClick={this.remove}/></span>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );        
    }
});

const submit = async (values, meta) => {
    const url = `/api/user/${encodeURIComponent(meta.userId)}`;
    await api.update(url, {
        active: values.active,
        master_user: values.master_user
    });
};

const success = (values) => {
    window.scheduleFlash('Kasutaja andmed on salvestatud.');
    window.location.reload();
};

inlineForm.installPopupForm((cell, holder) => {
    const row = cell.parentNode;
    const meta = {
        element: holder,
        userId: row.dataset.user
    };
    const initial = {
        active: row.dataset.active === 'true',
        master_user: row.dataset.master_user === 'true'
    };
    ReactDOM.render(
        <UserForm
            meta={meta}
            submit={submit}
            success={success}
            initial={initial}
            validate={validate}/>, holder);
});
