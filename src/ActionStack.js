/*!

The MIT License (MIT)

Copyright (c) 2014 Monokai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var ActionStack = ActionStack || function(stackSize) {

	// this determines how many actions can be queued
	var _stackSize = stackSize !== undefined ? stackSize : 3;

	var _stack;
	var _previousID;

	function init() {
		_stack = [];
	}

	function reset() {
		_previousID = undefined;
		_stack = [];
	}

	function hash(funk, args) {
		args = args || [];
		var string = funk.toString() + args.join('-');

		// hash the string to take less memory if the function is long (based on Java's hashCode)
		var id = 0;

		if (string.length === 0) {
			return id;
		}

		for (var i = 0; i < string.length; i++) {
			var c = string.charCodeAt(i);
			id = ((id << 5) - id) + c;
			id = id & id; // convert to 32 bit int
		}

		// returns 32 bit integer
		return id;
	}

	function execute(o) {
		// execute the action and store the function ID after that
		o.funk.apply(o, o.args);
		_previousID = o.id;
	}

	function add(funk, args) {
		if (_stackSize !== 0 && _stack.length > _stackSize) {
			return;
		}

		args = args || [];

		var o = {
			id: hash(funk, args),
			funk: funk,
			args: args
		};

		if (_stack.length) {
			// add action to the stack if it's different from the last action on the stack
			if (_stack[_stack.length - 1].id != o.id) {
				_stack.push(o);
			}
		} else {
			// execute the action if it's the first on the stack
			_stack.push(o);
			execute(o);
		}
	}

	function next() {
		if (_stack.length) {
			// remove the first action on the stack and execute the next action
			_stack.shift();
			if (_stack.length) {
				execute(_stack[0]);
			}
		}
	}

	function isPrevious(funk, args) {
		// checks if the previous action is the same
		var id = hash(funk, args === true ? undefined : args);
		return _previousID == id;
	}

	init();

	return {
		add: add,
		next: next,
		isPrevious: isPrevious,
		reset: reset
	};

};

module.exports = ActionStack;
