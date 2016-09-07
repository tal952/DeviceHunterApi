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

const Metrics = mongoose.model('Metrics', new mongoose.Schema({
    _id: String,
    model: String,
    beaconId: String
}, {_id: false}));

app.use(_.get('/api/isAlive', function *() {
    this.body = "Im Alive!";
}));
app.use(_.get('/api/metrics', function *() {
    this.body = yield Metrics.find();
}));
app.use(_.get('/api/beaconWhiteList', function *() {
    this.body = [
        'd0d3fa86-ca76-45ec-9bd9-6af46bc823fd:26522:34031',
        'd0d3fa86-ca76-45ec-9bd9-6af48cc7d174:55540:55062',
        'B9407F30-F5F8-466E-AFF9-25556B57FE6D:24492:47828',
        'd0d3fa86-ca76-45ec-9bd9-6af4e9ca3442:46780:27550',
        'B9407F30-F5F8-466E-AFF9-25556B57FE6D:55998:11490',
        'd0d3fa86-ca76-45ec-9bd9-6af4d6bc627e:16078:677',
        'd0d3fa86-ca76-45ec-9bd9-6af42173cdf9:61591:42416',
        'd0d3fa86-ca76-45ec-9bd9-6af40ee8a5a8:23615:61519',
        'd0d3fa86-ca76-45ec-9bd9-6af48da8abbd:53369:26809',
        'd0d3fa86-ca76-45ec-9bd9-6af497465273:33061:34225'
    ];
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