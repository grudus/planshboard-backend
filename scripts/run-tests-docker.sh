#!/usr/bin/env sh

DOCKER_COMPOSES_DIR=docker/compose
RUN_TESTS_DOCKER_COMPOSE_FILE=docker-compose-tests.yml
MAIN_TEST_IMAGE_NAME=planshboard_test_backend_image
MAIN_TEST_CONTAINER_NAME=planshboard_test_backend_container

echo "Copy $RUN_TESTS_DOCKER_COMPOSE_FILE from $DOCKER_COMPOSES_DIR to root directory"
cp ${DOCKER_COMPOSES_DIR}/${RUN_TESTS_DOCKER_COMPOSE_FILE} ${RUN_TESTS_DOCKER_COMPOSE_FILE}

echo "Runnig docker compose file ${RUN_TESTS_DOCKER_COMPOSE_FILE}. Get output code from $MAIN_TEST_IMAGE_NAME"

docker-compose -f ${RUN_TESTS_DOCKER_COMPOSE_FILE} up --build --exit-code-from ${MAIN_TEST_IMAGE_NAME} --abort-on-container-exit --remove-orphans
test_result=$(docker wait ${MAIN_TEST_CONTAINER_NAME})

echo "After running tests. Test result: ${test_result} Cleaning up"
rm ${RUN_TESTS_DOCKER_COMPOSE_FILE}

exit "${test_result}"
