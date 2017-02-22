console.log('Design Patterns Boilerplate'); console.log('');
console.log('Module Pattern');
/**
 * Module Pattern
 * 
 */
var module = (function () {
 
  // A private counter variable
  var _myPrivateVar = 0;
  // A private function which logs any arguments
  var _myPrivateMethod = function(foo) {
    console.log(foo);
  };

  var myPublicVar = myPublicVar;
  var myPublicFunction = myPublicFunction;
 
  return {
    // A public variable
    myPublicVar: 'I am a public var',

    // A public function utilizing privates
    myPublicFunction: function(bar) {
      // Increment our private counter
      _myPrivateVar++;
      // Call our private method using bar
      _myPrivateMethod(bar);
      return _myPrivateVar;
    }

  };
})();

//module.myPublicFunction('hej');
console.log(module.myPublicFunction('hej'));
console.log(module.myPublicVar);
console.log('');

console.log('Revealing Module Pattern');
/**
 * Revealing Module Pattern
 * 
 */
var myRevealingModule = (function () {
 
    var _privateVar = 'Private Name';
    var publicVar = 'Hey there! Im a public var!';

    var _privateFunction = function() {
        console.log( 'Name: ' + _privateVar );
    };

    var setName = function(strName) {
        _privateVar = strName;
    };

    var getName = function() {
        _privateFunction();
    };

    // Reveal public pointers to
    // private functions and properties

    return {
        setName: setName,
        greeting: publicVar,
        getName: getName
    };
 
})();
 
myRevealingModule.setName( 'Attila' );
myRevealingModule.getName();
console.log(myRevealingModule.greeting); console.log('');