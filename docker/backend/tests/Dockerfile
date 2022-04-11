FROM maven:3.8.5-openjdk-17
WORKDIR /workspace/app

VOLUME $HOME/.m2 /root/.m2

COPY ./pom.xml .
RUN mvn dependency:go-offline -q

COPY src src

CMD mvn test -B \
    -Ddb.url=$DATABASE_URL -Ddb.username=$DATABASE_USER -Ddb.password=$DATABASE_PASSWORD -Dspring.datasource.username=$DATABASE_USER -Dspring.datasource.password=$DATABASE_PASSWORD -Dspring.datasource.url=$DATABASE_URL -Dspring.flyway.enabled='false'
