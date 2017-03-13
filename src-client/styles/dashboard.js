module.exports = {
  collectionName: (isActive) => {
    return {
      marginTop: 8,
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
    };
  },

  collectionForm: {
    margin: '2em',
  }
};
