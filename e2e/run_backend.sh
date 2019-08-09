#!/usr/bin/env bash
set -e
set -u

BACKEND_SHA=$1

# we tag images with shorter SHA
BACKEND_SHORT_SHA=${BACKEND_SHA:0:7}

echo "BACKEND_SHA: ${BACKEND_SHA}";
echo "BACKEND_SHORT_SHA: ${BACKEND_SHORT_SHA}";

if [[ -z "${REGISTRY_HOST}" ]]; then
  echo "You need to provide REGISTRY_HOST env var";
  exit 1;
fi

if [[ -z "${REGISTRY_USER}" ]]; then
  echo "You need to provide REGISTRY_USER env var";
  exit 1;
fi

if [[ -z "${REGISTRY_PASS}" ]]; then
  echo "You need to provide REGISTRY_PASS env var";
  exit 1;
fi


# copy config e2e as default .env if doesnt exist
cp -n ../app/config/.env.e2e ../.env || true

echo "Cloning backend repo..."
if [[ -z "${BACKEND_DEPLOYMENT_KEY}" ]]; then
    if [ ! -d "./platform-backend" ]; then
        git clone git@github.com:Neufund/platform-backend.git
    fi

    cd ./platform-backend
    echo "resetting backend to ${BACKEND_SHA}"
    git pull
    git reset --hard ${BACKEND_SHA}
    cd ..
else
    if [ ! -d "./platform-backend" ]; then
        echo "using env variable"
        echo "${BACKEND_DEPLOYMENT_KEY}" | base64 -d > "./cert"
        chmod 600 ./cert
        ssh-agent sh -c "ssh-add ./cert && git clone git@github.com:Neufund/platform-backend.git && cd ./platform-backend && git reset --hard ${BACKEND_SHA} && git status"
    fi
fi

echo ${REGISTRY_PASS} | docker login ${REGISTRY_HOST} --username ${REGISTRY_USER} --password-stdin

echo "Running backend"
cd ./platform-backend

make docker-pull tag=dev_fixtures_${BACKEND_SHORT_SHA}
echo "Pulling images done."

make prerequisites-dev
make run-remote-dev-without-build

cd ..
echo "Backend running"
