# validity
jQuery form validation using [validity](https://html.spec.whatwg.org/#dom-cva-validity) property.

[Examples](http://conci.com.br/validity/index.html)

## Getting Started
```
<script src="//code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="jquery.validity.js"></script>
```

## Default Settings
```
selector: ':input',
ignore: ':hidden',
showMessages: true,
messages: {
    missing: 'Campo obrigatório',
    mismatch: 'O valor informado é inválido'
}
```

## Usage
```
$('.form')
    .validity()
    .on('submit', function(e) {
        if (!$(this).valid()) {
            e.preventDefault();
        }
    });
```

```
$('.form')
    .validity()
    .on('submit', function(e) {
        if ($(this).valid()) {
            // ...
        }
    });
```

[Examples](http://htmlpreview.github.io/?https://github.com/gustavoconci/validity/blob/master/index.html)
