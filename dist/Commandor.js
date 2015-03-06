(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Commandor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Commandor constructor : rootElement is the element
// from wich we capture commands
var Commandor = function Commandor(rootElement, prefix) {
	// Event handlers
	var _pointerDownListener;
	var _pointerUpListener;
	var _pointerClickListener;
	var	_touchstartListener;
	var _touchendListener;
	var _clickListener;
	var	_keydownListener;
	var _keyupListener;
	var	_formChangeListener;
	var _formSubmitListener;

	// Commands hashmap
	var	_commands = {
		'____internal': true
	};

	// Command prefix
	this.prefix = prefix || 'app:';

	// Testing rootElement
	if(!rootElement) {
		throw Error('No rootElement given');
	}

	// keeping a reference to the rootElement
	this.rootElement = rootElement;

	// MS Pointer events : should unify pointers, but... read and see by yourself.
	if(!!('onmsgesturechange' in window)) {

		// event listeners for buttons
		(function() {
			var curElement = null;
			_pointerDownListener = function(event) {
				curElement = this.findButton(event.target) || this.findForm(event.target);
				curElement && event.preventDefault() || event.stopPropagation();
			}.bind(this);
			_pointerUpListener = function(event) {
				if(curElement) {
					if(curElement === this.findButton(event.target)) {
						this.captureButton(event);
					} else if(curElement === this.findForm(event.target)) {
						this.captureForm(event);
					}
					event.preventDefault();
					event.stopPropagation();
					curElement = null;
				}
			}.bind(this);
			this.rootElement.addEventListener('MSPointerDown', _pointerDownListener, true);
			this.rootElement.addEventListener('MSPointerUp', _pointerUpListener, true);
		}).call(this);

		// fucking IE10 bug : it doesn't cancel click event
		// when gesture events are cancelled
		_pointerClickListener = function(event) {
			if(this.findButton(event.target)) {
				event.preventDefault();
				event.stopPropagation();
			}
		}.bind(this);
		this.rootElement.addEventListener('click', _pointerClickListener,true);
	} else {
		// Touch events
		if(!!('ontouchstart' in window)) {
			(function() {
				// a var keepin' the touchstart element
				var curElement = null;
				_touchstartListener = function(event) {
					curElement = this.findButton(event.target) || this.findForm(event.target);
					curElement && event.preventDefault() || event.stopPropagation();
				}.bind(this);
				this.rootElement.addEventListener('touchstart', _touchstartListener, true);
				// checking it's the same at touchend, capturing command if so
				_touchendListener = function(event) {
					if(curElement == this.findButton(event.target)) {
						this.captureButton(event);
					} else if(curElement === this.findForm(event.target)) {
						this.captureForm(event);
					} else {
						curElement = null;
					}
				}.bind(this);
				this.rootElement.addEventListener('touchend', _touchendListener, true);
			}).call(this);
		}
	// Clic events
	_clickListener = this.captureButton.bind(this);
	this.rootElement.addEventListener('click', _clickListener, true);
	}
	// Keyboard events
	// Cancel keydown action (no click event)
	_keydownListener = function(event) {
		if(
			13 === event.keyCode && (
				this.findButton(event.target) ||
				this.findForm(event.target)
			)
		) {
			event.preventDefault() && event.stopPropagation();
		}
	}.bind(this);
	this.rootElement.addEventListener('keydown', _keydownListener, true);
	// Fire on keyup
	_keyupListener = function(event) {
		if(
			13 === event.keyCode &&
			!event.ctrlKey
		) {
			if(this.findButton(event.target)) {
				this.captureButton.apply(this, arguments);
			} else {
				this.captureForm.apply(this, arguments);
			}
		}
	}.bind(this);
	this.rootElement.addEventListener('keyup', _keyupListener, true);
	// event listeners for forms submission
	_formSubmitListener = this.captureForm.bind(this);
	this.rootElement.addEventListener('submit', _formSubmitListener, true);
	// event listeners for form changes
	_formChangeListener = this.formChange.bind(this);
	this.rootElement.addEventListener('change', _formChangeListener, true);
	this.rootElement.addEventListener('select', _formChangeListener, true);

	// Common command executor
	this.executeCommand = function (event,command,element) {
		if(!_commands) {
			throw Error('Cannot execute command on a disposed Commandor object.');
		}
		// checking for the prefix
		if(0 !== command.indexOf(this.prefix)) {
			return false;
		}
		// removing the prefix
		command = command.substr(this.prefix.length);
		var chunks = command.split('?');
		// the first chunk is the command path
		var callback = _commands;
		var nodes = chunks[0].split('/');
		for(var i = 0, j = nodes.length; i < j-1; i++) {
			if(!callback[nodes[i]]) {
				throw Error('Cannot execute the following command "' + command + '".');
			}
			callback = callback[nodes[i]];
		}
		if('function' !== typeof callback[nodes[i]]) {
			throw Error('Cannot execute the following command "' + command + '", not a function.');
		}
		// Preparing arguments
		var args = {};
		if(chunks[1]) {
			chunks = chunks[1].split('&');
			for(var k = 0, l = chunks.length; k < l; k++) {
				var parts = chunks[k].split('=');
				if(undefined !== parts[0] && undefined !== parts[1]) {
					args[parts[0]] = decodeURIComponent(parts[1]);
				}
			}
		}
		// executing the command fallback
		if(callback.____internal) {
			return !!!((callback[nodes[i]])(event, args, element));
		} else {
			return !!!(callback[nodes[i]](event, args, element));
		}
		return !!!callback(event, args, element);
	};

	// Add a callback or object for the specified path
	this.suscribe = function(path, callback) {
		if(!_commands) {
			throw Error('Cannot suscribe commands on a disposed Commandor object.');
		}
		var nodes = path.split('/');
		var command = _commands;
		for(var i = 0, j = nodes.length-1; i < j; i++) {
			if((!command[nodes[i]]) || !(command[nodes[i]] instanceof Object)) {
				if(!command.____internal) {
					throw Error('Cannot suscribe commands on an external object.');
				}
				command[nodes[i]] = {
					'____internal': true
				};
			}
			command = command[nodes[i]];
		}
		if(!command.____internal) {
			throw Error('Cannot suscribe commands on an external object.');
		}
		command[nodes[i]] = callback;
	};

	// Delete callback for the specified path
	this.unsuscribe = function(path) {
		if(!_commands) {
			throw Error('Cannot unsuscribe commands of a disposed Commandor object.');
		}
		var nodes = path.split('/'),
			command = _commands;
		for(var i = 0, j = nodes.length-1; i < j; i++) {
			command = command[nodes[i]] = {};
		}
		if(!command.____internal) {
			throw Error('Cannot unsuscribe commands of an external object.');
		}
		command[nodes[i]] = null;
	};

	// Dispose the commandor object (remove event listeners)
	this.dispose = function() {
		_commands = null;
		if(_pointerDownListener) {
			this.rootElement.removeEventListener('MSPointerDown',
				_pointerDownListener, true);
			this.rootElement.removeEventListener('MSPointerUp',
				_pointerUpListener, true);
			this.rootElement.removeEventListener('click',
				_pointerClickListener, true);
		}
		if(_touchstartListener) {
			this.rootElement.removeEventListener('touchstart',
				_touchstartListener, true);
			this.rootElement.removeEventListener('touchend',
				_touchendListener, true);
		}
		this.rootElement.removeEventListener('click', _clickListener, true);
		this.rootElement.removeEventListener('keydown', _keydownListener, true);
		this.rootElement.removeEventListener('keyup', _keyupListener, true);
		this.rootElement.removeEventListener('change', _formChangeListener, true);
		this.rootElement.removeEventListener('select', _formChangeListener, true);
		this.rootElement.removeEventListener('submit', _formSubmitListener, true);
	};
};

// Look for a button
Commandor.prototype.findButton = function(element) {
	while(element && element.parentNode) {
		if(
			'A' === element.nodeName &&
			element.getAttribute('href') &&
			-1 !== element.getAttribute('href').indexOf(this.prefix)
		) {
			return element;
		}
		if(
			'INPUT' === element.nodeName &&
			element.getAttribute('type') && (
				element.getAttribute('type') == 'submit' ||
				element.getAttribute('type') == 'button'
			) &&
			element.getAttribute('formaction') &&
			-1 !== element.getAttribute('formaction').indexOf(this.prefix)
		) {
			return element;
		}
		if(element === this.rootElement) {
			return null;
		}
		element = element.parentNode;
	}
	return null;
};

// Look for a form
Commandor.prototype.findForm = function(element) {
	if(
		'FORM' === element.nodeName || (
			'INPUT' === element.nodeName &&
			element.getAttribute('type') &&
		 'submit' === element.getAttribute('type')
		 )
	) {
		while(element && element.parentNode) {
			if(
				'FORM' === element.nodeName &&
				element.getAttribute('action') &&
				-1 !== element.getAttribute('action').indexOf(this.prefix)
			) {
				return element;
			}
			if(element === this.rootElement) {
				return null;
			}
			element = element.parentNode;
		}
		return element;
	}
	return null;
};

// Look for form change
Commandor.prototype.findFormChange = function(element) {
	while(element && element.parentNode) {
		if(
			'FORM' === element.nodeName &&
			element.getAttribute('action') &&
			-1 !== element.getAttribute('action').indexOf(this.prefix)
		) {
			return element;
		}
		if(element === this.rootElement) {
			return null;
		}
		element = element.parentNode;
	}
	return element;
};

// Extract the command for a button
Commandor.prototype.doCommandOfButton = function(element, event) {
	var command = '';
	// looking for a button with formaction attribute
	if('INPUT' === element.nodeName) {
		command = element.getAttribute('formaction');
	// looking for a link
	} else if('A' === element.nodeName) {
		command = element.getAttribute('href');
	}
	// executing the command
	this.executeCommand(event, command, element);
};

// Button event handler
Commandor.prototype.captureButton = function(event) {
	var element = this.findButton(event.target);
	// if there is a button, stop event
	if(element) {
		// if the button is not disabled, run the command
		if('disabled' !== element.getAttribute('disabled')) {
			this.doCommandOfButton(element, event);
		}
		event.stopPropagation() || event.preventDefault();
	}
};

// Form change handler
Commandor.prototype.formChange = function(event) {
	// find the evolved form
	var element = this.findFormChange(event.target);
	var command = '';
	// searching the data-change attribute containing the command
	if(element && 'FORM' === element.nodeName) {
		command = element.getAttribute('data-change');
	}
	// executing the command
	command && this.executeCommand(event, command, element);
};

// Extract the command for a button
Commandor.prototype.doCommandOfForm = function(element, event) {
	var command = '';
	// looking for the closest form action attribute
	if('FORM' === element.nodeName) {
		command = element.getAttribute('action');
	}
	// executing the command
	this.executeCommand(event, command, element);
};

// Form command handler
Commandor.prototype.captureForm = function(event) {
	var element = this.findForm(event.target);
	// if there is a button, stop event
	if(element) {
		// if the button is not disabled, run the command
		if('disabled' !== element.getAttribute('disabled')) {
			this.doCommandOfForm(element, event);
		}
		event.stopPropagation() || event.preventDefault();
	}
};

module.exports = Commandor;


},{}]},{},[1])(1)
});