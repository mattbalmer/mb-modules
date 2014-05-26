describe('Module', function() {
    var Module;

    beforeEach(function() {
        Module = window.mb.Module;
    });

    it('should exist', function() {
        expect(Module).toEqual(jasmine.any(Function));
    });

    describe('constructor', function() {
        var name = 'module-name';

        it('should assign a name from the first argument', function() {
            var module = new Module(name);

            expect(module.name).toEqual(name);
        });

        it('should throw an exception if a name is not given', function() {
            expect(function() {
                new Module();
            }).toThrowError('Modules must be named!');
        });

        it('should create an empty object called modules on the instance', function() {
            var module = new Module(name);

            expect(module.modules).toEqual({});
        });

        it('should assign a value from the second argument', function() {
            var value = 'VALUE';
            var module = new Module(name, value);

            expect(module.value).toEqual(value);
        });
    });

    describe('module()', function() {
        var mod;

        beforeEach(function() {
            mod = new Module('module-name');
        });

        it('should exist', function() {
            expect(Module.prototype.module).toEqual(jasmine.any(Function));
            expect(mod.module).toEqual(jasmine.any(Function));
        });

        it('should execute function values immediately', function() {
            var spy = spyOn(console, 'log')
                , value = 'Im inside the main function!';

            mod.module('main', function(){
                console.log(value);
            });

            expect(spy).toHaveBeenCalledWith(value);
        });

        describe('module creation (2 arguments)', function() {
            it('should return the parent module, so that chaining may happen', function() {
                var result = mod.module('sub-module', {});

                expect(result).toBe(mod);
            });

            it('should add modules created this way to the module object', function() {
                var name = 'new-mod-123';

                mod.module(name);
                var newmod = mod.module(name);

                expect(mod.modules[name]).toBe(newmod);
            });

            it('should pass along the value', function() {
                var name = 'new-mod-123',
                    value = {
                        foo: 'bar'
                    };
                mod.module(name, value);
                var newmod = mod.module(name);

                expect(newmod).toBe(mod.modules[name]);
                expect(newmod.value).toBe(value);
            });

            it('should store the result of functions as value, instead of the actual functions', function() {
                var name = 'new-mod-123',
                    value = 'the return value!';

                var newmod = mod.module(name, function(){
                    return value;
                }).module(name);

                expect(newmod.value).toBe(value);
            });
        });

        describe('module retrieval (1 argument)', function() {
            it('should return a module with the given name', function() {
                mod.module('sub-module', {});
                var result = mod.module('sub-module');

                expect(result).toEqual(jasmine.any(Module));
                expect(result.name).toEqual('sub-module');
            });

            it('should recreate modules of the same name', function() {
                mod.module('mod-a', {
                    foo: 'bar'
                });
                mod.module('mod-a', {
                    bar: 'foo'
                });

                var module = mod.module('mod-a');

                expect(module.value.bar).toBe('foo');
                expect(module.value.foo).not.toBeDefined();
            });
        });

        describe('injection', function() {
            it('should store an injector on the module when it is created (where source is mod.modules)', function() {
                var Utils = {
                    sum: function(a, b) {
                        return a + b;
                    }
                };
                var module = mod.module('Utils', Utils);

                expect(module.injector).toEqual(jasmine.any(mb.Injector));
                expect(mod.injector.sources).toBe(mod.modules);
            });

            it('should inject values from modules at the same level into function values', function() {
                var UtilsObj = {
                    sum: function(a, b) {
                        return a + b;
                    }
                };
                mod.module('Utils', UtilsObj);

                mod.module('App', function(Utils) {
                    expect(Utils).toBe(UtilsObj);
                });
            });
        });
    });
});