#!/usr/bin/env sh

DOCKER_COMPOSES_DIR=docker/compose
RUN_APP_DOCKER_COMPOSE_FILE=docker-compose-app.yml

echo "Copy $RUN_TESTS_DOCKER_COMPOSE_FILE from $DOCKER_COMPOSES_DIR to root directory"
cp ${DOCKER_COMPOSES_DIR}/${RUN_APP_DOCKER_COMPOSE_FILE} ${RUN_APP_DOCKER_COMPOSE_FILE}

echo "Runnig docker compose file ${RUN_APP_DOCKER_COMPOSE_FILE}"

docker-compose -f ${RUN_APP_DOCKER_COMPOSE_FILE} up --abort-on-container-exit --remove-orphans

rm ${RUN_APP_DOCKER_COMPOSE_FILE}
