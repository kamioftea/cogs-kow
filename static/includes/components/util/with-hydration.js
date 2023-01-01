const { html } = require('htm/preact');

module.exports = Component => (props) => {
    return html`
        <div data-component-name="${Component.name}"
             data-component-props="${JSON.stringify(props)}"
        >
            <${Component} ...${props}/>
        </div>`;
};
