# get information about the running neo4j instance
curl --header "Authorization: 'Basic bmVvNGo6YWRtaW4='" http://localhost:7474/db/data/

curl --header "Authorization: 'Basic bmVvNGo6YWRtaW4='" http://localhost:7474/db/data/node

curl -v -H "Authorization: 'Basic bmVvNGo6YWRtaW4='" -H "Accept: application/json; charset=UTF-8" -H "Content-Type: application/json" --data "@params.json" -XPOST http://localhost:7474/db/data/transaction/commit