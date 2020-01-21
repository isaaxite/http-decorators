# http-decorators

This project is a typescript library. It will provide some common HTTP method decorators, such as `@Control()`, `@Get()`, `@post()`, `@Delete()`, `@Put()`. For details, please refer to the declaration file. We can use these decorators to combine routes as gracefully as a [typeorm](https://github.com/typeorm/typeorm).

## Install

```shell
npm i http-decorators
```

## Usage

```typescript
import { Control, HttpDecrator, Get, Put } from 'http-decorators';

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
```
```
# output

[
  { method: 'get', path: '/api/foo/name' },
  { method: 'put', path: '/api/foo/name' }
]
```

## Contributing

Feel free to dive in! [Open an issue](https://github.com/isaaxite/http-decorators/issues) or submit PRs.

## License

[MIT](https://github.com/isaaxite/http-decorators/blob/master/LICENSE) © Richard McRichface


