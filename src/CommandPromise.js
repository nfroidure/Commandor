// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['./../promise/Promise'], function(Promise) {
// START: Module logic start

	// Command promise constructor
	function CommandPromise(commandor,command,view) {
		if(!(this instanceof CommandPromise))
			throw Error('Use new to intantiate !');
		Promise.call(this,function(success) {
			commandor.suscribe(view+'/'+command,function(event, params, element) {
				dispose();
				success({'event':event, 'params':params, 'element': element });
			});
			var dispose=function() {
				commandor.unsuscribe(view+'/'+command);
			};
			return dispose;
		});
		this.command=command;
	}

	CommandPromise.prototype=Object.create(Promise.prototype);

// END: Module logic end

	return CommandPromise;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='CommandPromise';
	}
	this[name.substring(name.lastIndexOf('/')+1)]=factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
