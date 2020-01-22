import 'reflect-metadata';
import { ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA, ROUTE_CONTROLLER_METADATA, ROUTE_URL_METADATA } from './contant/route-metadata';
import {HttpMethodEnum} from './contant/http-method';
import {HttpDecorator, HttpDecoratorInitOptions, RouterInfoItem} from './interface/http-decorator';
import * as lodash from 'lodash';

const createHttpMethodDecorator = (methodtype) => {
  return (path: string = '') => {
    return (target: any, propertyKey: string) => {
      const handlers = Reflect.getMetadata(ROUTE_HANDLE_METADATA, target) || [];
      handlers.push(propertyKey);
      Reflect.defineMetadata(ROUTE_HANDLE_METADATA, handlers, target);
      // 设置方法
      Reflect.defineMetadata(ROUTE_METHOD_METADATA, methodtype, target, propertyKey);
      // 设置路由
      Reflect.defineMetadata(ROUTE_URL_METADATA, path, target, propertyKey);
    };
  };
};

export const Get = createHttpMethodDecorator(HttpMethodEnum.GET);
export const Post = createHttpMethodDecorator(HttpMethodEnum.POST);
export const Put = createHttpMethodDecorator(HttpMethodEnum.PUT);
export const Delete = createHttpMethodDecorator(HttpMethodEnum.DELETE);

export const Control = (prefix: string = '') => {
  return (target: any) => {
    Reflect.defineMetadata(ROUTE_CONTROLLER_METADATA, prefix, target);
  };
};

export class HttpDecrator implements HttpDecorator {
  private routerPrefix: string = '';
  private target: any;
  private controlPart: string;

  constructor(_target: any, _options?: HttpDecoratorInitOptions) {
    const options = _options && lodash.isObject(_options)
      ? _options
      : {};
    this.target = _target;
    if (options.prefix && lodash.isString(options.prefix)) {
      this.routerPrefix = options.prefix;
    }
  }

  public getPrefix() {
    return this.routerPrefix || '';
  }

  public getMethods(): string[] {
    const {prototype} = this.target;
    return Reflect.getMetadata(ROUTE_HANDLE_METADATA, prototype) || [];
  }

  public getControl(): string {
    if (!this.controlPart) {
      this.controlPart = Reflect.getMetadata(ROUTE_CONTROLLER_METADATA, this.target) || '';
    }
    return this.controlPart;
  }

  public getMethodNames() {
    const {prototype} = this.target;
    const methodNames: string[] = Reflect.getMetadata(ROUTE_HANDLE_METADATA, prototype) || [];
    return methodNames;
  }

  public getRouterPart(_methodName: string) {
    // http方法
    const {prototype} = this.target;
    const prefix = this.getPrefix();
    const controlPart = this.getControl();
    const httpMethod: string = Reflect.getMetadata(ROUTE_METHOD_METADATA, prototype, _methodName);
    const methodPart: string = Reflect.getMetadata(ROUTE_URL_METADATA, prototype, _methodName) || '';
    return { httpMethod, prefix, controlPart, methodPart };
  }

  public getRouter(_methodName: string) {
    const { httpMethod, prefix, controlPart, methodPart } = this.getRouterPart(_methodName);
    const routerPath: string = [prefix, controlPart, methodPart].join('/');
    return { method: httpMethod, path: routerPath, member: _methodName };
  }

  public getRouters() {
    const methodNameArr: string[] = this.getMethodNames();
    const routerInfoArr: RouterInfoItem[] = methodNameArr.map((it) => this.getRouter(it));
    return routerInfoArr;
  }
}
