const imagemin = require('imagemin');
const imageminWebP = require('imagemin-webp');

(async () => {
	await imagemin(['img/*.{jpg,png,webp}'], {
		destination: 'webp',
		plugins: [
			imageminWebP(
				{
					quality: 80,
					method: 6
				}
				)
		]
	});
	console.log('图片已按照画质的80%压缩为webp格式');
})();
