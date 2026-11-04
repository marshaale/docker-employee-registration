!#/bin/bash

######################
# Author: Marshaale
# Date: 11/04/2026
# This script will remove all docker images from the system do not run this script if you have any important images that you want to keep
######################

IMAGE_IDS=$(docker images -q)

echo "Removing all images..."

if [ -n "$IMAGE_IDS" ]; then
    docker rmi $IMAGE_IDS
    echo "All images removed."
else
    echo "No images found."
fi

docker images