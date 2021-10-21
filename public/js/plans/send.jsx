const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const api = require('../common/api');

const SendForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { people: [], peopleLoading: true };
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);
    }

    async componentDidMount() {
        const planId = this.props.meta.id;
        const url = `/api/plan/email-receivers/${encodeURIComponent(planId)}`;
        try {
            const people = await api.get(url);            
            const values = {};
            for (const person of people) {
                values[`person-${person.email}`] = person.selected;
            }
            this.props.changeValues(values, () => {
                this.setState({ people, peopleLoading: false });
            });
        } catch (err) {
            window.showError('Viga saajate laadimisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
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
        if (this.state.peopleLoading) {
            return <div className='vt-loader'></div>;
        }
        return (
            <form className='vt-form' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <FormGroup>
                <FormGroup>
                    Vali plaani saajad.
                </FormGroup>
                    {this.state.people.map(person =>
                        <Checkbox
                            key={`person-${person.email}`}
                            name={`person-${person.email}`}
                            label={(person.always ? '*' : '') + person.name}
                            checked={values[`person-${person.email}`]}
                            onChange={inputChange}/>
                    )}
                    <Submit
                        icon='save'
                        label='Saada'
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
    const userEmails = [];
    for (const key of Object.keys(values)) {
        if (values[key]) {
            const match = key.match(/person-(.+)$/);
            if (match) {
                userEmails.push(match[1]);
            }        
        }
    }
    if (userEmails.length > 0) {
        const url = `/api/plan/send-to-salespeople/${encodeURIComponent(meta.id)}`;
        await api.update(url, { userEmails });
    }
};

const success = (values) => {
    window.scheduleFlash('Plaan on saadetud.');
    window.location.reload();
};

exports.init = () => {
    inlineForm.installPopupForm((cell, holder) => {
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.plan
        };
        const initial = {};
        ReactDOM.render(
            <SendForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        ignore: (e) => {
            return !e.target.classList.contains('vt-plans-send');
        }
    });
};
