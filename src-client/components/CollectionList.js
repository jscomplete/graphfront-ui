const React = require('react');

const styles = require('../styles/dashboard');

class CollectionItem extends React.Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.collectionClick(this.props.collection);
  }
  render() {
    return (
      <li className="CollectionItem"
          style={styles.collectionName(this.props.isActive)}
          onClick={this.handleClick}>
        <i className="fa fa-table" aria-hidden="true"></i> {this.props.collection.get('modelName')}
      </li>
    );
  }
}

class CollectionList extends React.Component {
  render() {
    if (this.props.collections.length == 0) {
      return <div>Loading ...</div>;
    }
    return (
      <ul className="CollectionList list-unstyled">
        {this.props.collections.entrySeq().map(([tableName, collection]) =>
          <CollectionItem key={tableName}
            collection={collection}
            isActive={tableName === this.props.activeCollection}
            collectionClick={this.props.collectionClick} />
        )}
      </ul>
    );
  }
}

module.exports = CollectionList;
