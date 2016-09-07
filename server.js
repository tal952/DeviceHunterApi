const koa = require('koa');
const _ = require('koa-route');
const app = koa();

var db = {
    tobi: { name: 'tobi', species: 'ferret' },
    loki: { name: 'loki', species: 'ferret' },
    jane: { name: 'jane', species: 'ferret' }
};

var pets = {
    list: function *(){
        var names = Object.keys(db);
        this.body = 'pets: ' + names.join(', ');
    }
};

app.use(_.get('/pets', pets.list));

app.listen(process.env.PORT || 5000);
console.log('listening on port 5000');