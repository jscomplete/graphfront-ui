const express = require('express');

module.exports = () => {
  const router = express.Router();
  const { schema: localSchema, rootValue: localRootValue } = require('../graphql');

  const { schemaPool, usersDb: localUsersDb } = require('../database');
  const graphfront = require('graphfront');

  router.use('/graph/:urlToken', (req, res) => {
    localUsersDb.findProjectByUrlToken(req.params.urlToken).then(project => {
      const graphfrontHTTP = graphfront({
        dbPool: schemaPool(project.dbSchema),
        dbSchema: project.dbSchema,
        apiKeyValidator: (apiKey) => apiKey === project.apiKey
      });

      graphfrontHTTP(req, res);
    }).catch(err => {
      console.error('Error in /graph', req.params.urlToken, err);
      res.status(500).send('Bad Request');
    });
  });

  router.get('/user/project', (req, res) => {
    if (!req.user) throw new Error('Invalid Request');

    localUsersDb.findDefaultProject(req.user).then(project => {
      if (!project) {
        throw new Error('Invalid Project');
      }
      res.send(project);
    }).catch(err => {
      console.error('Error in GET /collections', req.body, err);
      res.status(500).send('Bad Request');
    });
  });

  router.get('/user/:urlToken/collections', (req, res) => {
    if (!req.user) throw new Error('Invalid Request');

    localUsersDb.findProjectByUrlToken(req.params.urlToken).then(project => {
      if (req.user.idx !== project.userId) {
        throw new Error('Invalid User Request');
      }

      const { projectDb } = graphfront.schemaDb(schemaPool(project.dbSchema), project.dbSchema);

      projectDb.getModelsInfo(false).then(collections => {
        res.send(collections);
      });
    }).catch(err => {
      console.error('Error in GET /collections', req.body, err);
      res.status(500).send('Bad Request');
    });
  });

  router.post('/user/:urlToken/collections', (req, res) => {
    if (!req.user) throw new Error('Invalid Request');

    localUsersDb.findProjectByUrlToken(req.params.urlToken).then(project => {
      if (req.user.idx !== project.userId) {
        throw new Error('Invalid User Request');
      }

      const { projectDb, resetSchema } = graphfront.schemaDb(schemaPool(project.dbSchema), project.dbSchema);

      if (req.body.alterCollectionName) {
        return projectDb.alterTable(req.body).then(model => {
          resetSchema(project);
          res.send(model);
        });
      }

      return projectDb.createTable(req.body).then(model => {
        resetSchema(project);
        res.send(model);
      });
    }).catch(err => {
      console.error('Error in POST /collections', req.body, err);
      res.status(500).send('Bad Request');
    });
  });

  router.use('/user', (req, res) => {
    if (!req.user) throw new Error('Invalid Request');

    graphfront.graphqlHTTP({
      schema: localSchema,
      rootValue: localRootValue,
      context: { db: localUsersDb, user: req.user },
      graphiql: true,
    })(req, res);
  });

  return router;

};
