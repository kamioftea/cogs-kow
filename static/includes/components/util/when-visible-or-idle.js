module.exports = function whenVisibleOrIdle(element, callback, options) {
    if (typeof IntersectionObserver === `undefined` && typeof requestIdleCallback === `undefined`) {
        callback();
        return;
    }

    let executed = false;
    let observer;

    const wrappedCallback = () => {
        if(!executed) {
            executed = true;
            if (observer) {
                observer.unobserve(element);
            }
            callback()
        }
    }

    if(typeof IntersectionObserver !== `undefined`) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                wrappedCallback();
            });
        }, options);
        observer.observe(element);
    }

    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(wrappedCallback)
    }
};


