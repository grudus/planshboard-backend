FROM maven:3.8.5-openjdk-17
WORKDIR /workspace/app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src src

CMD export SPRING_DATASOURCE_URL=$DATABASE_URL SPRING_DATASOURCE_USERNAME=$DATABASE_USER SPRING_DATASOURCE_PASSWORD=$DATABASE_PASSWORD FRONTEND_ADDRESS=$FRONTEND_ADDRESS \
    && mvn spring-boot:run -DskipTests -Dmaven.javadoc.skip=true -B -V \
     -Ddb.url=$DATABASE_URL -Ddb.username=$DATABASE_USER -Ddb.password=$DATABASE_PASSWORD
