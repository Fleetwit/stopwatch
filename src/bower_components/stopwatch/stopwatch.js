(function() {
	
	var stopwatch = function() {
		var scope 		= this;
		this.started 	= false;
		this.paused 	= true;
		this.total		= 0;
		this.cues		= [];
	};
	stopwatch.prototype.set = function(ms) {
		
	};
	stopwatch.prototype.reset = function() {
		this.total		= 0;
		this.last		= new Date().getTime();
	};
	stopwatch.prototype.activateCues = function() {
		var scope = this;
		if (!this.cuesRunning) {
			this.cuesRunning = true;
			setInterval(function() {
				// Update
				scope.update();
				// Get the cues
				var i;
				var l = scope.cues.length;
				var remove = {};
				for (i=0;i<l;i++) {
					if (scope.cues[i].sec <= Math.floor(scope.total/1000)) {
						// Execute the callback
						scope.cues[i].cb();
						// Add to the remove list
						remove[scope.cues[i].sec] = true;
					}
				}
				scope.cues = _.reject(scope.cues, function(cue) {
					return remove[cue.sec];
				});
				
			}, 100);
		}
	};
	stopwatch.prototype.start = function() {
		if (this.started) {
			// restart when paused
			if (this.paused) {
				this.paused 	= false;
				this.last		= new Date().getTime();
			}
		} else {
			this.started	= true;
			this.paused		= false;
			this.last		= new Date().getTime();
			this.total		= 0;
		}
	};
	stopwatch.prototype.update = function() {
		if (this.started && !this.paused) {
			var now 	= new Date().getTime();
			var elapsed = now-this.last;
			this.last	= now;
			this.total	+= elapsed;
		}
	};
	stopwatch.prototype.pause = function() {
		if (this.started && !this.paused) {
			this.update();
			this.paused = true;
		}
	};
	stopwatch.prototype.addCue = function(sec, cb) {
		this.cues.push({
			sec:	sec,
			cb:		cb
		});
		this.activateCues();
	};
	
	stopwatch.prototype.format = function(n) {
		if (n <= 9) {
			return "0"+n.toString();
		} else {
			return n;
		}
	};
	stopwatch.prototype.current = function(format) {
		// Update the current time
		this.update();
		
		var seconds 	= this.total / 1000;
		var hours 		= Math.floor(seconds / 3600);
		seconds 		= seconds - hours * 3600;
		var minutes 	= Math.floor(seconds/60);
		var seconds 	= seconds % 60;
		seconds 		= Math.round(seconds);
		
		return format.replace(/(hh)/, this.format(hours)).replace(/(mm)/, this.format(minutes)).replace(/(ss)/, this.format(seconds));
	};
	
	
	// Global scope
	window.stopwatch 		= stopwatch;
})();