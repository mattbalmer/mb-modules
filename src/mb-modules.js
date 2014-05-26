(function(Injector) {
    // === Module ===
    var Module = function(name, value) {
        if(!name) throw Error('Modules must be named!');

        this.name = name;
        this.value = value;
        this.modules = {};
        this.injector = new Injector(this.modules, function(source) {
            return source.value;
        });
    };
    Module.prototype.module = function(name, value) {
        var module;

        if(arguments.length > 1) {
            if(typeof value === 'function') {
                value = this.injector.inject(value);
            }

            module = new Module(name, value);
            this.modules[name] = module;
            return this;
        } else {
            return this.modules[name];
        }
    };

    // === Export ===
    if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Module;
    }
    else {
        window.mb = window.mb || {};
        window.mb.Module = Module;
    }
}(window ? mb.Injector : require('mb-injector')));
