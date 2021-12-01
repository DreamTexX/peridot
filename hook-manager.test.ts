import { Application } from './application.ts';
import { Container } from './container.ts';
import { HookManager } from './hook-manager.ts';

const application = new Application(class {});
const container = new Container();
class Type {}

//TODO(@DreamTexX): Writ tests, but it seems to work lol

Deno.test('hook filtering', () => {
  const hookManager = new HookManager();
  //Accept all:
  hookManager.subscribe({}, () => {
    console.log('I get called always');
  });
  //Accept only specific application:
  hookManager.subscribe({ application: application }, () => {
    console.log(
      'I get only called if there is an application that equals my parameter',
    );
  });
  //Accept only specific container:
  hookManager.subscribe({ container: container }, () => {
    console.log(
      'I get only called if there is a container that equals my parameter',
    );
  });
  //Accept only specific type:
  hookManager.subscribe({ type: Type }, () => {
    console.log(
      'I get only called ith there is a type that equals my parameter',
    );
  });
  //Accept only specific scope pre:
  hookManager.subscribe({ scope: 'pre' }, () => {
    console.log('I get only called if the scope is pre');
  });
  //Accept only specific scope post:
  hookManager.subscribe({ scope: 'post' }, () => {
    console.log('I get only called if the scope is post');
  });

  //Filter for app, container and type
  hookManager.subscribe({
    application: application,
    container: container,
    type: Type,
  }, () => {
    console.log('I get only called if application, container and type matches');
  });

  hookManager.execute({
    container: container,
    type: class {},
    scope: 'pre',
  });
});
