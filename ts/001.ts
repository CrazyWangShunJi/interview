function Log(target: any, propertyKey: string) {
  console.log(`Property ${propertyKey} is created.`);
}

class Person {
  @Log
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// 输出: Property name is created.
const person = new Person("Alice");
