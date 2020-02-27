FROM maven:3.6.3-jdk-8-slim as build
WORKDIR /workspace/app

VOLUME ~/.m2 /root/.m2

COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/src src

CMD mvn test -B -Ddb.url=$DATABASE_URL -Ddb.username=$DATABASE_USER -Ddb.password=$DATABASE_PASSWORD -Dspring.datasource.username=$DATABASE_USER -Dspring.datasource.password=$DATABASE_PASSWORD -Dspring.datasource.url=$DATABASE_URL -Dspring.flyway.enabled='false'
