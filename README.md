ActionStack.js
==============

Adds actions to a stack, so that actions that have already been queued can be triggered at a later time. Useful for situations where clicks can happen faster than the execution of actions. For example, you can temporarily block an action while a transition is running and execute it when the transition is done.

## Usage

Queue a function, or immediately execute it if the stack is empty

	ActionStack.add(function, [argument1, argument2, …]);

Check for the next queued function and execute it

	ActionStack.next();

Check if a function and its arguments is the same as the previously executed function, returns `true` or `false`

	ActionStack.isPrevious(function, [argument1, argument2, …]);

## Example

	var _isAnimating = false;

	function showInfo(id) {
		if (ActionStack.isPrevious(showInfo, [id])) {
			ActionStack.next();
			return;
		}

		if (_isAnimating) {
			ActionStack.add(showInfo, [id]);
		} else {
			_isAnimating = true;
			$('#info1, #info2').fadeOut(250, function() {
				$(id).fadeIn(250, function() {
					_isAnimating = false;
					ActionStack.next();
				});
			});
		}
	}

	$('#button1').on('click', function() {
		ActionStack.add(showInfo, ['#info1']);
	})

	$('#button2').on('click', function() {
		ActionStack.add(showInfo, ['#info2']);
	})

http://www.monokai.nl