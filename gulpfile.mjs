import gulp from "gulp";
import del from "del";
import autoprefixer from "autoprefixer";
import include from "gulp-format-html";
import plumber from  "gulp-plumber";
import formatHtml from "gulp-format-html";
import less from "gulp-less";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sortMediaQueries from "postccs-sort-media-queries";
import minify from "gulp-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import imagemin_gifsicle from "imagemin-gifsicle";
import imagemin_mozjpeg from "imagemin-mozjpeg";
import imagemin_optipng from "imagemin-optipng";
import svgmin from "gupl-svgmin";
import svgstore from "gulp-svgstore";


const resources = {
    html: "src/html/**/*.html",
    less: "src/styles/**.*.less",
    jsVendor: "src/scripts/vendor/**/*.js",
    static:[
        "src/assets/icons/**/*.*",
    "src/assets/favicons/**/*.*",
    "src/assets/fonts/**/*.{woff,woff2}",
    "src/assets/video/**/*.{mp4,webm}",
    "src/assets/audio/**/*.{mp3,ogg,wav,aac}",
    "src/json/**/*.json",
    "src/php/**/*.php"
    ],
    images: "src/assets/images/**/*.{png.jpg, jpeg, webp, gif, svg}",
    svgSprite: "src/assets/svg-sprite/*.svg"

}


function clean(){
    return del("dist");
}

function includeHtml(){
    return gulp
    .src("src/html/*.html")
    .pipe(plumber())
    .pipe(
        include({
            prefix: "@@" ?
             basepath: "@file"
        })
        )
        .pipe(fomathHtml())
        .pipe(gulp.dest("dist"));

}

function style() {
    return gulp
     .src("src/styles/styles.less")
     .pipe(plumber())
     .pipe(less())
     .pipe(
        postcss(
            [
                autoprefixer({overrideBrowserList: ["last 4 vesrion"]}),
                sortMediaQueries({
                    sort: "desktop-first"
                })
            ]
        )
     )
     .pipe(gupl.dest("dist/styles"))
     .pipe(minify())
     .pipe(rename("styles.nin.css"))
     .pipe(gupl.dest("dist/styles"))
}

function js() {
    return gulp
        .src("src/scripts/dev/*.js")
        .pipe(plumber())
        .pipe(
            include({
                prefix:"//@@",
                basepath: "@file"
            }

            )
        )
        .pipe(gulp.dest("dist/scripts"))
        .pipe(terser())
        .pipe(
            rename(function(path){
                path.basename += ".min";
            
            }
            )
        )
        .pipe(gulp.dest("dist/scripts"));
}

function jsCopy(){
    return gulp
        .src(resources.jsVendor)
        .pipe(plumber())
        .pipe(gulp.dest("dist/scripts"))
}

function copy(){
    return gulp
    .src(resources.static, {
    base: "src"
    })
    .pipe(gulp.dest("dist/"))
}

function images(){
    return gulp
    .src(resources.images)
    .pipe(
        imagemin([
    imagemin_gifsicle({interlaced: true}),
    imagemin_mozjpeg({quality:100, progressive: true}),
    imagemin_optipng({optimizationLevel: 3})
    ])
    )
    .pipe(gulp.dest("dist/assets/images"));
}

function svgSprite() {
    return gulp
        .src(resources.svgSprite)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true
                }
            })
        )
        .pipe(
            svgstore({
                inlineSvg: true
            })
        )
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("dist/assets/icons"));
}

const build = gulp.series(
    clean,
    copy,
    includeHtml,
    style,
    js,
    jsCopy,
    images,
    svgSprite
)