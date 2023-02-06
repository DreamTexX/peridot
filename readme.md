# Peridot

> WARNING: This readme currently is outdated. Please see [examples](examples/) for some working code.

## Terminology

| Term               | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| Module (Container) | Bundle of providers, consumers, and imports to provide injections |
| Provider           | Injectable element to provide functionality                       |
| Consumer           | Element that can only get injections but cannot be injected       |

## Functionality

This library is completely built around modules/containers. A module is
responsible for managing instances of providers, consumers and for injecting
dependencies into these. Modules can also import other modules to fulfill the
injection requests of their consumers. Consumers and providers are isolated from
other modules, but a module can export providers to make them available for
other modules. Modules only get loaded when required by others.

There's no big difference between consumers and providers, only that consumers
cannot be exported or injected. There's only one single instance of each
consumer and provider during the whole runtime of the application. Future plans
include scopes so that this behavior could be customized.

The following steps will be done while booting the application:

1. Decorators will be resolved and metadata fills up.
2. An application instance is being created
3. The application will boot the root module and all linked modules.
4. Each module will create a single instance of each consumer and provider.
5. Each module then will inject all dependencies into the consumer and provider.

Most of these steps will execute hooks. You will read more on hooks later on.

Now you may ask "so I cannot use injected elements in the constructor?" - and
you are right. You can't. First of all, because I was too lazy to implement
this, and handling circular dependencies this way is less pain. To execute code
after the module is ready you ~~can use the `onModuleInit()` function from the
`OnModuleInit` interface. This will ensure that all required injections are done
and safe to use.~~ must use hooks. A hook decorator is available for this.
Currently hooks are a bit complicated, so read the dedicated section!
`OnModuleInit` will be deprecated and removed soon!

## Application

## Hooks

There are three ways to register hooks. The most important one is by using the
`@Hook(filter: HookFilter)` decorator:

```ts
// Register a hook in a consumer/provider
class ProviderOrConsumer {
  @Hook({/*filter*/})
  public yourCoolHookFunction(data: HookData | undefined) {
  }
}
```

You can also register hooks directly in your application:

```ts
const app = new Application(class EmptyModule {});
app.hook({ application: app, scope: 'post' }, (data: HookData) => {
  Logger.info('Application started');
});
```

Hooks will always be **executed before or after an initialization action**. With
initialization action, the process of booting containers, creating instances of
consumers or providers is meant. For example, before an instance of a provider
is created, a hook is executed. After this provider is hydrated with all its
dependencies ("ready initialized") another hook is executed. Before and after a
module (container) is booted, hooks get executed. Before and after the
application is booted, hooks are executed.

### Filters

When taking a look at the filters it does seem a bit complicated, and it is. Or
not idk. You have four criteria: application, container, type and scope.

<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">application</td>
      <td>application instance</td>
      <td>Hook will only get executed if application value matches provided application</td>
    </tr>
    <tr>
      <td><code>'*'</code></td>
      <td>Hook gets executed regardless the application value</td>
    </tr>
    <tr>
      <td><code>undefined</code></td>
      <td>Hook only gets executed when no application is provided</td>
    </tr>
    <tr>
      <td rowspan="3">container</td>
      <td>container instance</td>
      <td>Hook will only get executed if container value matches provided container</td>
    </tr>
    <tr>
      <td><code>'*'</code></td>
      <td>Hook gets executed regardless the container value</td>
    </tr>
    <tr>
      <td><code>undefined</code></td>
      <td>Hook only gets executed when no container is provided</td>
    </tr>
    <tr>
      <td rowspan="5">type</td>
      <td>some raw provider/consumer class</td>
      <td>Hook will only get executed if type value matches provided type</td>
    </tr>
    <tr>
      <td><code>'*'</code></td>
      <td>Hook gets executed regardless the type value</td>
    </tr>
    <tr>
      <td><code>undefined</code></td>
      <td>Hook only gets executed when no type is provided</td>
    </tr>
    <tr>
      <td><code>'provider'</code></td>
      <td>Hook only gets executed when type is a provider</td>
    </tr>
    <tr>
      <td><code>'consumer'</code></td>
      <td>Hook only gets executed when type is a consumer</td>
    </tr>
    <tr>
      <td rowspan="3">scope</td>
      <td><code>'pre'</code></td>
      <td>Hook gets executed on pre-initialization events (before a container is booted, an instance is created or the application is booted)</td>
    </tr>
    <tr>
      <td><code>'post'</code></td>
      <td>Hook gets executed on after-initialization events (after a container is booted, an instance is created or the application is booted)</td>
    </tr>
    <tr>
      <td><code>'*'</code></td>
      <td>Hook gets executed regardless the scope value</td>
    </tr>
  </tbody>
</table>

### Examples

> Example will be added in the future

## Complete examples

> WARNING: The following examples are outdated, please take a look at the
> examples folder for more recent (and working) examples!

A complete example can be found in the example folder of this repo.

We will create a simple app with one module, one provider and one consumer:

```ts
import { createApplication, Inject, Module, OnModuleInit } from './mod.ts';

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
    console.log('Service calculate 2 + 3 = ' + this.simpleProvider.add(2, 3));
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
import { createApplication, Inject, Module, OnModuleInit } from './mod.ts';

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
    console.log('Service calculate 2 + 3 = ' + this.mathProvider.add(2, 3));
    console.log(
      'Service calculate 2 * 3 = ' + this.mathProvider.multiply(2, 3),
    );
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

To resolve circular dependencies we have to trick the typescript compiler a
little bit by passing `forwardRef(() => ProviderClass)` as parameter for
`Inject()`. `forwardRef()` can also be used to resolve circular module
dependencies by passing `forwardRef(() => ModuleClass)` as parameter into the
imports. Note, you need to use `forwardRef()` on both sides.

> Example will be added in the future

## Logging

You can change the log level by setting the "LOG_LEVEL" environment variable.
Valid values are:

- OFF
- CRITICAL
- ERROR
- WARNING
- INFO
- DEBUG

The logger's default is INFO. Logging can slow down your application. When
deploying your app set it to CRITICAL or ERROR.

<!--

## Scope proposal

Each consumer/provider should be able to define their scope. Scopes can be:

- GLOBAL: there is only one instance of this provider/consumer the whole
  runtime.
- CONTEXT: there will be a single instance of a provider/consumer per context. A
  "context" could be a simple string like a request id. Problems:
  - What if you use a context scoped type in an global type, should this be
    disallowed?
  - Add an "resolver" for context scoped modules when used in global modules?
    Like
    `@Inject(ContextScopedType) contextScopedType: Resolver<ContextScopedType>`
    with usage like `contextScopedType.resolve()` or `contextScopedType()`
    (resolver function)?
  - Context scoped modules would be very limited, hooks would not work as there
    is no "context" around hooks, so there would be no instance
  - bubble up? If some type depends on an context scoped type should it automatically get a context scoped type to?

-->
