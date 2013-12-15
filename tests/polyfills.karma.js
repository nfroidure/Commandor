// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define([], function() {
// START: Module logic start

	// Bind polyfill : from MDN
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
		  if (typeof this !== "function") {
		    // closest thing possible to the ECMAScript 5 internal IsCallable function
		    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		  }

		  var aArgs = Array.prototype.slice.call(arguments, 1), 
		      fToBind = this, 
		      fNOP = function () {},
		      fBound = function () {
		        return fToBind.apply(this instanceof fNOP && oThis
		                               ? this
		                               : oThis,
		                             aArgs.concat(Array.prototype.slice.call(arguments)));
		      };

		  fNOP.prototype = this.prototype;
		  fBound.prototype = new fNOP();

		  return fBound;
		};
	}

// END: Module logic end

	return null;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='Polyfills';
	}
	this[name.substring(name.lastIndexOf('/')+1)]=factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
