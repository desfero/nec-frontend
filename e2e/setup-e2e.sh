#!/usr/bin/env bash
set -e
set -u
set -m
cd "$(dirname "$0")"

frontend_pid=0
run_frontend() {
    echo "Starting up local http server"
    ../scripts/prod-like-srv.sh&
    frontend_pid=$!
    sudo renice -n -19 $frontend_pid
    echo "Frontend running"
}

if lsof -Pi :5001 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started backend..."
else
    node ./run-backend.js;
fi

echo "sleeping to spin up containers"
sleep 90

if lsof -Pi :9090 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started frontend..."
else
    echo "Starting up frontend..."
    run_frontend
fi

yarn test:e2e:cypress:record&
sudo renice -n -19 $!
fg

if [[ $frontend_pid -ne 0 ]]; then
    echo "Killing frontend server..."
    kill -9 $frontend_pid
fi
