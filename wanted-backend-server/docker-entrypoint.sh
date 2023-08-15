echo "wait db server"
dockerize -wait tcp://db-server:3306 -timeout 20s

echo "start node server"
nodemon index.js