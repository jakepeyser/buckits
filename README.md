# Buckits

![Build Status](https://travis-ci.org/jakepeyser/buckits.png)

_Helping you complete your bucket list, drop by drop_

## Running Locally

### Prerequisites
- Node (>6.7) and npm
- PostgreSQL

### Run It

```sh
npm install
npm run seed
npm run build-watch
npm run dev
```

The above script will go through the following steps:
1. Install npm dependencies
1. Populate your Postgres DB with the seed data in `server/db/seed.js`
1. Perform a build with Webpack and watch for changes
1. Run the server and watch for file changes with nodemon

## Deploying to Heroku

All pushes to GitHub are being built and tested by Travis CI. However, only the merged oull requests on `master` will be deployed to Heroku.

Our app is running on Heroku at:  
**Prod**: [https://buckits.herokuapp.com/](https://buckits.herokuapp.com/) 

### Deploying to Prod

All deployments to Prod will go through the following process:

1. A feature branch opens up a Pull Request on `master`
2. The branch is built and tested by Travis CI
3. If the build/tests pass, GitHub will allow collaborators to complete the merge
4. Once the PR is merged, Travis will rebuild the repo and deploy to Prod

No changes need to be made to the `.travis.yml` file to enable this process. Be sure not to directly push to `master` in an effort to avoid bad builds being deployed to Prod.

## Testing

The easiest way to test is with [Postman](https://www.getpostman.com/). You can use our development testing
collection to help you get started!

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/6110dceb318fe837f2be)
