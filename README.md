# urlShorter
Challenge to create a API for shorter URL`

## Features

- Shorten any URL
- Redirect to original URLs
- User authentication and registration
- Track URL usage and clicks
- Protect routes for authenticated user


### This NODE project was built with:

- NODE
- Express
- Mongoose
- MongoDB
- Bcrypt
- JWT


## Folders
````
├── controllers
    ├── authController.js
    ├── errorController.js
    ├── urlController.js
    ├── userController.js
├── models
    ├── urlModel.js
    ├── userModel.js
├── routes
    ├── authRoutes.js
    ├── urlRoutes.js
    ├── userRoutes.js
├── utils
    ├── appError.js
    ├── catchAsync.js
apps.js
server.js
config.env
package.json  
````

## Getting Started

These instructions will help you set and run the project on your local machine for development and testing purposes

### Install the dependencies


```node
npm install
```

 ### Run the Application

 <p>To start the server, run! </p>

```node
npm start
```
The API wil be available at `http://localhost:3000`

## API Endpoints

Here are the main endpoints available in the API:

### Authentication
<details open>

<summary>[POST] /auth/signup: Register a new user</summary>

- Request Body:

```json
{
    "name": "User 1",
    "email": "example@email.com",
    "password": "test",
    "confirmPassword":"text"
}
```

- Response

```json
"status": "success",
"token": "Bearer JWT.Token",
"data":{
    "id": "f3a10cec013ab2c1380acef",
    "name": "User 1",
}
```

</details>

<details open>
<summary>[POST] /auth/signin</summary>

<p>To login in API use credential bellow</p>

- Request Body

```json
  "status": "success",
  "token": "jwt_token_here",
  {
    "email": "example@email.com",
    "password": "test"
  }
```
- Response

```json
  {
    "status": "success",
    "token": "Bearer JWT.Token",
    "data": {
        "user": {
            "_id": "666c7fe1838f079c575af6d5",
            "name": "teste K",
            "email": "kiyoshi@teste.com",
        }
    }
}
```

</details>


### URL Shorter

<details open>

<summary>[POST] /shortenUrl</summary>

<p>If this user is authenticated in the system this API must record the URL</p>

- Request Body

```json
{
    "originalUrl":"https:/teste.com"
}
```

- Response

```json
{
"status":"success",    
"data":{
        "originalUrl":"https://www.teste.com",
        "shortUrl":"http://localhost:3000/aZbKq7"
}
}
```
</details>

<details open>

<summary>[GET]/api/v1/urls/:code</summary>

<p>Return list of URL with the number of clicks</p>

- Response

```json
{   
    "data":[
        {
            "originalUrl": "XXXXXXX.com",
            "shortUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
        },
        {
            "originalUrl": "yyyyy.com",
            "shortUrl": "localhost:3000/2asqwe",
            "numberOfClicks":10,
            "added": "2024-05-05T19:28:13.531Z"
        }
        ],
         "total":2,
    
}
```
<details open>

<summary>[GET]/api/v1/urls/:urlCode</summary>

<p>GET a specific short Url</p>

```json
{   
    "data":{
            "originalUrl": "XXXXXXX.com",
            "shortUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
            }
         "total":1,
    
}
```


<details open>

<summary>[PATCH]/api/v1/urls:shortUrl</summary>

<p>Update an url</p>

```json
{   
    "originalUrl": "XXXXXXX.com",

}

```
```json
{
    "status": "success",
    "data": {
        "originalUrl": "XXXXXXX.com",
        "shortUrl": "http://localhost:3000/Ki__Uq",
        "clicks": 10,
        "createAt": "2024-06-16T00:42:41.215Z",
        "updateAt": "2024-06-16T16:46:13.312Z"
    }
}

```
</details>

<summary>[DELETE]/api/v1/urls:shortUrl</summary>

<p>Delete an url, keeping the entry in the database with the deletion date </p>


```json
{   
    "status":"Success",
    "data":
        {
            "originalUrl": "XXXXXXX.com",
            "shortUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "createAt": "2024-05-05T19:28:13.531Z",
            "deleteAt":"2024-05-07T19:28:13.531Z",
        },
         "total":1,
    
}

```
</details>