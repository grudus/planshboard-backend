#!/usr/bin/env sh


DATABASE_CONTAINER="planshboard_postgres"
DATABASE_USER="grudus"
DATABASE_PASSWORD="grudus"
DATABASE_DATABASE="planshboard"

CURR_DIR=$(pwd)
MIGRATIONS_DIR='backend'

pwd
echo "About to remove public schema on database ${DATABASE_DATABASE} for user ${DATABASE_USER} in container ${DATABASE_CONTAINER}"
echo ""

sleep 3

PGPASSWORD="${DATABASE_PASSWORD}" docker exec -it "${DATABASE_CONTAINER}" psql -U "${DATABASE_USER}" -d "${DATABASE_DATABASE}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${DATABASE_USER}; GRANT ALL ON SCHEMA public TO public;" || {
    >&2 echo "Cannot drop public schema"
    cd "${CURR_DIR}"
    exit 1
}

echo ""
echo "Database removed. About to rerun creation"

cd "${MIGRATIONS_DIR}" || {
    >&2 echo "Cannot go to the '${MIGRATIONS_DIR}' directory. Try running script from the project's root directory"
    cd "${CURR_DIR}"
    exit 2
}

mvn generate-sources -T4 || {
    >&2 echo "Cannot install maven project"
    cd "${CURR_DIR}"
    exit 2
}

echo ""
echo "Success"

cd "${CURR_DIR}"

