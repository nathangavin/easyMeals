#!/usr/bin/env bash

if ( ! pgrep -f docker > /dev/null ); then 
    # docker is not running
    echo "docker daemon not running. Start with 'dockerd'"
    exit 1
fi

# move to testing dir if not there
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# move to project root dir
cd ..

# stop compose network
docker compose down

# build new network
docker compose build

# start network in detached mode
docker compose up -d

docker container ls -a

echo "Waiting for services to be healthy (replace with better check)..."
#docker compose exec -T db sh -c "until mysqladmin ping -u admin -padmin; do sleep 1; done"
#docker compose exec -T backend sh -c "until curl -f http://localhost:3000/health; do sleep 1; done"

sleep 20

docker container ls -a

# run test suite
cd ./testing 
npm run start

# shut down network
docker compose down
