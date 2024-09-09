var a = 10;
var foo = {
   a: 20,
   bar: function () {
      var a = 30;
      return this.a;
   }
};

console.log(
   foo.bar(),             // ? 20
   (foo.bar)(),           // ? 20
   (foo.bar = foo.bar)(), // ? 
   (foo.bar, foo.bar)()   // ?
   );