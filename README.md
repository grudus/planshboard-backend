# Planshboard
![planshboard-test badge](https://github.com/grudus/PlanshboardApp/actions/workflows/test-planshboard.yml/badge.svg)

Web platform for managing board game results and tracking gamers’ progress.


## Technology overview


As a standard web application, Planshboard consist of 3 main parts:

* application server | [Kotlin](https://kotlinlang.org), [Spring Framework](https://spring.io)
* web client | [React](https://reactjs.org), [Typescript](https://www.typescriptlang.org)
* database server | [PostgreSQL](https://www.postgresql.org)

## Development

### Run app in Docker

It is possible to run the whole app inside the docker containers. It can be done by executing the following command:

```bash
./scripts/run-app-docker.sh
```

The app will be available at `localhost:3031`.

### Initial data

To speed up the development, some initial data can be inserted to the database by executing:

```bash
node scripts/insertData.js
```

The above command uses real endpoints of the backend server, so it's neccessary to have it ready before.
