# Use official Maven image for build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use JRE for runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/sweet-shop-api-1.0.0.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]