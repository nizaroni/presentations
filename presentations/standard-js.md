%title: JavaScript Standard Style
%author: @khalifenizar
%date: 2015-07-28


-> JavaScript Standard Style
-> =========================

-> by Nizar Khalife Iglesias
-> @khalifenizar


------------------------------------------


-> I'm **Nizar**.

^

-> Lead Instructor at **Ironhack**

^

-> Wizard of JavaScript


------------------------------------------


-> There are a million different styles in which to write JavaScript.

^

-> And, quite frankly, I'm sick of it.


-------------------------------------------


-> Go has [the right idea](https://blog.golang.org/go-fmt-your-code).

^

-> We shouldn't have to worry about little style issues.

^

-> If everybody writes the same way it's easier to read as well.

^

-> I don't want to have debates about spaces and semicolons.


-------------------------------------------


-> I would rather spend less time bikeshedding and more time solving real problems!

^

-> Because it doesn't really matter where you put your `var` statement.

^

-> Or whether you use double quotes.


-------------------------------------------


-> Enter [JavaScript Standard Style](http://standardjs.com).

^

-> It's not just a style to rule them all.

^

-> It's also an npm package.

    $ npm install --global standard


-------------------------------------------

The Rules
---------

^

**2 spaces** for indentation
^
**Single quotes** for strings (except to avoid escaping)
^
No **unused variables** - this one catches tons of bugs!
^
No **semicolons** - It's fine. Really!
^
Space after **keywords** `if (condition) { ... }`
^
Space after **function name** `function foo (arg) { ... }`
^
And more...


-------------------------------------------


-> Of note... I don't even agree with some of these rules.

^

-> I used to hate 2 spaces for indentation.

^

-> But I just don't think about style anymore.

^

-> I use Standard Style and call it good.


-------------------------------------------


-> Give `standard` a try today!

^

-> Or if you choose to bikeshed with style...

^

-> Use something like [ESLint](http://eslint.org) to enforce a custom coding style.

^

-> It makes your lives a lot easier.
