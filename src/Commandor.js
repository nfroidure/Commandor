// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define([], function() {
// START: Module logic start

	// Commandor constructor : rootElement is the element
	// from wich we capture commands
	var Commandor=function Commandor(rootElement) {
		if(!rootElement)
			throw Error('No rootElement given');
		// Commands hashmap
		this.commands={};
		// keeping a reference to the rootElement
		this.rootElement=rootElement;
		// MS Pointer events
		if(!!('onmsgesturechange' in window)) {
			// event listeners for buttons
			(function() {
				var curElement=null;
					this.rootElement.addEventListener('MSPointerDown', function(event) {
					curElement=this.findButton(event.target);
						event.preventDefault();
						event.stopPropagation();
					}.bind(this),true);
				this.rootElement.addEventListener('MSPointerUp', function(event) {
					if(curElement==this.findButton(event.target))
						this.captureButton(event);
					else
						curElement=null;
					}.bind(this),true);
			}).call(this);
			// fucking IE10 bug
			this.rootElement.addEventListener('click',
				function(event){
					var element=this.findButton(event.target),
						command=this.getCommandFromButton(element);
					if(0===command.indexOf('app:')) {
						event.preventDefault();
						event.stopPropagation();
					}
				}.bind(this),true);
		} else {
			// Webkit touch events
			if(!!('ontouchstart' in window)) {
				(function() {
					var curElement=null;
					// variable contenant le dernier élément visé
					this.rootElement.addEventListener('touchstart', function(event) {
						curElement=this.findButton(event.target);
						}.bind(this),true);
					this.rootElement.addEventListener('touchend', function(event) {
						// on vérifie qu'on est toujours sur le même élément
						if(curElement==this.findButton(event.target))
							this.captureButton(event);
						// sinon, on vide la variable
						else
							curElement=null;
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
		if(13===event.keyCode&&this.findButton(event.target)) {
			event.preventDefault()&&event.stopPropagation();
		}
	}.bind(this),true);
	// Fire on keyup
	this.rootElement.addEventListener('keyup',function(event) {
		if(13===event.keyCode&&!event.ctrlKey) {
			this.captureButton.apply(this, arguments);
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
		// on remonte les parent de l'élément pour
		// trouver un lien ou un bouton de soumission
		while(element!==this.rootElement
			&&element.nodeName!=='A'
			&&(element.nodeName!='INPUT'
					||(!element.hasAttribute('type'))
					||element.getAttribute('type')!='submit'
					||!element.hasAttribute('formaction'))) {
			element=element.parentNode;
		}
		return element;
	}

	// Extract the command for a button
	Commandor.prototype.getCommandFromButton=function(element) {
		var command='';
		// looking for a button with formaction attribute
		if('INPUT'===element.nodeName
				&&element.hasAttribute('type')
				&&element.getAttribute('type')=='submit'
				&&element.hasAttribute('formaction'))
			command=element.getAttribute('formaction');
		// looking for a link
		if('A'===element.nodeName&&element.hasAttribute('href'))
			command=element.getAttribute('href');
		return command;
	}

	// Button command handler
	Commandor.prototype.captureButton=function(event) {
		var element=this.findButton(event.target),
			command=this.getCommandFromButton(element);
		// executing the command
		(element.getAttribute('disabled')
			||(command&&this.executeCommand(event,command,element)))
				&&(event.stopPropagation()
				||event.preventDefault());
	};

	// Form change handler
	Commandor.prototype.formChange=function(event) {
		var element=event.target,
			command='';
		// find the evolved form
		while(element!==this.rootElement
			&&'FORM'!==element.nodeName) {
			element=element.parentNode;
		}
		// searching the data-change attribute containing the command
		if('FORM'===element.nodeName&&element.hasAttribute('data-change'))
			command=element.getAttribute('data-change');
		// executing the command
		command&&this.executeCommand(event,command,element);
	};

	// Form command handler
	Commandor.prototype.captureForm=function(event) {
		var element=event.target,
			command='';
		while(element!==this.rootElement
			&&'FORM'!==element.nodeName) {
			element=element.parentNode;
			}
		// Si l'élément est un formulaire et propose une commande
		if('FORM'===element.nodeName&&element.hasAttribute('action'))
			command=element.getAttribute('action');
		// Si la commande existe on stoppe la propagation
		// et on annule l'évènement
		command
			&&this.executeCommand(event,command,element)
			&&(event.stopPropagation()
			||event.preventDefault());
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
