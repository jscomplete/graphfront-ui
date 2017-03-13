const pg = require('pg');
const config = require('../../util/config');
const crypto = require('crypto');

const { toCamelCaseObject } = require('graphfront/util');
const pgConfig = require('../../util/pg-config')[config.nodeEnv];

const randomKey = (prefix='', bytes = 10) =>
  prefix + crypto.randomBytes(bytes).toString('hex');

const dbPools = {};

const db = {
  usersPool: new pg.Pool(pgConfig),

  schemaPool: (schema) => {
    let pgPool = dbPools[schema];

    if (!pgPool) {
      pgPool = new pg.Pool(Object.assign({}, pgConfig, { schema }));
      dbPools[schema] = pgPool;
    }

    return pgPool;
  },

  usersDb: {

    findProjectByUrlToken(urlToken) {
      return db.usersPool.query(`
        SELECT user_id, db_schema, api_key FROM projects
        WHERE url_token = $1`,
        [urlToken]
      ).then(res => toCamelCaseObject(res.rows[0]));
    },

    findDefaultProject(user) {
      return db.usersPool.query(`
        SELECT id, project_name, project_description, url_token, api_key
        FROM projects WHERE user_id = $1 order by created_at desc limit 1`,
        [user.idx]
      ).then(projectResp => toCamelCaseObject(projectResp.rows[0]));
    },

    updateProject(user, { projectId, updateUrlToken, updateApiKey }) {
      return db.usersPool.query(
        'SELECT idx, api_key, url_token FROM projects WHERE user_id = $1 and id = $2',
        [user.idx, projectId]
      ).then(projectResp => {
        if (projectResp.rows.length !== 1) {
          throw new Error('Invalid Operation');
        }

        const currentProject = projectResp.rows[0];

        const newUrlToken = updateUrlToken ? randomKey('u', 24) : currentProject.url_token;
        const newApiKey = updateApiKey ? randomKey('k') : currentProject.api_key;

        return db.usersPool.query(`
          UPDATE projects
          SET url_token = $2, api_key = $3
          WHERE idx = $1
          RETURNING id, project_name, project_description, url_token, api_key`,
          [currentProject.idx, newUrlToken, newApiKey]
        ).then(updateRes => toCamelCaseObject(updateRes.rows[0]));
      });
    },
  }
};

module.exports = db;
