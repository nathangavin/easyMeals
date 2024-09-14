#!/usr/bin/env bash

#sed "s/\${MINIMAL_USER}/${MYSQL_USER}" "init.sql"
#sed "s/\${MINIMAL_PASSWORD}/${MYSQL_USER_PASSWORD}" "init.sql"

sed "s/\${MINIMAL_USER}/admin/" "init.sql" > "init.sql"
sed "s/\${MINIMAL_PASSWORD}/admin/" "init.sql" > "init.sql"
