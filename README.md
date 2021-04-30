
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

//Each service is one requirement in thhe homework in the api/services