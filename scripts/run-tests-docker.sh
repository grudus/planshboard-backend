#!/usr/bin/env sh

DOCKER_COMPOSES_DIR=docker/compose
BACKEND_DOCKER_COMPOSE_FILE=docker-compose-backend-tests.yml
FRONTEND_DOCKER_COMPOSE_FILE=docker-compose-frontend-tests.yml
FRONTEND_TEST_CONTAINER_NAME=planshboard_test_frontend_container
FRONTEND_TEST_IMAGE_NAME=planshboard_test_frontend_image
BACKEND_TEST_IMAGE_NAME=planshboard_test_backend_image
BACKEND_TEST_CONTAINER_NAME=planshboard_test_backend_container



testFailed() {
    echo "=== Some tests failed ==="
    exit 3
}

runDockerTests() {
    composeFile=$1
    imageName=$2
    containerName=$3
    echo "== Copy $composeFile from $DOCKER_COMPOSES_DIR to root directory"
    cp ${DOCKER_COMPOSES_DIR}/"${composeFile}" "${composeFile}"

    echo "== Building docker compose file ${composeFile}"
    docker-compose -f "$composeFile" up --build --exit-code-from "$imageName" --abort-on-container-exit --remove-orphans
    test_result=$(docker wait "${containerName}")
    echo "After running tests. Test result: ${test_result} Cleaning up."
    rm "${composeFile}"

    return "${test_result}";
}


echo "=== Start frontend tests ==="
runDockerTests $FRONTEND_DOCKER_COMPOSE_FILE $FRONTEND_TEST_IMAGE_NAME $FRONTEND_TEST_CONTAINER_NAME || testFailed
echo "=== Start backend tests ==="
runDockerTests $BACKEND_DOCKER_COMPOSE_FILE $BACKEND_TEST_IMAGE_NAME $BACKEND_TEST_CONTAINER_NAME || testFailed

exit 0
