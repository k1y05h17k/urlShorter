# urlShorter
Challenge to create a API for shorter URL`

### This NODE project was built with:
````
- NODE
- Express
- Mongoose
- MongoDB
- Bcrypt
- JWT

````

## Folders
````
├── controllers
    ├── authController.js
    ├── errorController.js
    ├── urlController.js
    ├── historyController.js
    ├── userController.js
├── models
    ├── urlModel.js
    ├── historyModel.js
    ├── userModel.js
├── routes
    ├── authRoutes.js
    ├── urlRoutes.js
    ├── historyRoutes.js
    ├── userRoutes.js
├── utils
    ├── apiFeatures.js
    ├── appError.js
    ├── catchAsync.js
apps.js
server.js
config.env
package.json  
````
## REQUEST AND RESPONSE
<details open>

<summary>[POST] /auth/signup</summary>

```json
{
    "name": "User 1",
    "email": "example@email.com",
    "password": "test"
}
```
```json
{
    "id": "f3a10cec013ab2c1380acef",
    "name": "User 1",
    "token": "Bearer JWT.Token"
}
```

</details>

<details open>
<summary>[POST] /auth/signin</summary>

```json
{
    "email": "example@email.com",
    "password": "test"
}
```
```json
{
    "id": "f3a10cec013ab2c1380acef",
    "name": "User 1",
    "token": "Bearer JWT.Token"
}
```

</details>


<details open>

<summary>[POST] /shortUrl</summary>

<p>If this user is autenticated in the system this API must record URL</p>

```json
{
    "fullUrl":"http:/teste.com"
}
```

```json
{
    "shortUrl":"https://localhost:3000/aZbKq7"
}

```
</details>

<details open>

<summary>[GET]/shortUrl/</summary>

<p>GET ALL shortUrls with of number of clicks</p>

```json
{   
    "data":[
        {
            "fullUrl": "XXXXXXX.com",
            "shorUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
        },
        {
            "fullUrl": "yyyyy.com",
            "shorUrl": "localhost:3000/2asqwe",
            "numberOfClicks":10,
            "added": "2024-05-05T19:28:13.531Z"
        }
        ],
         "total":2,
    
}
```
<details open>

<summary>[GET]/shortUrl/:shorUrl</summary>

<p>
    GET the expecific short Url
</p>

```json
{   
    "data":[
        {
            "fullUrl": "XXXXXXX.com",
            "shorUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
        }
        ],
         "total":1,
    
}
```


<details open>

<summary>[PATCH]/shortUrl/:shortUrl</summary>

<p>Update one url</p>

```json
{   
    "data":[
        {
            "fullUrl": "XXXXXXX.com",
            "shorUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
        },

        ],
         "total":1,
    
}

```
```json
{   
    "status":"Successfull",
    "data":[
        {
            "fullUrl": "XXXXXXX.com",
            "shorUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z"
        },

        ],
         "total":1,
    
}

```
</details>

<summary>[DELETE]/shortUrl/:shortUrl</summary>

<p>Delete  one url</p>


```json
{   
    "status":"Successfull",
    "data":[
        {
            "fullUrl": "XXXXXXX.com",
            "shorUrl": "localhost:3000/sasqwe",
            "numberOfClicks":2,
            "added": "2024-05-05T19:28:13.531Z",
            "deleted":"2024-05-07T19:28:13.531Z",
        },

        ],
         "total":1,
    
}

```
</details>