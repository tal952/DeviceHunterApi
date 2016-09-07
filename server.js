const mongoose = require('mongoose');
const koa = require('koa');
const _ = require('koa-route');
const body = require('koa-parse-json');
const app = koa();
const serve = require('koa-static');
const findInJson = require('./findInJson');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.PROD_MONGODB || 'mongodb://localhost:27017');

app.use(body());

const distanceFromBeacon = new mongoose.Schema({_id: String, distance: Number}, {_id: false});

const Metrics = mongoose.model('Metrics', new mongoose.Schema({
    _id: String,
    model: String,
    distanceFromBeacon: distanceFromBeacon
}, {_id: false}));

app.use(_.get('/api/isAlive', function *() {
    this.body = "Im Alive!";
}));
app.use(_.get('/api/metrics', function *() {
    this.body = yield Metrics.find();
}));
app.use(_.post('/api/metrics/:id', function *(id) {
    const body = this.request.body;
    body.model = findInJson.getValue(body.model) || body.model;

    const newMetric = new Metrics(this.request.body);
    newMetric._id = id;
    yield Metrics.update({_id: id}, newMetric, {upsert: true});
    this.response.status = 200;
}));
app.use(serve(__dirname + '/client/dis'));

app.listen(process.env.PORT || 5000);
console.log('listening on port 5000');