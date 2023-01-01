const preventDefault = require('../util/prevent-default')
const {useCallback} = require('preact/hooks')

module.exports = {
    lens: (name, setState) =>
              useCallback(
                  preventDefault(
                      e => setState(
                          prev => ({...prev, [name]: e.target.value})
                      )
                  ),
                  []
              )
}
