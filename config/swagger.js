const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title:'API URL SHORTER DOCUMENTATION',
            version: '1.0.0',
            description:'Documentation of API URL SHORTER'
        },
        server:[{
            url:'http:localhost:3000'
        }],
        components:{

        }
    },
    apis:['./routes/*','./models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) =>{
    app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(specs));
};

