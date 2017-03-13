const express = require('express');

module.exports = ({
  appPath='app',
  dbSchema='public',
  dbPool,
  apiKeyValidator
}) => {
  const router = express.Router();
  const apiRouter = require('./apiRouter')({ dbPool, dbSchema, apiKeyValidator });

  router.get('/' + appPath, (req, res) => {
    const vars = {};
    if (!req.user) {
      return res.redirect('/');
    }
    vars.currentUser = req.user;
    res.render(appPath, { vars });
  });

  router.use('/api', apiRouter);

  return router;
};
