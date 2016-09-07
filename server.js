const mongoose = require('mongoose');
const koa = require('koa');
const _ = require('koa-route');
const body = require('koa-parse-json');
const app = koa();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.PROD_MONGODB||'mongodb://localhost:27017');

app.use(body());

var Metrics = mongoose.model('Metrics', new mongoose.Schema({
    _id: String,
    Model:String,
    NearestBeaconId:String,
}, { _id: false }));

app.use(_.get('/api/isAlive', function *(){
}));
app.use(_.get('/api/metrics', function *(){
    this.body = yield Metrics.find();
}));
app.use(_.post('/api/metrics/:id', function *(id){
    const newMetric = new Metrics(this.request.body);
    newMetric._id = id;
    yield Metrics.update({ _id: id },newMetric,{upsert: true});
}));

app.listen(process.env.PORT || 5000);
console.log('listening on port 5000');