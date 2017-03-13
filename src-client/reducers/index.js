const types = require('../actions/types');
const { List } = require('immutable');

module.exports = (state, action) => {
  switch (action.type) {
    case types.SET_ERROR_MESSAGE:
      return state.set('currentError', action.message);
    case types.RECEIVE_DEFAULT_PROJECT:
      return state.set('currentProject', action.project);
    case types.RECEIVE_COLLECTIONS:
      return state.set('collections', action.collections);
    case types.RECEIVE_NEW_COLLECTION:
      return state.withMutations(ctx =>
        ctx.mergeDeep({ collections: action.collectionObject })
          .set('currentError', null)
          .set('activeCollection', action.collectionObject.keySeq().get(0))
          .set('collectionForm', false)
          .set('activeCollectionData', List())
      );
    case types.RECEIVE_COLLECTION_DATA:
      return state.withMutations(ctx =>
        ctx.set('activeCollectionData', action.collectionData)
           .set('currentError', null)
           .set('collectionForm', false)
      );
    case types.SET_ACTIVE_COLLECTION:
      return state.set('activeCollection', action.collection);
    case types.COLLECTION_FORM:
      return state.withMutations(ctx =>
        ctx.set('collectionForm', action.status)
           .set('currentError', null)
           .set('collectionToAlter', action.collection)
      );
    default:
      return state;
  }
};
