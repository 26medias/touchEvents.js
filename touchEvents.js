/**
	touchEvent
	@author:		Julien Loutre <julien.loutre@gmail.com>
*/
function touchEvent(el, callback, noPropagation, cellSize) {
	this.element 	= el;
	var scope 		= this;
	this.mousedown 	= false;
	this.cellSize 	= cellSize;
	this.callback 	= callback;
	this.stopped	= false;
	this.clickPos = {
		x:	0,
		y:	0
	};
	
	this.element.bind("vmousedown", function(e) {
		if (scope.stopped) {
			return true;
		}
		// exception on hint and instruction buttons on mobiles
		if (noPropagation) {
			var targ;
			if (e.target) {
				targ = e.target;
			} else if (e.srcElement) {
				targ = e.srcElement;
			}
			if (targ.nodeType == 3) { // defeat Safari bug
				targ = targ.parentNode;
			}
			if (!$(targ).data || !$(targ).data('allowclick')) {
				e.preventDefault();
			}
		}
		scope.mousedown = true;
		// Are we on a grid with cells?
		if (cellSize) {
			scope.clickPos = scope.toGrid(e.pageX,e.pageY);
		} else {
			scope.clickPos = {
				x:	e.pageX,
				y:	e.pageY
			};
		}
		scope.callback({
			type: 	'mousedown',
			pos:	scope.clickPos,
			event:	e
		});
	});
	$(document).bind("vmouseup", function(e) {
		if (scope.stopped) {
			return true;
		}
		scope.mousedown = false;
		if (cellSize) {
			var fixedPos = scope.toGrid(e.pageX,e.pageY);
			scope.callback({
				type: 	'mouseup',
				pos:	{
					x:	fixedPos.x,
					y:	fixedPos.y
				},
				event:	e
			});
		} else {
			scope.callback({
				type: 	'mouseup',
				pos:	{
					x:	e.pageX,
					y:	e.pageY
				},
				event:	e
			});
		}
	});
	
	$(document).bind("vmousemove", function(e) {
		if (scope.stopped) {
			return true;
		}
		if (cellSize) {
			var fixedPos = scope.toGrid(e.pageX,e.pageY);
			scope.callback({
				type: 	'mousemove',
				pos:	{
					x:	fixedPos.x,
					y:	fixedPos.y
				},
				event:	e
			});
		} else {
			scope.callback({
				type: 	'mousemove',
				pos:	{
					x:	e.pageX,
					y:	e.pageY
				},
				event:	e
			});
		}
		if (scope.mousedown) {
			if (cellSize) {
				var fixedPos 		= scope.toGrid(e.pageX,e.pageY);
				
				scope.callback({
					type: 	'mousedrag',
					pos:	{
						x:	fixedPos.x,
						y:	fixedPos.y
					},
					distance:	{
						x:	fixedPos.x-scope.clickPos.x,
						y:	fixedPos.y-scope.clickPos.y
					},
					start:	{
						x:	scope.clickPos.x,
						y:	scope.clickPos.y
					},
					event:	e
				});
			} else {
				scope.callback({
					type: 	'mousedrag',
					pos:	{
						x:	e.pageX,
						y:	e.pageY
					},
					distance:	{
						x:	e.pageX-scope.clickPos.x,
						y:	e.pageY-scope.clickPos.y
					},
					start:	{
						x:	scope.clickPos.x,
						y:	scope.clickPos.y
					},
					event:	e
				});
			}
		}
	});
	
	
	/*
	this.element.bind("vmousemove", function(e) {
		if (scope.stopped) {
			return true;
		}
		if (cellSize) {
			var fixedPos = scope.toGrid(e.pageX,e.pageY);
			scope.callback({
				type: 	'mousemove',
				pos:	{
					x:	fixedPos.x,
					y:	fixedPos.y
				},
				event:	e
			});
		} else {
			scope.callback({
				type: 	'mousemove',
				pos:	{
					x:	e.pageX,
					y:	e.pageY
				},
				event:	e
			});
		}
		if (scope.mousedown) {
			if (cellSize) {
				var fixedPos 		= scope.toGrid(e.pageX,e.pageY);
				
				scope.callback({
					type: 	'mousedrag',
					pos:	{
						x:	fixedPos.x,
						y:	fixedPos.y
					},
					distance:	{
						x:	fixedPos.x-scope.clickPos.x,
						y:	fixedPos.y-scope.clickPos.y
					},
					start:	{
						x:	scope.clickPos.x,
						y:	scope.clickPos.y
					},
					event:	e
				});
			} else {
				scope.callback({
					type: 	'mousedrag',
					pos:	{
						x:	e.pageX,
						y:	e.pageY
					},
					distance:	{
						x:	e.pageX-scope.clickPos.x,
						y:	e.pageY-scope.clickPos.y
					},
					start:	{
						x:	scope.clickPos.x,
						y:	scope.clickPos.y
					},
					event:	e
				});
			}
		}
	});
	*/
};
touchEvent.prototype.toGrid = function(x,y) {
	// get the [0;0] position of the element
	var origin 	= this.element.offset();
	
	var fixedX	= x-origin.left;
	var fixedY	= y-origin.top;
	
	return {
		x:	Math.floor(fixedX/this.cellSize),
		y:	Math.floor(fixedY/this.cellSize),
	}
};
touchEvent.prototype.unbind = function() {
	this.stopped = true;
};