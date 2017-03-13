const React = require('react');
const humps = require('humps');

const cellFormat = (value) => {
  if (value === true || value === false) {
    return `${value}`;
  }

  return value;
};

class CollectionData extends React.Component {
  render() {
    if (!this.props.rows) return null;

    if (this.props.rows.size === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          No data.
        </div>
      );
    }

    return (
      <table className="CollectionData table table-sm table-hover">
        <thead>
          <tr className="thead-default">
            {this.props.rows.get(0).keySeq().map((field) =>
              <th key={field}>
                {humps.pascalize(field)}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map(row =>
            <tr key={row.get('id')}>
              {row.entrySeq().map(([field, value]) =>
                <td className="DataCell" key={field}>
                  {cellFormat(value)}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

module.exports = CollectionData;
