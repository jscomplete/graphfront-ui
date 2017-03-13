const api = require('./api');
const types = require('./types');

exports.showCollectionForm = (collection) => ({
  type: types.COLLECTION_FORM,
  collection,
  status: true,
});

exports.hideCollectionForm = () => ({
  type: types.COLLECTION_FORM,
  status: false,
});

exports.errorMessage = (message = 'Something went wrong') => ({
  type: types.SET_ERROR_MESSAGE,
  message,
});

// ASYNC
exports.loadCollections = (urlToken) => {
  return (dispatch) => {
    api.loadCollections(urlToken).then(collections => {
      dispatch({
        type: types.RECEIVE_COLLECTIONS,
        collections,
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};

exports.loadDefaultProject = () => {
  return (dispatch) => {
    api.loadDefaultProject().then(project => {
      dispatch(exports.loadCollections(project.get('urlToken')));
      dispatch({
        type: types.RECEIVE_DEFAULT_PROJECT,
        project,
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};

exports.setActiveCollection = (collection) => {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_ACTIVE_COLLECTION,
      collection: collection.get('tableName')
    });
    api.loadCollectionData(getState().get('currentProject'), collection)
    .then(collectionData => {
      dispatch({
        type: types.RECEIVE_COLLECTION_DATA,
        collectionData,
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};

exports.fetchData = ({ collection, before, after }) => {
  return (dispatch, getState) => {
    api.loadCollectionData(getState().get('currentProject'), collection, before, after)
    .then(collectionData => {
      if (collectionData.size === 0) return;
      dispatch({
        type: types.RECEIVE_COLLECTION_DATA,
        collectionData,
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};

exports.submitNewCollection = (input) => {
  return (dispatch, getState) => {
    api.submitNewCollection(getState().get('currentProject'), input.toJS())
    .then(collectionObject => {
      dispatch({
        type: types.RECEIVE_NEW_COLLECTION,
        collectionObject
      });
      return api.loadCollectionData(
        getState().get('currentProject'),
        collectionObject.get(collectionObject.keySeq().get(0))
      ).then(collectionData => {
        if (collectionData.size === 0) return;
        dispatch({
          type: types.RECEIVE_COLLECTION_DATA,
          collectionData,
        });
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};

exports.regenerateKeys = ({ apiKey = false, urlToken = false }) => {
  return (dispatch, getState) => {
    api.regenerateKeys(getState().get('currentProject'), { apiKey, urlToken })
    .then(project => {
      dispatch({
        type: types.RECEIVE_DEFAULT_PROJECT,
        project,
      });
    })
    .catch((err) => dispatch(exports.errorMessage(err)));
  };
};
