const { h: createElement, hydrate } = require('preact');
const whenVisibleOrIdle = require('./components/util/when-visible-or-idle')

const AccountPage = require('./components/AccountPage');

const componentMap = {
    AccountPage,
};

module.exports = () => {
    const componentWrappers = document.querySelectorAll(`[data-component-name]`);

    Array.from(componentWrappers).forEach((wrapper) => {
        whenVisibleOrIdle(wrapper, () => {
            const {componentName, componentProps} = wrapper.dataset;
            const Component = componentMap[componentName];
            const props = JSON.parse(componentProps);

            hydrate(
                createElement(Component, props),
                wrapper,
            );
        });
    });
};
