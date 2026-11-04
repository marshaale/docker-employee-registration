!#/bin/bash

######################
# Author: Marshaale
# Date: 11/04/2026
# This script will stop and remove all docker containers from the system do not run this script if you have any important containers that you want to keep
######################

CONTAINER_IDS=$(docker ps -a -q)

echo "Stopping and removing all containers..."

if [ -n "$CONTAINER_IDS" ]; then
    docker stop $CONTAINER_IDS
    docker rm $CONTAINER_IDS
    echo "All containers stopped and removed."
else
    echo "No containers found."
fi

docker ps -a