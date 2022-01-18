<a href="https://yeovilhospital.co.uk/">
	<img alttext="Yeovil District Hospital Logo" src="https://github.com/Fdawgs/ydh-logos/raw/HEAD/images/ydh-full-logo-transparent-background.svg" width="480" />
</a>

# Yeovil District Hospital NHS Foundation Trust - Community Contacts RESTful CRUD API

[![GitHub Release](https://img.shields.io/github/release/Fdawgs/ydh-community-contacts-api.svg)](https://github.com/Fdawgs/ydh-community-contacts-api/releases/latest/)
![Build Status](https://github.com/Fdawgs/ydh-community-contacts-api/workflows/CI/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Fdawgs/ydh-community-contacts-api/badge.svg?branch=master)](https://coveralls.io/github/Fdawgs/ydh-community-contacts-api?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Fdawgs/ydh-community-contacts-api/badge.svg)](https://snyk.io/test/github/Fdawgs/ydh-community-contacts-api)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

> Yeovil District Hospital NHSFT's RESTful CRUD API for community team contact details

## Intro

This is [Yeovil District Hospital NHSFT](https://yeovilhospital.co.uk/)'s Community Contacts RESTful API, a Node.js application using the [Fastify](https://www.fastify.io/) web framework, built to support CRUD (Create, Read, Update, and Delete) functionality of community midwife, health visitor, and school nurse team email addresses in YDH's catchment area.

This was built for use by interface engine channels/workflows that automatically dispatch maternity and paediatric discharge summaries via encrypted email to their respective community teams, based on a patient’s postcode, school code, or GP practice code.

## Prerequisites

-   [Node.js](https://nodejs.org/en/) >=14.0.0 (if running outside of Docker)
-   [SQL Server](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads) >=13.x or [PostgreSQL](https://www.postgresql.org/download/) (either as services/instances or Docker containers)

## Setup

Perform the following steps before deployment:

1. Clone or download the repo
2. Navigate to the project directory
3. Make a copy of `.env.template` in the root directory and rename it to `.env`
4. Configure the application using the environment variables in `.env`

**Note:** You will need to create a database prior to using it in the `DB_CONNECTION_STRING` environment variable (this does not apply if using the included Docker Compose file to deploy)

**Note:** Set the following environment variables in `.env` to meet NHS Digital's recommendation to retain 6 months' worth of logs:

-   `LOG_ROTATION_DATE_FORMAT="YYYY-MM-DD"`
-   `LOG_ROTATION_FREQUENCY="daily"`
-   `LOG_ROTATION_MAX_LOGS="180"`

## Deployment

### Standard Deployment

1. Run `npm install --ignore-scripts --production` to install dependencies
2. Run `npm run db:migrate` to create supporting database, schemas, and tables
3. Run `npm start`

The service should be up and running on the port set in the config. You should see the following output in stdout or the log file specified using the `LOG_ROTATION_FILENAME` environment variable:

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.556Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "Connecting to MSSQL DB"
}
```

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.558Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "MSSQL DB connection opened"
}
```

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.760Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "Server listening at http://0.0.0.0:8204"
}
```

You can now navigate to http://0.0.0.0:8204/docs to see the API documentation!

### Deploying Using Docker

This requires [Docker](https://www.docker.com) installed.

1. Run `docker compose up` (or `docker compose up -d` to run in background)

### Deploying Using PM2

If you are unable to deploy this into production using Docker, it is recommended that you use a process manager such as [PM2](https://pm2.keymetrics.io/).

1. Run `npm install --ignore-scripts --production` to install dependencies
2. Run `npm run db:migrate` to create supporting database, schemas, and tables
3. Run `npm install -g pm2` to install pm2 globally
4. Launch application with `pm2 start .pm2.config.js`
5. Check the application has been deployed using `pm2 list` or `pm2 monit`

#### To Install as a Windows Service:

If using a Microsoft Windows OS utilise [pm2-installer](https://github.com/jessety/pm2-installer) to install PM2 as a Windows service.

**Note:** PM2 will automatically restart the application if `.env` is modified.

## Contributing

Contributions are welcome, and any help is greatly appreciated!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started.
Please adhere to this project's [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing.

## Acknowledgements

-   **Michael McCormack** - MSSQL query optimisation

## License

`ydh-community-contacts-api` is licensed under the [MIT](./LICENSE) license.
