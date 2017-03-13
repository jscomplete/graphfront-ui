const axios = require('axios');
const Immutable = require('immutable');

function fromJSOrdered(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSOrdered).toList() :
      Immutable.Seq(js).map(fromJSOrdered).toOrderedMap();
}

const queryString = (query, variables = {}) => {
  return `query=${query}&variables=${JSON.stringify(variables)}`;
};

const userApiUrl = (query, variables = {}) => {
  return `api/user?${queryString(query, variables)}`;
};

const graphApiUrl = (project, query, variables = {}) => {
  return `api/graph/${project.get('urlToken')}?${queryString(query, variables)}`;
};

module.exports = {
  loadDefaultProject() {
    return axios.get('api/user/project').then(res => fromJSOrdered(res.data));
  },

  loadCollections(urlToken) {
    return axios.get(`api/user/${urlToken}/collections`).then(res => fromJSOrdered(res.data));
  },

  submitNewCollection(project, data) {
    return axios.post(`api/user/${project.get('urlToken')}/collections`, data).then(res => fromJSOrdered(res.data));
  },

  loadCollectionData(project, collection, before='', after='') {
    return axios.post(
      graphApiUrl(project,`
        query LoadCollectionData($apiKey: String!) {
          viewer(apiKey: $apiKey) {
            ${collection.get('collectionName')}(before: "${before}", after: "${after}") {
              ${collection.get('fields').map(f => f.get('nameValue')).join(',')}
            }
          }
        }`, {
          apiKey: project.get('apiKey')
        }
      )
    ).then(res => {
      if (res.data.errors) { throw res.data.errors; }
      return fromJSOrdered(res.data.data.viewer[collection.get('collectionName')]);
    });
  },

  regenerateKeys(project, { apiKey, urlToken }) {
    return axios.post(
      userApiUrl(`
        mutation UpdateProject($projectId: String!, $apiKey: Boolean!, $urlToken: Boolean!) {
          project: updateProject(input: {
            projectId: $projectId,
            updateApiKey: $apiKey,
            updateUrlToken: $urlToken
          }) {
            id
            urlToken
            apiKey
          }
        }
      `, {
        projectId: project.get('id'),
        apiKey,
        urlToken,
      })
    ).then(res => {
      if (res.data.errors) { throw res.data.errors; }
      return fromJSOrdered(res.data.data.project);
    });
  },

};
