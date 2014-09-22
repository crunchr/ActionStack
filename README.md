ActionStack.js
==============

Adds actions to a stack, so that actions that have already been queued can be triggered at a later time

## Usage

Queue a function, or immediately execute it if the stack is empty

	ActionStack.add(function, [argument1, argument2, …]);

Check for the next queued function and execute it

	ActionStack.next();

Check if a function and its arguments is the same as the previously executed function, returns `true` or `false`

	ActionStack.isPrevious(function, [argument1, argument2, …]);

## Example

	function showInfo(id) {
		if (ActionStack.isPrevious(showInfo, [id])) {
			ActionStack.next();
			return;
		}

		$('#info1, #info2').fadeOut(250, function() {
			$(id).fadeIn(250, function() {
				ActionStack.next();
			});
		})
	}

	$('#button1').on('click', function() {
		ActionStack.add(showInfo, ['#info1']);
	})

	$('#button2').on('click', function() {
		ActionStack.add(showInfo, ['#info2']);
	})

http://www.monokai.nl