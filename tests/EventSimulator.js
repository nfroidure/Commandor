// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define([], function() {
// START: Module logic start

	// Generic event
	function event(element,options) {
		var event;
		options=options||{};
		if(document.createEvent) {
			event = document.createEvent('Event');
			event.initEvent(options.type,
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true);
			element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType=options.type;
      element.fireEvent('on'+options.type, event);
		}
	}

	// Mouse interactions
	function mouse(element,options) {
		var event;
		options=options||{};
		options.type=options.type||'click';
		options.button=options.button||1;
		options.view=options.view||window;
		options.altKey = !!options.altKey;
		options.ctrlKey = !!options.ctrlKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		if(document.createEvent) {
			try {
				event = new MouseEvent(options.type, {
					'view': window,
					'bubbles': options.canBubble ? false : true,
					'cancelable': options.cancelable ? false : true
				});
				event.altKey = options.altKey;
				event.ctrlKey = options.ctrlKey;
				event.shiftKey = options.shiftKey;
				event.metaKey = options.metaKey;
			} catch(e) {
				event = document.createEvent('MouseEvent');
				event.initMouseEvent(options.type,
					'false' === options.canBubble ? false : true,
					'false' === options.cancelable ? false : true,
					options.view,
					options.detail||1,
					options.screenX||0, options.screenY||0,
					options.clientX||0, options.clientY||0,
					options.ctrlKey, options.altKey,
					options.shiftKey, options.metaKey,
					options.button,
					options.relatedTarget||element);
			}
			// Chromium Hack
			try {
				Object.defineProperty(event, 'which', {
					get : function() {
						return options.button;
					}
				});
			} catch(e) {
				event.wich=options.button;
			}
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType=options.type;
			event.button=options.button;
      return element.fireEvent('on'+options.type, event);
		}
	}

	function click(element,options) {
		var dispatched;
		options=options||{};
		options.type='mousedown';
		dispatched=mouse(element, options);
		options.type='mouseup';
		if(!(mouse(element, options)&&dispatched)) {
			return false;
		}
		options.type='click';
		return mouse(element, options);
	}

	// Pointer interactions
	function pointerIsEnabled() {
		return window.navigator.msPointerEnabled ? true : false;
	}

	function pointer(element,options) {
		options=options||{};
		var event = document.createEvent('MSPointerEvent');
		event.initPointerEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1,
			options.screenX||0, options.screenY||0,
			options.clientX||0, options.clientY||0,
			!!options.ctrlKey, !!options.altKey,
			!!options.shiftKey, !!options.metaKey,
			options.button|1, options.relatedTarget||element,
			options.offsetX||0, options.offsetY||0,
			options.width||1, options.height||1,
			options.pressure||255, options.rotation||0,
			options.tiltX||0, options.tiltY||0,
			options.pointerId||1, options.pointerType||'mouse',
			options.hwTimestamp||Date.now(), options.isPrimary||true);
		return element.dispatchEvent(event);
	}

	function point(element,options) {
		options=options||{};
		options.type='MSPointerDown';
		dispatched=pointer(element,options);
		// Should detect IE10 and trigger the click event even if the pointer
		// event is cancelled. IE11+ fixed the issue.
		options.type='MSPointerUp';
		if(!(pointer(element,options)&&dispatched)) {
			return false;
		}
		options.type='click';
		return mouse(element, options);
	}

	// Tactile interactions
	function tactileIsEnabled() {
		return !!('ontouchstart' in window);
	}

	function tactile(element,options) {
		options=options||{};
		var event = document.createEvent('UIEvent');
		event.initUIEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1);
		event.view = options.view||window;
		event.altKey = !!options.altKey;
		event.ctrlKey = !!options.ctrlKey;
		event.shiftKey = !!options.shiftKey;
		event.metaKey = !!options.metaKey;
		return element.dispatchEvent(event);
	}

	function touch(element,options) {
		var dispatched;
		options=options||{};
		options.type='touchstart';
		dispatched=tactile(element, options);
		options.type='touchend';
		if(!(tactile(element, options)&&dispatched)) {
			return false;
		}
		options.type='click';
		return mouse(element, options);
	}

	// Keyboard interactions : lack of a keymap between various keyCode/charCode
	// in different browsers
	function keyboard(element,options) {
		var event;
		options=options||{};
		// Defaults
		options.ctrlKey = options.ctrlKey|false
		options.altKey = options.altKey|false
		options.shiftKey = options.shiftKey|false
		options.metaKey = options.metaKey|false;
		options.keyCode = options.keyCode|0;
		options.charCode = options.charCode|0;
		if(document.createEvent) {
			event = document.createEvent('KeyboardEvent');
			event[typeof event.initKeyboardEvent !== 'undefined'
				? "initKeyboardEvent" : "initKeyEvent"](options.type,
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true,
				options.view||window, String.fromCharCode(options.charCode),
				options.charCode, options.keyCode,
				options.location|0, options.modifier|'',
				options.repeat|false, options.locale|'');
			event.ctrlKey=options.ctrlKey;
			event.shiftKey=options.shiftKey;
			event.altKey=options.altKey;
			event.metaKey=options.metaKey;
			// Chromium Hack
			try {
				Object.defineProperty(event, 'keyCode', {
					get : function() {
						return options.keyCode|0;
					}
				});
				Object.defineProperty(event, 'which', {
					get : function() {
						return options.keyCode|0;
					}
				});
				Object.defineProperty(event, 'charCode', {
					get : function() {
						return options.charCode|'';
					}
				});
				Object.defineProperty(event, 'char', {
					get : function() {
						return String.fromCharCode(options.charCode);
					}
				});
				Object.defineProperty(event, 'ctrlKey', {
					get : function() {
						return options.ctrlKey;
					}
				});
			} catch(e) {
				event.keyCode=options.keyCode;
				event.wich=options.keyCode;
				event.charCode=options.charCode;
				event.char=String.fromCharCode(options.charCode);
				event.ctrlKey=options.ctrlKey;
			}
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType=options.type;
			event.keyCode=options.keyCode;
			event.charCode=options.charCode;
      return element.fireEvent('on'+options.type, event);
		}
	}

	function type(element,options) {
		var dispatched;
		options=options||{};
		options.type='keydown';
		dispatched=keyboard(element, options);
		if(dispatched&&options.keyCode
			&&String.fromCharCode(options.keyCode)
			&&('TEXTAREA'===element.nodeName
			||('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&'text'===element.getAttribute('type')))) {
			element.value+=String.fromCharCode(options.keyCode);
		}
		options.type='keyup';
		if(!(keyboard(element, options)||dispatched)) {
			return false;
		}
		options.type='keypress';
		return keyboard(element, options);
	}

	var EventSimulator = {
		event:event,
		mouse:mouse,
		pointer:pointer,
		point:point,
		click:click,
		tactile:tactile,
		touch:touch,
		keyboard:keyboard,
		type:type
	};

// END: Module logic end

	return EventSimulator;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='EventSimulator';
	}
	this[name.substring(name.lastIndexOf('/')+1)]=factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
