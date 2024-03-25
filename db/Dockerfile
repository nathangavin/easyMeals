# Use the official MySQL image as a base image
FROM mysql:latest

# Set the root password for MySQL
ENV MYSQL_ROOT_PASSWORD=root_password

ENV MYSQl_DATABASE=easyMeals
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=admin

COPY init.sql /docker-entrypoint-initdb.d/

RUN chmod +r /docker-entrypoint-initdb.d/init.sql

# Expose the MySQL port
EXPOSE 3306

