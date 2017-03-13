# graphfront-ui

An admin interface for your database with a GraphQL API.

This is a work-in-progress project.
It requires a super recent version of Node.js and using it in production is not recommended.

[![npm version](https://badge.fury.io/js/graphfront-ui.svg)](https://badge.fury.io/js/graphfront-ui)

## Getting Started

An overview of GraphQL in general is available in the
[README](https://github.com/facebook/graphql/blob/master/README.md) for the
[Specification for GraphQL](https://github.com/facebook/graphql).

### Using graphfront-ui

Install graphfront-ui from npm

```sh
npm install --save graphfront-ui
```

graphfront-ui provides an admin interface for your database.

First, mount the server url endpoints with:

```js
import graphfrontRouter from 'graphfront-ui/server';

app.use('/', graphfrontRouter({ path: 'dashboard' }));
```

Then, in a view template at /dashboard, render a React application using:

```js
import reactApp from 'graphfront-ui/client';

reactApp('mountNodeId');
```

`mountNodeId` has to exist in the template's HTML

The server code expects the user to be logged in and it expects access to
the database structure at db.sql

### Contributing

We actively welcome pull requests, learn how to
[contribute](https://github.com/jscomplete/graphfront-ui/blob/master/CONTRIBUTING.md).

### Changelog

Changes are tracked as [Github releases](https://github.com/jscomplete/graphfront-ui/releases).

### License

graphfront-ui is [BSD-licensed](https://github.com/jscomplete/graphfront-ui/blob/master/LICENSE).
