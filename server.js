const express = require("express");
const app = express();

const fetch = require("node-fetch");
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const errorpg=path.join(__dirname,"./views/404.html")
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    let sendData = { temp: "Temp", country:"" , disc: "Discription", location: "Location", humidity: "Humidity ", feel: "Feel ", speed: "Speed" };
    res.render("index", { sendData: sendData,});
});

app.post("/", async (req, res) => 
{
    try 
    {
        const location = await req.body.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        const temp = Math.floor(data.main.temp);
        const disc = data.weather[0].description;
        let sendData = {};
        sendData.temp=temp;
        sendData.disc=disc;
        sendData.location = location;
        sendData.feel = data.main.feels_like;
        sendData.humidity = data.main.humidity;
        const speed=Math.floor(data.wind.speed *1.609344);
        sendData.speed = speed;
        sendData.country=data.sys.country;
        sendData.sealevel=data.main.sea_level;
        
       res.render("index", { sendData: sendData,});
    } 
    catch (err) 
    {
        console.log(err);
        res.status(404).sendFile(errorpg);
    }
});

app.listen(port, () => {
    console.log("Server is running....");
});