const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');

const Dashboard = require('./components/Dashboard');
const storeConfig = require('./stores');

class Root extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Dashboard />
      </Provider>
    );
  }
}

const appStore = storeConfig({
  collections: {},
  project: 'main',
});

module.exports = (mountNodeId = 'root') => {
  ReactDOM.render(<Root store={appStore}/>, document.getElementById(mountNodeId));
};
