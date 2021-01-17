def DOCKER_COMPOSES_DIR = "docker/compose"
def BACKEND_DOCKER_COMPOSE_FILE = "docker-compose-backend-tests.yml"
def FRONTEND_DOCKER_COMPOSE_FILE = "docker-compose-frontend-tests.yml"
def DATABASE_DOCKER_COMPOSE_FILE = "docker-compose-database.yml"

def FRONTEND_TEST_CONTAINER_NAME = "planshboard_test_frontend_container"
def FRONTEND_TEST_IMAGE_NAME = "planshboard_test_frontend_image"
def BACKEND_TEST_IMAGE_NAME = "planshboard_test_backend_image"
def BACKEND_TEST_CONTAINER_NAME = "planshboard_test_backend_container"


def DATABASE_URL = "jdbc:postgresql://host.docker.internal:5432/planshboard_test"
def DATABASE_USER = "grudus"
def DATABASE_PASSWORD = "grudus"


// noinspection GroovyAssignabilityCheck
pipeline {
    agent none

    options {
        timeout(time: 30)
        timestamps()
    }

    stages {
        stage("Setup database container") {
            agent any

            steps {
                echo "Running docker db container"
                sh "docker-compose up -d"
                sh 'sleep 30s'
            }
        }


        stage("Prepare environment") {
            parallel {

                stage("Load backend dependencies") {
                    agent {
                        docker {
                            reuseNode true
                            image "maven:3.6.3-jdk-8-slim"
                        }
                    }
                    steps {
                        sh "mvn -v"
                        dir("backend") {
                            sh "mvn dependency:go-offline"
                        }
                    }

                }

                stage("Load frontend dependencies") {
                    agent {
                        docker {
                            reuseNode true
                            image "node:12.2.0-alpine"
                        }
                    }
                    environment {
                        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
                    }
                    steps {
                        sh 'node -v'
                        sh 'npm -v'
                        dir("frontend") {
                            sh 'npm i'
                        }
                    }

                }
            }
        }

        stage("Run tests") {
            parallel {
                stage("Run frontend tests") {
                    agent {
                        docker {
                            reuseNode true
                            image "node:12.2.0-alpine"
                        }
                    }
                    steps {
                        dir("frontend") {
                            sh 'npm run test'
                        }
                    }

                }

                stage("Run backend tests") {
                    agent {
                        docker {
                            reuseNode true
                            image "maven:3.6.3-jdk-8-slim"
                            args "--add-host host.docker.internal:host-gateway"
                        }
                    }
                    steps {
                        dir("backend") {
                            sh "mvn test -B -Ddb.url=$DATABASE_URL -Ddb.username=$DATABASE_USER -Ddb.password=$DATABASE_PASSWORD -Dspring.datasource.username=$DATABASE_USER -Dspring.datasource.password=$DATABASE_PASSWORD -Dspring.datasource.url=$DATABASE_URL -Dspring.flyway.enabled='false'"
                        }
                    }

                }
            }
        }

        stage("Build for deploymeny") {
            parallel {
                stage("Build frontend") {
                    agent {
                        docker {
                            reuseNode true
                            image "node:12.2.0-alpine"
                        }
                    }
                    steps {
                        dir("frontend") {
                            sh 'CI= npm run build'
                        }
                    }
                }

                stage("Build backend") {
                    agent {
                        docker {
                            reuseNode true
                            image "maven:3.6.3-jdk-8-slim"
                        }
                    }
                    steps {
                        dir("backend") {
                            sh "mvn package -Ddb.url=$DATABASE_URL -Ddb.username=$DATABASE_USER -Ddb.password=$DATABASE_PASSWORD -Dspring.datasource.username=$DATABASE_USER -Dspring.datasource.password=$DATABASE_PASSWORD -Dspring.datasource.url=$DATABASE_URL  -Dspring.flyway.enabled='false'"
                        }
                    }
                }
            }
        }

        stage("Final thoughts") {
            agent any
            steps {
                sh "pwd"
                sh "ls -alt"
                sh "docker ps -a"

                dir("frontend") {
                    sh "ls -alt"
                    dir("build") {
                        sh "ls -alt"
                    }
                }

                dir("backend") {
                    sh "ls -alt"
                    dir("target") {
                        sh "ls -alt"
                    }
                }

            }
        }
    }
}
