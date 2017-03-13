const React = require('react');

class FieldRow extends React.Component {
  prop = property => this.props.field.get(property);
  options = () => {
    if (this.prop('isRelation')) {
      return this.props.collectionOptions();
    }
    return [
      'String',
      'Int',
      'Boolean',
      'DateTime',
      'Float',
      'Date',
      'Time',
    ];
  }
  handleDeleteClick = (event) => {
    event.preventDefault();
    this.props.deleteField(this.prop('id'));
  };
  handleInputChange = (event) => {
    this.props.onChange(this.prop('id'), event);
  };
  render() {
    return (
      <div className="form-group row">
        <div className="col-sm-4">
          <input type="text"
            className="form-control"
            value={this.prop('nameValue')}
            name="nameValue"
            disabled={this.prop('disabled')}
            onChange={this.handleInputChange}
            placeholder={`${this.prop('isRelation') ? 'Relation' : ''} Field Name`} required />
        </div>
        <div className="col-sm-4">
          <select className="form-control"
            name="typeValue"
            disabled={this.prop('disabled')}
            onChange={this.handleInputChange}
            value={this.prop('typeValue')} required>
              <option value="">Select {this.prop('isRelation') ? 'Reference Model' : 'Field Type'}</option>
              {this.options().map(option =>
                <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="col-sm-3">
          <select className="form-control"
            disabled={this.prop('disabled')}
            name="isRequired"
            onChange={this.handleInputChange}
            value={this.prop('isRequired')} required>
            <option value="no">Not required</option>
            <option value="yes">Required</option>
          </select>
        </div>
        <div className="col-sm-1">
          <a href="#" onClick={this.handleDeleteClick}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    );
  }
}

module.exports = FieldRow;
