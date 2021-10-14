const Select = require('../../../lib/views/form/select.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

const users = jsonScript.load('data-users');
const usersOptions = users.map(({id, name}) => ({
    value: id,
    label: name
}));
usersOptions.unshift({
    value: '0',
    label: 'Määramata'
});

const SalesPersonForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { users: usersOptions };
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
                <Select
                    name='user_id'
                    label='Kasutaja'
                    options={this.state.users}
                    value={values.user_id}
                    error={errors.user_id}
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
    const url = `/api/plan/salesperson-users/${encodeURIComponent(meta.id)}`;
    const users = meta.users;
    const user_id = parseInt(values.user_id, 10);
    if (user_id > 0) {
        users.push(user_id);
    }
    await api.update(url, { users });
};

const success = (values) => {
    window.scheduleFlash('Müügijuhi seos kasutajatega on uuendatud.');
    window.location.reload();
};

exports.init = () => {
    inlineForm.installPopupForm((cell, holder, e) => {
        const row = cell.parentNode;
        let users = row.dataset.users ? row.dataset.users.split(',')
            .map(string => parseInt(string, 10)) : [];    
        const user = e.target.dataset.user;
        if (user) {
            const userId = parseInt(user, 10);
            users = users.filter(user => user !== userId);
        }
        const meta = {
            users: users,
            element: holder,
            id: row.dataset.salesperson        
        };
        const initial = { user_id: user || '0' };
        ReactDOM.render(
            <SalesPersonForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        ignore: (e) => {
            return !e.target.classList.contains('vt-salespeople-select');
        }
    });
};
