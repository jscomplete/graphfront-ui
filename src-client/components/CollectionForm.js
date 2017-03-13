const React = require('react');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { Map, List } = require('immutable');

const actions = require('../actions');
const styles = require('../styles/dashboard');
const FieldRow = require('./FieldRow');

class CollectionForm extends React.Component {
  emptyField = (typeValue = 'String') => Map({
    id: Date.now(),
    nameValue: '',
    typeValue,
    isRequired: 'no',
  });
  modelName = this.props.collectionToAlter ? this.props.collectionToAlter.get('modelName') : '';
  state = {
    input: Map({
      alterCollectionName: this.modelName,
      collectionName: this.modelName,
      fields: this.props.collectionToAlter ?
        this.props.collectionToAlter.get('fields')
          .filter(f => !['id', 'createdAt', 'updatedAt'].includes(f.get('nameValue')))
          .map(f => f.set('disabled', true)) :
        List.of(this.emptyField())
    }),
  };
  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.actions.hideCollectionForm();
  };
  addRow = (emptyRow) => {
    this.setState((prevState) => ({
      input: prevState.input.update(
        'fields', fields => fields.push(emptyRow)
      )
    }));
  };
  addField = (event) => {
    event.preventDefault();
    this.addRow(this.emptyField());
  };
  addRelation = (event) => {
    event.preventDefault();
    this.addRow(this.emptyField('').set('isRelation', true));
  };
  deleteField = (fieldId) => {
    if (this.state.input.get('fields').size === 1) return;
    this.setState(prevState => ({
      input: prevState.input.update('fields', fields =>
        fields.delete(fields.findIndex(field => field.get('id') === fieldId))
      )
    }));
  };
  handleInputChange = (event) => {
    event.preventDefault();
    const target = event.target;
    this.setState(prevState => ({
      input: prevState.input.set('collectionName', target.value)
    }));
  };
  handleFieldInputChange = (fieldId, event) => {
    event.preventDefault();
    const target = event.target;
    this.setState(prevState => ({
      input: prevState.input.update('fields', fields =>
        fields.update(
          fields.findIndex(field => field.get('id') === fieldId),
          field => field.set(target.name, target.value),
        )
      )
    }));
  };
  submitNewCollection = (event) => {
    event.preventDefault();
    this.props.actions.submitNewCollection(this.state.input);
  };
  collectionOptions = () => {
    return this.props.collections.valueSeq().map((collection) =>
      collection.get('modelName')
    );
  }
  render() {
    return (
      <div className="CollectionForm" style={styles.collectionForm}>
        <form onSubmit={this.submitNewCollection}>
          <div className="form-group row">
            <label htmlFor="collectionName" className="col-sm-3 col-form-label text-right">Model Name</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                name="collectionName"
                value={this.state.input.get('collectionName')}
                disabled={this.props.collectionToAlter}
                onChange={this.handleInputChange}
                placeholder="Model Name" required />
            </div>
          </div>
          <p className="text-muted">
            Every model automatically gets and maintains <strong>id</strong>, <strong>createdAt</strong>, and <strong>updatedAt</strong> fields
          </p>
          {this.state.input.get('fields').map(field =>
            <FieldRow key={field.get('id')}
              collectionOptions={this.collectionOptions}
              field={field}
              onChange={this.handleFieldInputChange}
              deleteField={this.deleteField} />
          )}
          <div className="form-group row">
            <a className="col-sm-3" href="#" onClick={this.addField}>
              <i className="fa fa-plus" aria-hidden="true"></i> Add Field
            </a>
          </div>
          <div className="form-group row">
            <a className="col-sm-3" href="#" onClick={this.addRelation}>
              <i className="fa fa-plus" aria-hidden="true"></i> Add Relation
            </a>
          </div>
          <div className="form-group row">
            <div className="col-sm-12 float-sm-right">
              <button type="submit" className="btn btn-secondary">
                <i className="fa fa-hdd-o" aria-hidden="true"></i>
                &nbsp;
                {this.props.collectionToAlter ? `Alter Model ${this.props.collectionToAlter.get('modelName')}` : 'Create'}
              </button>
              &nbsp;&nbsp;
              <a href="#" onClick={this.handleCancelClick}>Cancel</a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  collectionToAlter: state.get('collectionToAlter'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(CollectionForm);
