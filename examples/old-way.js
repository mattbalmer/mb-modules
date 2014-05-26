// === common.js
ArrayUtils = (function() {
    return {
        remove: function(array, element) {
            var index = array.indexOf(element);
            if(index > -1)
                array.splice(index, 1);
            return array;
        }
    }
}());
StringUtils = (function() {
    return {
        format: function(string) {
            var args = Array.prototype.slice.call(arguments, 1);
            return string.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        }
    }
}());

// === car.js
Car = (function(StringUtils) {
    var Car = function(make, model) {
        this.make = make;
        this.model = model;
    };

    Car.prototype.identify = function() {
        return StringUtils.format("{0} {1}", this.make, this.model);
    };

    return Car;
}(StringUtils));

// === lot.js
Lot = (function(Car, ArrayUtils) {
    var Lot = function(cars) {
        this.cars = cars || [];
    };

    Lot.prototype.list = function() {
        this.cars.forEach(function(car) {
            console.log(car.identify());
        })
    };

    Lot.prototype.add = function(make, model) {
        var car = new Car(make, model);
        this.cars.push(car);
        return car;
    };

    Lot.prototype.find = function(make, model) {
        return this.cars.filter(function(car) {
            return car.make == make && car.model == model;
        })[0];
    };

    Lot.prototype.remove = function(make, model) {
        var car = this.find(make, model);
        ArrayUtils.remove(this.cars, car);
    };

    return Lot;
}(Car, ArrayUtils));

// === main.js
var lot = new Lot();
lot.add('Honda', 'Accord');
lot.add('Toyota', 'Prius');
lot.add('Ford', 'TruckThing');

lot.list();
// Honda Accord
// Toyota Prius
// Ford TruckThing

lot.remove('Toyota', 'Prius');

lot.list();
// Honda Accord
// Ford TruckThing