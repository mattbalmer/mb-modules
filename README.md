# mb-modules

Super-lightweight module system for JavaScript.

Allows for encapsulated, module-style creation of variables and functionality using dependency injection.

## Usage

(Optional) Assign `Module` to `mb.Module` for easier use.

    window.Module = mb.Module;

Create the primary/top-level module.

    var app = new Module('App')

To create child modules, call `.module(name, value)` from your primary module

    app.module('MathUtils', {
        sum: function(a, b) {
            return a + b;
        }
    });

Taking advantage of the dependency injection is quite easy and useful. Simply pass a function as the second argument, where the parameter names are names of other modules.

    app.module('Main', function(MathUtils) {
        // 4
        console.log( MathUtils.sum(2, 2) );
    });

### Child Modules

If you need to retrieve a module, don't pass a second argument.

    app.module('Main');

This can be useful in defining sub-modules.

    // Assuming the 'Utils' module was already defined...
    app.module('Utils').module('Strings', {
        capitalize: function(str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
        }
    });

Be careful - dependency injection will only work on sibling modules. Values cannot be injected to child modules.

    app.module('Utils').module('Strings', function(MathUtils) {
        // Error: mb.Injector: 'MathUtils' does not exist on the source object!
    });

### Chaining

Multiple modules can be defined at once by chaining their definitions together:

    app.module('MathUtils', {
        sum: function(a, b) {
            return a + b;
        }
    }).module('StringUtils', {
        capitalize: function(str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
        }
    });
