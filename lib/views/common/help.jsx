const Icon = require('./icon.jsx');

// Helper to display help sections.

module.exports = (props) => {
    if (!props.help) {
        return null;
    }
    return (
        <div className='vt-help hidden-print'>
            <div className='vt-help-icon'>
                <Icon name='question-circle'/>
            </div>
            <p>
                {props.children}
            </p>
        </div>
    );
};
