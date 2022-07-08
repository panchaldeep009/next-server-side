import 'reflect-metadata';

const Route = (name?: string) => <T extends { new (...args: any[]): {} }>(constructor: T): { new (...args: any[]): { routeName: string } } => {
  return class RouteClase extends constructor {
    routeName = name || constructor.name;
  };
}
 

@Route()
class SomeTestRoute {
}

//@ts-ignore
console.log((new SomeTestRoute()).routeName); 