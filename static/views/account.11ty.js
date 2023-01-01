const render = require('preact-render-to-string');
const {html} = require('htm/preact');
const withHydration = require('../includes/components/util/with-hydration')

const AccountPage = withHydration(require('../includes/components/AccountPage'))

module.exports =  {
    data: () => ({
        css: 'index'
    }),

    render() {
        return render(html`<${AccountPage} />`, {}, {pretty: true});
    }
}
