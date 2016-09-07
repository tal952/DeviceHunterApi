var devicemodels = require('./files/devicemodels.json');

function getValue(key) {
    var objects = [];
    for (var i in devicemodels) {
        if (!devicemodels.hasOwnProperty(i)) continue;
        if (typeof devicemodels[i] == 'object') {
            objects = objects.concat(getValues(devicemodels[i], key));
        } else if (i == key) {
            objects.push(devicemodels[i]);
        }
    }
    return (objects.length > 0) ? objects[0] : undefined;
}

exports.getValue = getValue;