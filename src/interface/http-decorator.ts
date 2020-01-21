export interface RouterPart {
  httpMethod: string;
  prefix: string;
  controlPart: string;
  methodPart: string;
}

export interface HttpDecoratorInitOptions {
  prefix?: string;
}

export interface RouterInfoItem {
  method: string;
  path: string;
}

export interface HttpDecorator {

  getPrefix(): string;

  getMethods(): string[];

  getControl(): string;

  getMethodNames(): string[];

  getRouterPart(_methodName: string): RouterPart;

  getRouter(_methodName: string): RouterInfoItem;

  getRouters(): RouterInfoItem[];
}
