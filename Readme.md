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
			<input type="submit" value="Submit" />
			<input type="button" action="app:myApp/addfield" value="Add field" />
		</p>
	</form>
</div>
```

First, create a Commandor instance in your code, the rootElement can be the document body or any other DOM element :

```js
var commandManager=new Commandor(document.querySelector('root'));
```

```js
Then register your commands :

commandManager.suscribe('myApp/button', function(event, params) {
	console.log(params['test']);
}
commandManager.suscribe('myApp/form', function(event, params, form) {
	console.log(params['test'],
		form[0].value);
}
commandManager.suscribe('myApp/addfield', function(event, params, form) {
	var field=docucment.createElement('input');
	field.setAttribute('type','text');
	form.elements[form.elements.length-1].parentNode
		.appendBefore(field,form.elements[form.elements.length-1]);
}
```


