(function() {
	// The output is pretty uniform, so it's probably fine
	var randseed = 0;
	function seedrand(s) {
		randseed = 0;
		for(var i = 0; i < s.length; i += 2) {
			var h = (s.charCodeAt(i) << 8) | s.charCodeAt(i + 1);
			randseed ^= h;
		}
	}
	function rand() {
		var n = (Math.sin(randseed++) + 1) / 2; // Move range from -1 - 1 to 0 - 1
		var r = n * 10000; // Remove first few digits since they tend to have low entropy
		n = r - Math.floor(r);
		return n;
	}

	function createColor() {
		var h = Math.floor(rand() * 360);
		var s = ((rand() * 60) + 40) + '%';
		var l = ((rand()+rand()+rand()+rand()) * 25) + '%';

		var color = 'hsl(' + h + ',' + s + ',' + l + ')';
		return color;
	}

	function createImageData(size) {
		var width = size; // Only support square icons for now
		var height = size;

		var dataWidth = Math.ceil(width / 2);
		var mirrorWidth = width - dataWidth;

		var data = [];
		for(var y = 0; y < height; y++) {
			var row = [];
			for(var x = 0; x < dataWidth; x++) {
				row[x] = Math.floor(rand()*2.3);
			}
			var r = row.slice(0, mirrorWidth);
			r.reverse();
			row = row.concat(r);

			for(var i = 0; i < row.length; i++) {
				data.push(row[i]);
			}
		}

		return data;
	}

	function createCanvas(imageData, color, scale, bgcolor, spotcolor) {
		var c = document.createElement('canvas');
		var width = Math.sqrt(imageData.length);
		c.width = c.height = width * scale;

		var cc = c.getContext('2d');
		cc.fillStyle = bgcolor;
		cc.fillRect(0, 0, c.width, c.height);
		cc.fillStyle = color;

		for(var i = 0; i < imageData.length; i++) {
			var row = Math.floor(i / width);
			var col = i % width;
			cc.fillStyle = (imageData[i] == 1) ? color : spotcolor;

			if(imageData[i]) {
				cc.fillRect(col * scale, row * scale, scale, scale);
			}
		}

		return c;
	}

	function createIcon(opts) {
		opts = opts || {};
		var size = opts.size || 10;
		var scale = opts.scale || 5;
		var seed = opts.seed || Math.random().toString(36).substr(2);

		seedrand(seed);

		var color = opts.color || createColor();
		var spotcolor = createColor();
		var bgcolor = opts.bgcolor || createColor();
		var imageData = createImageData(size);
		var canvas = createCanvas(imageData, color, scale, bgcolor, spotcolor);

		return canvas;
	}

	window.blockies = {create: createIcon};
})();