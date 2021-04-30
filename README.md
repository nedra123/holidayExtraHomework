
# Install

Install hapi

```
npm install @hapi/hapi 
```


Install pm2 

```
npm install pm2@latest -g

```

Then install all the dependencies of the project

```
yarn
```

and then lift the server 

```
 pm2 start ecosystem.json && pm2 logs
```

to run tests

```
yarn test 
```


```
I used mongodb as database please make use that mongodb is installed 
```


# Endpoints with postman

```
POST http://0.0.0.0:3002/addUser
```

curl -X POST \
  http://0.0.0.0:3002/addUser \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 1d35ba7f-d658-47a3-9931-ceb40de008c5' \
  -H 'cache-control: no-cache' \
  -H 'x-api-key: happi' \
  -d '{
  
   "givenName": "nedraaooo",
   "familyName": "ayrisddsdsds"
  
}'

```
Add a proper _id to the following urls after adding a user
```

```
GET http://0.0.0.0:3002/getUser/{_id}
```
curl -X GET \
  http://0.0.0.0:3002/getUser/{_id} \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 278bc484-4eb6-4a11-a95b-feaa0ad04b7c' \
  -H 'cache-control: no-cache' \
  -H 'x-api-key: happi'

```
DELETE http://0.0.0.0:3002/deleteUser/{_id}
```

curl -X DELETE \
  http://0.0.0.0:3002/deleteUser/608b2fb7404a618371434785 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 963bf780-26a1-4176-84a9-f08b2dc81db3' \
  -H 'cache-control: no-cache' \
  -H 'x-api-key: happi'

```
PUT http://0.0.0.0:3002/updateUser/{_id}
```

curl -X PUT \
  http://0.0.0.0:3002/updateUser/608b2fb7404a618371434785 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: b2ac8b69-c1ac-4475-a9dd-fd4af83aeb44' \
  -H 'cache-control: no-cache' \
  -H 'x-api-key: happi' \
  -d '{
  
   "givenName": "nedraaooo"
  
}'
