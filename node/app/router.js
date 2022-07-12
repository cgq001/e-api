'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const {
    router,
    controller,
    config: { apiPrefix }
  } = app
  router.get('/', controller.home.index)
  require('./router/pc')(app);
}
