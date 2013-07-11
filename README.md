Commandor
==============

Commandor simplify command/form events management by creating a single endpoint for them (implements the mediator pattern).

It introduce an app: protocol to refer to commands directly inside your HTML.

How to use Commandor
--------------

Consider this HTML snippet :
```html
<div class="root">
	<p><a href="app:myApp/button?test=test&test2=test2">My button</a></p>
	<form action="app:myApp/form?test=test&test2=test2">
		<p>
			My input : <input type="text" /><br />
			<input type="submit" formaction="app:myApp/random" value="Random" />
			<input type="submit" value="Submit" />
		</p>
	</form>
</div>
```

First, create a Commandor instance in your code, the rootElement can be the document body or any other DOM element :

```js
var commandManager=new Commandor(document.querySelector('root'));
```

Then register your commands :
```js
commandManager.suscribe('myApp/button', function(event, params) {
	alert(params['test']);
});
commandManager.suscribe('myApp/form', function(event, params, form) {
	alert(params['test']+','+form[0].value);
});
commandManager.suscribe('myApp/random', function(event, params, button) {
  button.form.elements[button.form.elements.length-3].value=Math.random();
});
```

To dispose a command when no longer used :

```js
commandManager.unsuscribe('myApp/random');
```

Sample
--------------
You can find sample in the "test" folder ([view the test page](http://rest4.org/github/nfroidure/Commandor/master/test/index.html)).
