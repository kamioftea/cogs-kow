const {html} = require('htm/preact')
const {useState} = require('preact/hooks');
const preventDefault = require('../util/prevent-default')
const {lens} = require('../util/form-handler')

module.exports = ({title = 'Register', user = {}}) => {
    const {email, name} = user;
    const [formData, setFormData] = useState({email, name});

    return html`
        <form onsubmit="${preventDefault( () => console.log(formData))}">
            <h2>${title}</h2>
            <label>
                Email
                <input type="email"
                       name="email"
                       value="${formData.email}"
                       oninput=${lens('email', setFormData)}
                />
            </label>
            <label>
                Display Name
                <input type="text"
                       name="name"
                       value="${formData.name}"
                       oninput=${lens('name', setFormData)}
                />
            </label>
            <input type="submit" class="button primary" value="Create account"/>
        </form>
    `;
};

