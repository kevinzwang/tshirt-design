// all of this is grabbing the image

var img = new Image();
img.src = "text.jpg";

var imgCanvas = document.createElement('canvas');
var imgCtx = imgCanvas.getContext('2d');

var imgData;
var imgWidth = img.width;
var imgHeight = img.height;

img.onload = function () {
	imgCanvas.width = img.width;
	imgCanvas.height = img.height;
	imgCtx.drawImage(img, 0, 0);
	imgData = imgCtx.getImageData(0, 0, img.width, img.height).data;
	generate()
};

// actual stuff
function generate() {

	var canvas = document.getElementById("drawCanvas");
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "white"
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2

	var points = []
	var pointCount = 0

	var minDist = 24

	while (pointCount < 200) {
		var x = Math.floor(Math.random() * imgWidth)
		var y = Math.floor(Math.random() * imgHeight)

		var isFar = true;
		for (i = 0; i < points.length; i++) {
			if (Math.abs(points[i][0] - x) < minDist && Math.abs(points[i][1] - y) < minDist) {
				isFar = false
				break;
			}
		}

		if (!isFar)
			continue

		var total = (imgData[(y * imgWidth + x) * 4]
			+ imgData[(y * imgWidth + x) * 4 + 1]
			+ imgData[(y * imgWidth + x) * 4 + 2])
			/ 3;

		if (total < 128) {
			pointCount++

			points.push([x, y])

			ctx.beginPath();
			// ctx.rect(x, y, 10, 10)
			ctx.arc(x, y, 3, 0, Math.PI * 2, true)
			ctx.fill()
			ctx.closePath()
		}
	}

	var radius = 70

	for (i = 0; i < points.length; i++) {
		for (j = 0; j < points.length; j++) {
			if (i != j && points[i][0] >= points[j][0] - radius && points[i][0] <= points[j][0] + radius
				&& points[i][1] >= points[j][1] - radius && points[i][1] <= points[j][1] + radius) {

				function equationx(x) {
					return Math.round((points[j][1] - points[i][1]) / (points[j][0] - points[i][0]) * (x - points[i][0]) + points[i][1])
				}

				function equationy(y) {
					return Math.round((points[j][0] - points[i][0]) / (points[j][1] - points[i][1]) * (y - points[i][1]) + points[i][0])
				}

				var isGood = true;

				var lowerx = points[i][0] < points[j][0] ? points[i][0] : points[j][0]
				var upperx = points[i][0] > points[j][0] ? points[i][0] : points[j][0]


				for (k = lowerx + 1; k < upperx; k++) {
					var yval = equationx(k)
					var index = (k + yval * imgWidth) * 4
					var total = (imgData[index] + imgData[index + 1] + imgData[index + 2]) / 3
					if (total > 128) {
						isGood = false;
						break;
					}
				}

				var lowery = points[i][1] < points[j][1] ? points[i][1] : points[j][1]
				var uppery = points[i][1] > points[j][1] ? points[i][1] : points[j][1]

				for (k = lowery + 1; k < uppery; k++) {
					var xval = equationy(k)
					var index = (k * imgWidth + xval) * 4
					var total = (imgData[index] + imgData[index + 1] + imgData[index + 2]) / 3
					if (total > 128) {
						isGood = false;
						break;
					}
				}

				if (isGood) {
					ctx.beginPath()
					ctx.moveTo(points[i][0], points[i][1])
					ctx.lineTo(points[j][0], points[j][1])
					ctx.stroke()
				}
			}
		}
	}
}