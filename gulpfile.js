let project_folder = require("path").basename(__dirname);
let source_folder = "#src";
let fs = require("fs");
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
		favicons: project_folder + "/favicons/"
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/main.scss",
		js: source_folder + "/js/main.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp,gif}",
		fonts: source_folder + "/fonts/*.ttf",
		favicons: source_folder + "/favicons/*.{png,svg,ico,xml,webmanifest}",
		icons: source_folder + "/icons/*.svg"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp,gif}",
	},
	clean: "./" + project_folder + "/",
};


// TODO Required Plugins List
let {
	src,
	dest
} = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	gcmq = require("gulp-group-css-media-queries"),
	cleanCSS = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webpHTML = require("gulp-webp-html"),
	//  webpCSS = require('gulp-webpcss'),
	svgSprite = require("gulp-svg-sprite"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter");
// iconFont = require("gulp-iconfont"),
// iconFontCSS = require("gulp-iconfont-css");


// TODO Function BrowserSync
function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false,
	});
}

// TODO Function HTML
function html() {
	return src(path.src.html).pipe(fileinclude()).pipe(webpHTML()).pipe(dest(path.build.html)).pipe(browsersync.stream());
}


// TODO Function CSS
function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			})
		)
		.pipe(gcmq())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 version"],
				cascade: true,
			})
		)
		// .pipe(webpCSS())
		.pipe(dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}


// TODO Function JS
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}


// TODO Function Images
function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{
					removeViewBox: false,
				},],
				interlaced: true,
				optimizationLevel: 3, // 0 to 7
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}


// TODO Fonts Function
function fonts() {
	src(path.src.fonts)
		.pipe(dest(path.build.fonts));
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

// TODO SVG icons to Fonts
// gulp.task("iconfont", function () {
// 	return src(path.src.icons)
// 		.pipe(iconFontCSS({
// 			path: './#src/vendors/_icons_template.scss',
// 			fontName: 'icons',
// 			targetPath: './#src/scss/_icons.scss',
// 			fontPath: path.src.fonts
// 		}))
// 		.pipe(iconFont({
// 			fontName: 'myfont',
// 			prependUnicode: true,
// 			formats: ['ttf', 'eot', 'woff', 'woff2']
// 		}))
// 		.pipe(dest(path.src.fonts));
// });


// TODO Task for Favicons
gulp.task('favicons', function () {
	return src(path.src.favicons)
		.pipe(dest(path.build.favicons));
});


// TODO Task for change .otf font to .ttf font
gulp.task("otf2ttf", function () {
	return src([source_folder + "/fonts/*.otf"])
		.pipe(
			fonter({
				formats: ["ttf"],
			})
		)
		.pipe(dest(source_folder + "/fonts/"));
});


// TODO Task for SVGSprites
gulp.task("svgSprite", function () {
	return gulp
		.src([source_folder + "/iconsprite/*.svg"])
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: "../icons/icons.svg",
						example: true,
					},
				},
			})
		)
		.pipe(dest(path.build.img));
});


// TODO Function for Fonts. Changing fonts in .ttf to .woff and .woff2
function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + "/scss/fonts.scss");
	if (file_content == "") {
		fs.writeFile(source_folder + "/scss/fonts.scss", "", cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split(".");
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + "/scss/fonts.scss", '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
}


// ? Callback function
function cb() { }


// TODO Watching Files
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}


function clean() {
	return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;