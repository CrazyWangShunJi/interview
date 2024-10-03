let someValue: unknown = "Hello, TypeScript!";

// 尖括号语法
let strLength: number = (<string>someValue).length;

// as 语法
let strLength2: number = (someValue as string).length;

console.log(strLength);  // 输出: 18
console.log(strLength2); // 输出: 18
