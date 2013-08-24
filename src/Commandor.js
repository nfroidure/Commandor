// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define([], function() {
// START: Module logic start

	// Commandor constructor : rootElement is the element
	// from wich we capture commands
	var Commandor=function Commandor(rootElement) {
		if(!rootElement) {
			throw Error('No rootElement given');
		}
		// Commands hashmap
		this.commands={};
		// keeping a reference to the rootElement
		this.rootElement=rootElement;
		// MS Pointer events : should unify pointers, but... read and see by yourself. 
		if(!!('onmsgesturechange' in window)) {
			// event listeners for buttons
			(function() {
				var curElement=null;
				this.rootElement.addEventListener('MSPointerDown', function(event) {
				console.log(event.type,event);
					curElement=this.findButton(event.target)||this.findForm(event.target);
					curElement&&event.preventDefault()||event.stopPropagation();
				}.bind(this),true);
				this.rootElement.addEventListener('MSPointerUp', function(event) {
					if(curElement) {
						if(curElement===this.findButton(event.target)) {
							this.captureButton(event);
						} else if(curElement===this.findForm(event.target)) {
							this.captureForm(event);
						}
						event.preventDefault(); event.stopPropagation();
						curElement=null;
					}
				}.bind(this),true);
			}).call(this);
			// fucking IE10 bug : it doesn't cancel click event
			// when gesture events are cancelled
			this.rootElement.addEventListener('click',
				function(event){
					if(this.findButton(event.target)) {
						event.preventDefault();
						event.stopPropagation();
					}
				}.bind(this),true);
		} else {
			// Webkit touch events
			if(!!('ontouchstart' in window)) {
				(function() {
					// a var keepin' the touchstart element
					var curElement=null;
					this.rootElement.addEventListener('touchstart', function(event) {
						curElement=this.findButton(event.target);
						curElement&&event.preventDefault()||event.stopPropagation();
					}.bind(this),true);
					// checking it's the same at touchend, capturing command if so
					this.rootElement.addEventListener('touchend', function(event) {
						if(curElement==this.findButton(event.target)) {
							this.captureButton(event);
						} else {
							curElement=null;
						}
					}.bind(this),true);
				}).call(this);
			}
		// Clic events
		this.rootElement.addEventListener('click',
			this.captureButton.bind(this),true);
		}
	// Keyboard events
	// Cancel keydown action (no click event)
	this.rootElement.addEventListener('keydown',function(event) {
		if(13===event.keyCode&&(this.findButton(event.target)
			||this.findForm(event.target))) {
			event.preventDefault()&&event.stopPropagation();
		}
	}.bind(this),true);
	// Fire on keyup
	this.rootElement.addEventListener('keyup',function(event) {
		if(13===event.keyCode&&!event.ctrlKey) {
			if(this.findButton(event.target)) {
				this.captureButton.apply(this, arguments);
			} else {
				this.captureForm.apply(this, arguments);
			}
		}
	}.bind(this),true);
	// event listeners for forms submission
	this.rootElement.addEventListener('submit',
		this.captureForm.bind(this),true);
	// event listeners for form changes
	this.rootElement.addEventListener('change',
		this.formChange.bind(this),true);
	this.rootElement.addEventListener('select',
		this.formChange.bind(this),true);
	}

	// Look for a button
	Commandor.prototype.findButton=function(element) {
		while(element&&element.parentNode) {
			if('A'===element.nodeName
				&&element.hasAttribute('href')
				&&-1!==element.getAttribute('href').indexOf('app:')) {
				return element;
			}
			if('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&(element.getAttribute('type')=='submit'
						||element.getAttribute('type')=='button')
				&&element.hasAttribute('formaction')
				&&-1!==element.getAttribute('formaction').indexOf('app:')
				) {
				return element;
			}
			if(element===this.rootElement) {
				return null;
			}
			element=element.parentNode;
		}
		return null;
	}

	// Look for a form
	Commandor.prototype.findForm=function(element) {
		while(element&&element.parentNode) {
			if('FORM'===element.nodeName&&element.hasAttribute('action')
				&&-1!==element.getAttribute('action').indexOf('app:')) {
				return element;
			}
			if(element===this.rootElement) {
				return null;
			}
			element=element.parentNode;
		}
		return element;
	};

	// Extract the command for a button
	Commandor.prototype.doCommandOfButton=function(element, event) {
		var command='';
		// looking for a button with formaction attribute
		if('INPUT'===element.nodeName) {
			command=element.getAttribute('formaction');
		// looking for a link
		} else if('A'===element.nodeName) {
			command=element.getAttribute('href');
		}
		// executing the command
		this.executeCommand(event,command,element);
	};

	// Button event handler
	Commandor.prototype.captureButton=function(event) {
		var element=this.findButton(event.target);
		// if there is a button, stop event
		if(element) {
			// if the button is not disabled, run the command
			if((!element.hasAttribute('disabled'))
				||'disabled'===element.getAttribute('disabled')) {
				this.doCommandOfButton(element, event);
			}
			event.stopPropagation()||event.preventDefault();
		}
	};

	// Form change handler
	Commandor.prototype.formChange=function(event) {
		// find the evolved form
		var element=this.findForm(event.target),
			command='';
		// searching the data-change attribute containing the command
		if('FORM'===element.nodeName&&element.hasAttribute('data-change')) {
			command=element.getAttribute('data-change');
		}
		// executing the command
		command&&this.executeCommand(event,command,element);
	};

	// Extract the command for a button
	Commandor.prototype.doCommandOfForm=function(element, event) {
		var command='';
		// looking for a button with formaction attribute
		if('FORM'===element.nodeName) {
			command=element.getAttribute('action');
		}
		// executing the command
		this.executeCommand(event,command,element);
	};

	// Form command handler
	Commandor.prototype.captureForm=function(event) {
		var element=this.findForm(event.target);
		// if there is a button, stop event
		if(element) {
			// if the button is not disabled, run the command
			if((!element.hasAttribute('disabled'))
				||'disabled'===element.getAttribute('disabled')) {
				this.doCommandOfForm(element, event);
			}
			event.stopPropagation()||event.preventDefault();
		}
	};

	// Common command executor
	Commandor.prototype.executeCommand=function (event,command,element) {
		// checking for the app protocol
		if(0!==command.indexOf('app:'))
			return false;
		// removing app:
		command=command.substr(4);
		var chunks=command.split('?');
		// the first chunk is the command path
		var callback=this.commands;
		var nodes=chunks[0].split('/');
		for(var i=0, j=nodes.length; i<j; i++) {
		if(!callback[nodes[i]])
			throw Error('Cannot execute the following command "'+command+'".');
			callback=callback[nodes[i]];
		}
		// Preparing arguments
		var args=[];
		if(chunks[1]) {
			chunks=chunks[1].split('&');
			for(var i=0, j=chunks.length; i<j; i++) {
				var parts=chunks[i].split('=');
				if(undefined!==parts[0]&&undefined!==parts[1])
					args[parts[0]]=decodeURIComponent(parts[1]);
			}
		}
		// executing the command fallback
		return !!!callback(event,args,element);
	};

	// Add a callback for the specified path
	Commandor.prototype.suscribe=function(path,callback) {
		var nodes=path.split('/'),
			command=this.commands;
		for(var i=0, j=nodes.length-1; i<j; i++) {
			if((!command[nodes[i]])||!(command[nodes[i]] instanceof Object)) {
				command[nodes[i]]={};
				}
			command=command[nodes[i]];
			}
		command[nodes[i]]=callback;
	};

	// Delete callback for the specified path
	Commandor.prototype.unsuscribe=function(path) {
		var nodes=path.split('/'),
			command=this.commands;
		for(var i=0, j=nodes.length-1; i<j; i++) {
			command=command[nodes[i]]={};
		}
		command[nodes[i]]=null;
	};

// END: Module logic end

	return Commandor;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='Commandor';
	}
	this[name.substring(name.lastIndexOf('/')+1)]=factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
