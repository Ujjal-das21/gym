const app= require('./app');

const dotenv = require('dotenv');

process.on('uncaughtException',err=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting Down the server due to uncaughtException`);
    
        process.exit(1);
 
    
})

//config
dotenv.config({path:'backend/config/config.env'});
const cloudinary = require('cloudinary')
const connectDatabse=require('./config/database');
//Connecting to database
connectDatabse();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
const server=app.listen(process.env.PORT,()=>{

    console.log(`Server is running on http://localhost:${process.env.PORT} `)
});

//unhandled Promise Rejection

process.on("unhandledRejection",err=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting Down the server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
    
})