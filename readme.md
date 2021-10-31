# Peridot

## Terminology

| Term               | Description                                                       |
|--------------------|-------------------------------------------------------------------|
| Module (Container) | Bundle of providers, consumers, and imports to provide injections |
| Provider           | Injectable element to provide functionality                       |
| Consumer           | Element that can only get injections but cannot be injected       |

## Functionality

This library is completely built around modules/containers. A module is responsible for managing instances of providers,
consumers and for injecting dependencies into these. Modules can also import other modules to fulfill the injection
requests of their consumers. Consumers and providers are isolated from other modules, but a module can export providers
to make them available for other modules. Modules only get loaded when required by others.

There's no big difference between consumers and providers, only that consumers cannot be exported or injected. There's
only one single instance of each consumer and provider during the whole runtime of the application. Future plans include
scopes so that this behavior could be customized.

The following steps will be done while booting the application:

1. Decorators will be resolved and metadata fills up.
2. The root module will boot all linked modules.
3. Each module will create a single instance of each consumer and provider.
4. Each module then will inject all dependencies into the consumer and provider.
5. The module will call `onModuleInit()` to signal that injected elements are ready to use.

Now you may ask "so I cannot use injected elements in the constructor?" - and you are right. You can't. First of all,
because I was too lazy to implement this, and handling circular dependencies this way is less pain. To execute code
after the module is ready you can use the `onModuleInit()` function from the `OnModuleInit` interface. This will ensure
that all required injections are done and safe to use.

## Simple examples

A complete example can be found in the example folder of this repo.

We will create a simple app with one module, one provider and one consumer:

```ts
import { Module, createApplication, OnModuleInit, Inject } from "./mod.ts"

// Creates a simple provider with an add function
class SimpleProvider {
  public add(a: number, b: number): number {
    return a + b;
  }
}

// Creates a simple consumer that utilizes the add function from our simple provider
class SimpleConsumer implements OnModuleInit {
  // SimpleProvider should be injected here
  @Inject(SimpleProvider)
  simpleProvider!: SimpleProvider;

  onModuleInit(): void {
    // After module was initialized, use the provider to add two numbers
    console.log("Service calculate 2 + 3 = " + this.simpleProvider.add(2, 3));
  }
}

@Module({
  // Tell the module that it has one provider and one consumer that it should satisfy
  providers: [SimpleProvider],
  consumers: [SimpleConsumer],
})
class SimpleModule {
}

// Boot application
createApplication(SimpleModule);
```

In the next example, we will import service from another module

```ts
import { Module, createApplication, OnModuleInit, Inject } from "./mod.ts"

// Creates a simple math provider
class MathProvider {
  public add(a: number, b: number): number {
    return a + b;
  }

  public multiply(a: number, b: number): number {
    return a * b;
  }
}

@Module({
  providers: [MathProvider],
  // This line is important
  // It tells the module that it can serve the MathProvider for other modules to use
  exports: [MathProvider],
})
class MathModule {
}

class SimpleConsumer implements OnModuleInit {
  // Utilizes MathProvider from MathModule
  @Inject(MathProvider)
  mathProvider!: MathProvider;

  onModuleInit(): void {
    console.log("Service calculate 2 + 3 = " + this.mathProvider.add(2, 3));
    console.log("Service calculate 2 * 3 = " + this.mathProvider.multiply(2, 3));
  }
}

@Module({
  consumers: [SimpleConsumer],
  // Imports MathModule so that this module can inject MathProvider to its consumers
  imports: [MathModule],
})
class SimpleModule {
}

createApplication(SimpleModule);
```

> More examples will be added in the future

## Circular dependencies

To resolve circular dependencies we have to trick the typescript compiler a little bit by
passing `forwardRef(() => ProviderClass)` as parameter for `Inject()`. `forwardRef()` can also be used to resolve
circular module dependencies by passing `forwardRef(() => ModuleClass)` as parameter into the imports. Note, you need to
use `forwardRef()` on both sides.

> Example will be added in the future

## Logging

You can change the log level by setting the "LOG_LEVEL" environment variable. Valid values are:

- OFF
- CRITICAL
- ERROR
- WARNING
- INFO
- DEBUG

The logger's default is INFO. Logging can slow down your application. When deploying your app set it to CRITICAL or
ERROR.
