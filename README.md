Commandor [![Build Status](https://travis-ci.org/nfroidure/Commandor.png?branch=master)](https://travis-ci.org/nfroidure/Commandor)
==============

Commandor simplify command/form events management by creating a single endpoint
 for them (implements the mediator pattern).

It introduce an app: protocol to refer to commands directly inside your HTML.

How to use Commandor
--------------

Consider [this HTML snippet](http://jsfiddle.net/FQEp2/1/):
```html
<div class="root">
	<div id="posts">
		<article>
			<h1>Post #1</h1>
			<p><a href="app:App/delete?id=1">delete</a></p>
		</article>
		<article>
			<h1>Post #2</h1>
			<p><a href="app:App/delete?id=2">delete</a></p>
		</article>
	</div>
	<form action="app:App/form">
		<p>
			My input : <input type="text" /><br />
			<input type="submit" formaction="app:App/clear" value="Clear" />
			<input type="submit" value="Submit" />
		</p>
	</form>
</div>
```
You can see that a[href], form[action], input[formaction] attributes are filled
 with app: protocol uris. It maps commands to functions. Query parameters are
 passed to them.

To use Commandor with this HTML, first, create a Commandor instance in your code,
 the rootElement can be the document body or any other DOM element :

```js
var commandManager=new Commandor(document.querySelector('.root'));
```

Then register your commands :
```js
commandManager.suscribe('App/delete',function(event,params,element) {
	console.log('Removed article #'+params['id']);
	element.parentNode.parentNode.parentNode.removeChild(
		element.parentNode.parentNode);
});
commandManager.suscribe('App/form', function(event, params, form) {
	console.log('Form submitted,'+form[0].value);
	var article=document.createElement('article');
	article.innerHTML='<h1>'+form[0].value+'</h1>'
		+'<p><a href="app:App/delete?id='+Date.now()+'">delete</a></p>';
	document.querySelector('div#posts').appendChild(article);
	form.elements[0].value='';
});
commandManager.suscribe('App/clear', function(event, params, button) {
	button.form.elements[0].value='';
});
```

You can also directly pass an object, it'll automatically be mapped :
```js
var App= {
	'delete' : function(event,params,element) {
		console.log('Removed article #'+params['id']);
		element.parentNode.parentNode.parentNode.removeChild(
			element.parentNode.parentNode);
	},
	'form' : function(event, params, form) {
		console.log('Form submitted,'+form[0].value);
		var article=document.createElement('article');
		article.innerHTML='<h1>'+form[0].value+'</h1>'
			+'<p><a href="app:App/delete?id='+Date.now()+'">delete</a></p>';
		document.querySelector('div#posts').appendChild(article);
		form.elements[0].value='';
	},
	'clear' : function(event, params, button) {
		button.form.elements[0].value='';
	}
};
commandManager.suscribe('App',App);
```
By doing so, 'this' will be set to the parent object without having to bind methods.

To dispose a command when no longer used :
```js
commandManager.unsuscribe('App/random');
```

To dispose the entire command manager (event listeners included) :
```js
commandManager.dispose();
```

You can create many commandor instances to keep your code more modular or you
can use namespaced commands like above.


About passed parameters to your callbacks
--------------

The first parameter is the event that leaded to the callback execution.

The second is an object containing the query string parameters.

The third parameter gives the element that delivered the executed command, it
 can differ from the 'event.target' property.

Samples
--------------
Here are some apps using Commandor :
* [Hexa](http://hexa.insertafter.com/index.html)
* [Memory](http://memory.insertafter.com/index.html)
* [BreakIt](http://breakit.elitwork.com/index.html)

Supported browsers
--------------
Firefox, Chrome, Opera and IE9+ (fully tested).
Safari should be ok (not tested, DIY or buy me a Mac).
IE8 by polyfilling (bind + addEventListener) (never tried).

