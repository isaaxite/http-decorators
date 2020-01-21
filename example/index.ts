import { Control, HttpDecrator, Get, Put } from '../src/index';

@Control('foo')
class Foo {
  private name: string;

  @Get('name')
  getName() {
    return this.name;
  }

  @Put('name')
  setName(_name: string) {
    this.name = _name;
  }
}

const httpDecrator = new HttpDecrator(Foo, { prefix: '/api' });

const routerArr = httpDecrator.getRouters();

console.log(routerArr);
