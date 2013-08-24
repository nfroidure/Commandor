Commandor
==============

Commandor simplify command/form events management by creating a single endpoint
 for them (implements the mediator pattern).

It introduce an app: protocol to refer to commands directly inside your HTML.

How to use Commandor
--------------

Consider this HTML snippet :
```html
<div class="root">
	<p><a href="app:myApp/button">My button</a></p>
	<form action="app:myApp/form">
		<p>
			My input : <input type="text" /><br />
			<input type="submit" formaction="app:myApp/random" value="Random" />
			<input type="submit" value="Submit" />
		</p>
	</form>
</div>
```

First, create a Commandor instance in your code, the rootElement can be the
 document body or any other DOM element :

```js
var commandManager=new Commandor(document.querySelector('root'));
```

Then register your commands :
```js
commandManager.suscribe('myApp/button', function(event, params) {
	console.log('Button activated');
});
commandManager.suscribe('myApp/form', function(event, params, form) {
	console.log('Form submitted,'+form[0].value);
});
commandManager.suscribe('myApp/random', function(event, params, button) {
  button.form.elements[button.form.elements.length-3].value=Math.random();
});
```

To dispose a command when no longer used :

```js
commandManager.unsuscribe('myApp/random');
```

You can create many commandor instances to keep your code more modular or you
cant use namespaced commands like above.

Command can pass parameters to allow you to manage multiple call of the same command :

```html
<div id="posts">
	<article>
		<h1>title</h1>
		<p><a href="app:delete?id=1">del</a></p>
	</article>
	<article>
		<h1>title</h1>
		<p><a href="app:delete?id=2">del</a></p>
	</article>
</div>
```

```js
var commandManager=new Commandor(document.getElementById('posts'));
commandManager.suscribe('delete',function(event,params,element) {
	console.log('Removed article '+params['id']);
	element.parentNode.parentNode.removeChild(element.parentNode);
});
```

Samples
--------------
*	Here are some apps using Commandor :
* * http://hexa.insertafter.com/index.html
* * http://memory.insertafter.com/index.html
* * http://breakit.elitwork.com/index.html
* * http://liar.insertafter.com/index.html

Supported browsers
--------------
Firefox, Chrome, Opera and IE9+ (fully tested).
Safari should be ok (not tested, DIY or buy me a Mac).
IE8 by polyfilling (bind + addEventListener) (never tried).

About CommandPromise
--------------
This is intended to be used with this Promise library : https://github.com/nfroidure/Promise
