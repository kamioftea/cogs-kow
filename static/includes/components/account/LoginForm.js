const {html} = require('htm/preact')
const {useState} = require('preact/hooks');
const preventDefault = require('../util/prevent-default')
const {lens} = require('../util/form-handler')

module.exports = ({title = 'Log in'}) => {
    const [credentials, setCredentials] = useState({email: "", password: ""});

    return html`
        <form onsubmit="${preventDefault( () => console.log(credentials))}">
            <h2>${title}</h2>
            <label>
                Email
                <input type="email"
                       name="email"
                       value="${credentials.email}"
                       oninput=${lens('email', setCredentials)}
                />
            </label>
            <label>
                Password
                <input type="password"
                       name="password"
                       value="${credentials.password}"
                       oninput="${lens('password', setCredentials)}"
                />
            </label>
            <input type="submit" class="button primary" value="Login"/>
        </form>
    `;
};

