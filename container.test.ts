import {
  assertEquals,
  assertExists,
  assertThrows,
  fail,
} from "./vendor/https/deno.land/std/testing/asserts.ts";
import { Container } from "./container.ts";
import { forwardRef } from "./helpers/forward-ref.ts";
import { Inject } from "./decorators/inject.decorator.ts";
import { StaticMetadata } from "./metadata.ts";
import { OnModuleInit } from "./interfaces/on-module-init.ts";

Deno.test("only single instance getting created", () => {
  StaticMetadata.clear();

  class Foo {}

  const container = new Container();
  container.provider(Foo);
  container.export(Foo);
  container.boot();
  const fooOne = container.resolve(Foo);
  const fooTwo = container.resolve(Foo);

  assertExists(fooOne);
  assertExists(fooTwo);
  assertEquals(fooOne, fooTwo);
});

Deno.test("dependency injection", () => {
  StaticMetadata.clear();

  class Foo {}
  class Bar {
    @Inject(Foo)
    foo!: Foo;
  }

  const container = new Container();
  container.provider(Bar);
  container.provider(Foo);
  container.export(Bar);
  container.export(Foo);
  container.boot();

  const foo = container.resolve(Foo);
  const bar = container.resolve(Bar);

  assertExists(foo);
  assertExists(bar);
  assertEquals(bar.foo, foo);
});

Deno.test("injecting self as dependency", () => {
  StaticMetadata.clear();

  class SelfInjected {
    @Inject(forwardRef(() => SelfInjected))
    selfInjected!: SelfInjected;
  }

  const container = new Container();
  container.provider(SelfInjected);
  container.export(SelfInjected);
  container.boot();
  const selfInjectedInstantiated = container.resolve(SelfInjected);

  assertExists(selfInjectedInstantiated);
  assertEquals(selfInjectedInstantiated, selfInjectedInstantiated.selfInjected);
});

Deno.test("injecting circular dependencies", () => {
  StaticMetadata.clear();

  class Foo {
    @Inject(forwardRef(() => Bar))
    bar!: Bar;
  }
  class Bar {
    @Inject(forwardRef(() => Foo))
    foo!: Foo;
  }

  const container = new Container();
  container.provider(Foo);
  container.provider(Bar);
  container.export(Foo);
  container.export(Bar);
  container.boot();
  const foo = container.resolve(Foo);
  const bar = container.resolve(Bar);

  assertExists(foo);
  assertExists(bar);
  assertEquals(foo.bar, bar);
  assertEquals(bar.foo, foo);
});

Deno.test("access only to exported types", () => {
  StaticMetadata.clear();

  class Foo {
    @Inject(forwardRef(() => Bar))
    bar!: Bar;
  }
  class Bar {
    @Inject(forwardRef(() => Foo))
    foo!: Foo;
  }

  const container = new Container();
  container.provider(Foo);
  container.provider(Bar);
  container.export(Foo);
  container.boot();

  assertThrows(
    () => container.resolve(Bar),
    undefined,
    "needs to be exported to be used by other containers",
  );
  assertExists(container.resolve(Foo));
  assertExists(container.resolve(Foo)?.bar);
});

Deno.test("container links resolving correctly", () => {
  StaticMetadata.clear();

  class Foo {
    @Inject(forwardRef(() => Bar))
    bar!: Bar;
  }
  class Bar {
    @Inject(forwardRef(() => Foo))
    foo!: Foo;
  }
  class FooBar {
    @Inject(Foo)
    foo!: Foo;

    @Inject(Bar)
    bar!: Bar;
  }

  const container = new Container("Foo and Bar");
  container.provider(Foo);
  container.provider(Bar);
  container.export(Foo);
  container.export(Bar);
  container.boot();

  const container2 = new Container("FooBar");
  container2.link(container);
  container2.provider(FooBar);
  container2.export(FooBar);
  container2.boot();

  assertExists(container2.resolve(FooBar));
  assertExists(container2.resolve(FooBar).foo);
  assertExists(container2.resolve(FooBar).bar);
  assertEquals(container.resolve(Foo), container2.resolve(FooBar).foo);
  assertEquals(container.resolve(Bar), container2.resolve(FooBar).bar);
});

Deno.test("circular dependencies in linked containers", () => {
  StaticMetadata.clear();

  class Foo {
    @Inject(forwardRef(() => Bar))
    bar!: Bar;

    @Inject(forwardRef(() => FooBar))
    fooBar!: FooBar;
  }
  class Bar {
    @Inject(forwardRef(() => Foo))
    foo!: Foo;

    @Inject(forwardRef(() => FooBar))
    fooBar!: FooBar;
  }
  class FooBar {
    @Inject(forwardRef(() => Foo))
    foo!: Foo;

    @Inject(forwardRef(() => Bar))
    bar!: Bar;
  }

  const container = new Container("Foo and Bar");
  container.provider(Foo);
  container.provider(Bar);
  container.export(Foo);
  container.export(Bar);

  const container2 = new Container("FooBar");
  container2.provider(FooBar);
  container2.export(FooBar);

  container2.link(container);
  container.link(container2);

  container2.boot();

  assertEquals(container.resolve(Foo), container2.resolve(FooBar).foo);
  assertEquals(container.resolve(Bar), container2.resolve(FooBar).bar);
  assertEquals(container2.resolve(FooBar), container.resolve(Foo).fooBar);
  assertEquals(container2.resolve(FooBar), container.resolve(Bar).fooBar);
});

Deno.test("consumers cannot be exported", () => {
  StaticMetadata.clear();

  class Consumer {}

  const container = new Container();
  container.consumer(Consumer);
  assertThrows(
    () => container.export(Consumer),
    undefined,
    "Cannot export consumer",
  );
});

Deno.test("consumer unresolvable", () => {
  StaticMetadata.clear();

  class Consumer {}

  const container = new Container();
  container.consumer(Consumer);
  container.boot();
  assertThrows(
    () => container.resolve(Consumer),
    undefined,
    "is not marked as provider",
  );
});

Deno.test("module init function call", async () => {
  StaticMetadata.clear();
  let promiseResolveFn: () => void;
  const promise = new Promise<void>((resolve) => {
    promiseResolveFn = resolve;
  });

  class Consumer implements OnModuleInit {
    onModuleInit(): void {
      promiseResolveFn();
    }
  }

  const container = new Container();
  container.consumer(Consumer);
  container.boot();

  const i = setTimeout(fail, 1000);
  await promise;
  clearTimeout(i);
});

Deno.test("consumer gets injections", async () => {
  StaticMetadata.clear();

  let promiseResolverFn: (value: FooProvider) => void;
  const promise = new Promise<FooProvider>((resolve) => {
    promiseResolverFn = resolve;
  });

  class FooProvider {}
  class BarConsumer implements OnModuleInit {
    @Inject(forwardRef(() => FooProvider))
    private foo!: FooProvider;

    onModuleInit(): void {
      promiseResolverFn(this.foo);
    }
  }

  const container = new Container();
  container.provider(FooProvider);
  container.export(FooProvider);
  container.consumer(BarConsumer);
  container.boot();

  const foo = container.resolve(FooProvider);
  assertExists(foo);

  const i = setTimeout(fail, 1000);
  const fooInBar = await promise;
  assertEquals(foo, fooInBar);
  clearTimeout(i);
});
