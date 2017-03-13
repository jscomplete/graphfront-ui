const React = require('react');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const actions = require('../actions');

const CollectionList = require('./CollectionList');
const CollectionData = require('./CollectionData');
const CollectionForm = require('./CollectionForm');

class Dashboard extends React.Component {
  componentDidMount() {
    if (!this.props.currentProject) {
      this.props.actions.loadDefaultProject();
      return;
    }
    this.props.actions.loadCollections(this.props.currentProject.get('urlToken'));
  }

  confirm = (message, action, args) => {
    return () => {
      if (window.confirm(message)) {
        action(args);
      }
    };
  };

  setActiveCollection = (collection) => {
    this.props.actions.setActiveCollection(collection);
  };

  showCollectionForm = (event) => {
    event.preventDefault();
    this.props.actions.showCollectionForm();
  }

  alterActiveCollection = (event) => {
    event.preventDefault();
    this.props.actions.showCollectionForm(this.activeCollectionObject());
  }

  activeCollectionObject = () => {
    return this.props.collections.get(this.props.activeCollection);
  };

  refreshData = (event) => {
    event.preventDefault();
    this.props.actions.setActiveCollection(
      this.activeCollectionObject()
    );
  };

  fetchPrev = (event) => {
    event.preventDefault();
    const lastRow = this.props.activeCollectionData.last();
    if (!lastRow) return;
    this.props.actions.fetchData({
      collection: this.activeCollectionObject(),
      before: lastRow.get('id'),
    });
  };

  fetchNext = (event) => {
    event.preventDefault();
    const firstRow = this.props.activeCollectionData.first();
    if (!firstRow) return;

    this.props.actions.fetchData({
      collection: this.activeCollectionObject(),
      after: firstRow.get('id'),
    });
  };

  headerDisplay = () => {
    if (this.props.collectionForm) {
      if (this.props.collectionToAlter) {
        return 'Alter Model ' + this.activeCollectionObject().get('modelName');
      }
      return 'Create a New Model';
    }

    if (this.props.activeCollection) {
      return (
        <div className="CollectionHeader clearfix">
          <span className="CollectionName float-left">
            <i className="fa fa-table" aria-hidden="true"></i>
            &nbsp;
            {this.activeCollectionObject().get('modelName')}
            &nbsp;
            <i className="fa fa-edit Link" aria-hidden="true" onClick={this.alterActiveCollection}></i>
          </span>
          <div className="d-inline-block float-right">
            <a className="btn btn-secondary btn-sm" onClick={this.fetchPrev} href="#">
              Prev <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </a>
            {' '}
            <a className="btn btn-secondary btn-sm" onClick={this.refreshData} href="">
              <i className="fa fa-refresh" aria-hidden="true"></i>
            </a>
            {' '}
            <a className="btn btn-secondary btn-sm" onClick={this.fetchNext} href="">
              <i className="fa fa-angle-double-right" aria-hidden="true"></i> Next
            </a>
          </div>
        </div>
      );
    }

    return 'Select a Model ...';
  }

  render() {
    if (!this.props.currentProject) return null;
    return (
      <div className="Dashboard container-fluid">
        <div className="row">
          <div className="col-2 navPane">
            <div className="paneHeader">
              Models
            </div>
            <div className="paneContent">
              <CollectionList collections={this.props.collections}
                activeCollection={this.props.activeCollection}
                collectionClick={this.setActiveCollection} />
              <p className="NewCollectionButton">
                <button onClick={this.showCollectionForm} className="btn btn-sm btn-secondary">
                  <i className="fa fa-plus" aria-hidden="true"></i> New Model
                </button>
              </p>
              <div className="ApiLinks">

                <div className="APIEndpoint">
                  <a className="text-success" href={`/api/graph/${this.props.currentProject.get('urlToken')}`} target="_blank">
                    <i className="fa fa-globe" aria-hidden="true"></i> API Endpoint
                  </a>
                  <input type="text" value={`https://graphfront.com/api/graph/${this.props.currentProject.get('urlToken')}`} onChange={() => {}} className="form-control" />
                  <a href="#" className="text-danger"
                    onClick={this.confirm('Are you sure you want to regenerate the current API endpoint? You cannot undo this action.', this.props.actions.regenerateKeys, { urlToken: true })}>
                    <i className="fa fa-refresh" aria-hidden="true"></i> Regenerate
                  </a>
                </div>
                <br />
                <div className="APIKey">
                  <div className="text-success">
                    <i className="fa fa-key" aria-hidden="true"></i> API Key
                  </div>
                  <input type="text" value={this.props.currentProject.get('apiKey')} onChange={() => {}} className="form-control" />
                  <a href="#" className="text-danger"
                    onClick={this.confirm('Are you sure you want to regenerate the current API key? You cannot undo this action.', this.props.actions.regenerateKeys, { apiKey: true })}>
                    <i className="fa fa-refresh" aria-hidden="true"></i> Regenerate
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-10 mainPane">
            <div className="paneHeader">
              {this.headerDisplay()}
            </div>
            <div className="paneContent table-responsive">
              { this.props.collectionForm ?
                  <CollectionForm
                    key={this.props.collectionToAlter ? this.props.collectionToAlter.get('tableName'): 'new'}
                    collections={this.props.collections}
                  /> :
                  <CollectionData rows={this.props.activeCollectionData} />
              }

              { this.props.currentError && <div className="text-danger">{this.props.currentError}</div> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentProject: state.get('currentProject'),
  collections: state.get('collections'),
  activeCollection: state.get('activeCollection'),
  activeCollectionData: state.get('activeCollectionData'),
  collectionForm: state.get('collectionForm'),
  collectionToAlter: state.get('collectionToAlter'),
  currentError: state.get('currentError'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
