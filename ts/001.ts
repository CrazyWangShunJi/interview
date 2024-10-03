function zhaowa(target: Function): void {
  target.prototype.startClass = function(): void {

  }
}

function nameWrapper(target: any, key:string): void {
  Object.definedProperty(target, key, {
    
  }) 
}

// 类装饰器
@zhaowa
class Class {
  constructor() {
    // 业务逻辑
  }

  //属性装饰器
  @nameWrapper
  name: string
}