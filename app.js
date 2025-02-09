if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const port = 8080;
const mongoUrl = process.env.ATLASDB_URL
const  expressError  = require('./utils/ExpressErrors.js');
const  wrapAsync  = require('./utils/wrapAsync.js');
const mongoose = require('mongoose');
const { Feedback } = require('./models/feedback.js');
const { Dustbin } = require('./models/dustbin.js');
const { validateFeedback } = require('./middleware.js');
let readapi = `https://api.thingspeak.com/channels/2820616/feeds.json?api_key=${process.env.IOT_API}&results=2`;
let accessToken = process.env.ACCESS_TOKEN;
const reversegeoapi = `https://us1.locationiq.com/v1/reverse?key=${accessToken}`;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
let reverseGeocode = wrapAsync(async() => {
    const allDustbins = await Dustbin.find({});
    for (let dustbin of allDustbins) {
        let data = await fetch(`${reversegeoapi}&lat=${dustbin.latitude}&lon=${dustbin.longitude}&format=json`);
        data = await data.json();
        let address = data.address;
        data = data.display_name;
        let index = data.indexOf(',');
        dustbin.location = data.substring(0, index);
        dustbin.address = Object.values(address).join(",");
        await dustbin.save();
}
})
reverseGeocode();
async function main() {
    await mongoose.connect(mongoUrl);
}
main().then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err)=>{
        console.log(err);
    });
app.get('/', (req, res) => {
    res.render('waste/home.ejs');
});
app.get('/dashboard', wrapAsync(async (req, res) => {
    const response = await fetch(readapi);
    let iotData = await response.json();
    console.log('IOT Data:');
    console.log(iotData);
    let oldData =await Dustbin.findOne({ iotId: iotData.channel.id});
    console.log(`Old data: ${oldData}`);
    oldData.latitude = iotData.channel.latitude;
    oldData.longitude = iotData.channel.longitude;
    let data = await fetch(`${reversegeoapi}&lat=${iotData.channel.latitude}&lon=${iotData.channel.longitude}&format=json`);
    data = await data.json();
    let address = data.address;
    oldData.address = Object.values(address).join(",");
    data = data.display_name;
        let index = data.indexOf(',');
    oldData.location = data.substring(0, index);
    let newDate = iotData.feeds[iotData.feeds.length - 1].created_at;
    newDate = newDate.substring(0, newDate.indexOf('T'));
    newDate = new Date(newDate);
    if (oldData) {
        if (oldData.updatedAt.getUTCFullYear() === newDate.getUTCFullYear() && oldData.updatedAt.getUTCMonth() === newDate.getUTCMonth() && oldData.updatedAt.getUTCDate() === newDate.getUTCDate()) {
            console.log("Same day data updated");
            oldData.filled[oldData.filled.length - 1] = iotData.feeds[iotData.feeds.length - 1].field1;
        }
        else {
            console.log("New day data added");
            oldData.filled.shift();
            oldData.filled.push(iotData.feeds[iotData.feeds.length - 1].field1);
        }
    }
    oldData.updatedAt = new Date(iotData.feeds[iotData.feeds.length - 1].created_at);
    await oldData.save();
    console.log(`Updated data: ${oldData}`);
    const allDustbins = await Dustbin.find({}); 
    res.render('waste/dash.ejs',{allDustbins});
}));
app.get('/dustbin/:id', wrapAsync(async (req, res) => {
    let dustbin = await Dustbin.findById(req.params.id);
    res.render('waste/show.ejs',{dustbin});
}));
app.get('/feedback', (req, res) => {
    res.render('waste/feedback.ejs')
});
app.post('/feedback',validateFeedback, wrapAsync(async(req, res) => {
    let { name, rating, feedback } = req.body;
    const newFeedback = new Feedback({ name, rating, feedback });
    const { id } = await newFeedback.save();
   /* res.redirect(`/feedback/${id}`);*/
    res.render('waste/thankyou.ejs');
}));
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("waste/error.ejs", { message });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});