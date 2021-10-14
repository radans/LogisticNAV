const Range = require('../../../lib/views/form/range.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const jsonScript = require('../common/json_script');
const api = require('../common/api');
const hsl = require('../plan/hsl');

const ColorForm = FormHoc(class extends React.Component {

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
        const hue = parseFloat(values.hue);
        const saturation = parseFloat(values.saturation);
        const lightness = parseFloat(values.lightness);
        const color = hsl.toRgbString(hue, saturation, lightness);
        return (
            <form className='vt-form' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <Range
                    name='hue'
                    id='salesperson-hue'
                    min={0}
                    max={0.99}
                    step={0.01}
                    error={errors.hue}
                    value={values.hue}
                    label='Värvitoon'
                    onChange={inputChange}/>
                <Range
                    name='saturation'
                    id='salesperson-saturation'
                    min={0}
                    max={0.99}
                    step={0.01}
                    error={errors.saturation}
                    value={values.saturation}
                    label='Küllastus'
                    onChange={inputChange}/>
                <Range
                    name='lightness'
                    id='salesperson-lightness'
                    min={0}
                    max={0.99}
                    step={0.01}
                    error={errors.lightness}
                    value={values.lightness}
                    label='Heledus'
                    onChange={inputChange}/>
                <div className='vt-form-color-output vt-margin'
                    style={{ backgroundColor: color }}>Tekst</div>
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
    const url = `/api/salesperson-color/${encodeURIComponent(meta.id)}`;
    const hue = parseFloat(values.hue);
    const saturation = parseFloat(values.saturation);
    const lightness = parseFloat(values.lightness);
    const rgb = hsl.toRgbString(hue, saturation, lightness);
    await api.update(url, { hue, saturation, lightness, rgb });
};

const success = (values) => {
    window.scheduleFlash('Müügijuhi värv on muudetud.');
    window.location.reload();
};

exports.init = () => {
    inlineForm.installPopupForm((cell, holder) => {
        const row = cell.parentNode;        
        const meta = {
            element: holder,
            id: row.dataset.salesperson
        };
        // TODO hsv values here
        const initial = {
            hue: parseFloat(row.dataset.hue),
            saturation: parseFloat(row.dataset.saturation),
            lightness: parseFloat(row.dataset.lightness)
        };
        ReactDOM.render(
            <ColorForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        ignore: (e) => {
            return !e.target.classList.contains('vt-salespeople-color');
        }
    });
};
