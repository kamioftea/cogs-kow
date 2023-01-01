const {html} = require('htm/preact')
const {useState} = require('preact/hooks')
const isServer = require('./util/is-server')
const preventDefault = require('./util/prevent-default')

const LoginForm = require('./account/LoginForm')
const RegisterForm = require('./account/RegisterForm')

const AccountPage = ({user}) => {
    const [register, setRegister] = useState(false);

    return html`
        <section role="banner" class="cogs-header margin-bottom-1">
            <img src="/images/logo.png" alt="Chesterfield Open Gaming Society Logo" class="logo"/>
            <span class="h1 club-name">Chesterfield Open Gaming Society</span>
            <h1>Organised Play Account</h1>
        </section>

        <nav aria-label="You are here:" role="navigation">
            <ul class="breadcrumbs">
                <li><a href="https://www.c-o-g-s.org.uk/">Home</a></li>
                <li><a href="/">Kings of War</a></li>
                <li><span class="show-for-sr">Current: </span>Account Management</li>
            </ul>
        </nav>

        ${!user && html`
            <div class="credentials-form">
                ${register
                        ? html`
                            <${RegisterForm} title="We need some details to create a new account"/>
                            ${!isServer && html`
                                <a href="#" onclick=${preventDefault(() => setRegister(false))}>
                                    Sign in to an existing account
                                </a>
                            `}
                        `
                        : html`
                            <${LoginForm} title="You need to log in to manage your account"/>
                            ${!isServer && html`
                                <a href="#" onclick=${preventDefault(() => setRegister(true))}>
                                    Register for an account
                                </a>
                            `}
                        `
                }
            </div>
        `}
    `;
}

module.exports = AccountPage
