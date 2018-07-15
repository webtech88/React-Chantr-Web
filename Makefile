# node modules in executable path
PATH := node_modules/.bin:$(PATH)

# OSX requires this variable exported so that PATH is also exported.
SHELL := /bin/bash

AUTOPREFIXER_BROWSERS="> 10%"

JS_SRC = $(shell find . -type f -name '*.js' ! -path './node_modules/*' ! -path './.next/*' ! -path './static/*')
JSON_SRC = $(shell find . -type f -name '*.json' ! -path './node_modules/*' ! -path './.next/*' ! -path './static/*')

.PHONY: build clean lint

build:
	@[ -d static/dist/js ] || mkdir -p static/dist/js static/dist/css static/dist/fonts
	cp node_modules/d3/build/d3.min.js static/dist/js/d3.v4.min.js
	cp node_modules/animate.css/animate.min.css static/dist/css/animate.min.css
	cp node_modules/bootstrap/dist/css/bootstrap.min.css static/dist/css/bootstrap.min.css
	cp node_modules/react-select/dist/react-select.css static/dist/css/react-select.css
	cp node_modules/nprogress/nprogress.css static/dist/css/nprogress.css
	cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot static/dist/fonts/glyphicons-halflings-regular.eot
	cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg static/dist/fonts/glyphicons-halflings-regular.svg
	cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf static/dist/fonts/glyphicons-halflings-regular.ttf
	cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff static/dist/fonts/glyphicons-halflings-regular.woff
	cp node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2 static/dist/fonts/glyphicons-halflings-regular.woff2
	cp node_modules/font-awesome/css/font-awesome.min.css static/dist/css/font-awesome.min.css
	cp node_modules/font-awesome/fonts/fontawesome-webfont.eot static/dist/fonts/fontawesome-webfont.eot
	cp node_modules/font-awesome/fonts/fontawesome-webfont.svg static/dist/fonts/fontawesome-webfont.svg
	cp node_modules/font-awesome/fonts/fontawesome-webfont.ttf static/dist/fonts/fontawesome-webfont.ttf
	cp node_modules/font-awesome/fonts/fontawesome-webfont.woff static/dist/fonts/fontawesome-webfont.woff
	cp node_modules/font-awesome/fonts/fontawesome-webfont.woff2 static/dist/fonts/fontawesome-webfont.woff2
	cp node_modules/font-awesome/fonts/FontAwesome.otf static/dist/fonts/FontAwesome.otf
	cp static/libs/accordion_slider_2.6/accordion-slider.min.css static/dist/css/accordion-slider.min.css
	cp static/libs/accordion_slider_2.6/jquery.accordionSlider.min.js static/dist/js/jquery.accordionSlider.min.js
	cp node_modules/jquery/dist/jquery.min.js static/dist/js/jquery.min.js
	cp node_modules/bootstrap/dist/js/bootstrap.min.js static/dist/js/bootstrap.min.js
	cp static/fonts/opensans-light.woff2 static/dist/fonts/opensans-light.woff2
	cp static/fonts/opensans.woff2 static/dist/fonts/opensans.woff2
	cp static/fonts/opensans-semibold.woff2 static/dist/fonts/opensans-semibold.woff2
	cp static/fonts/opensans-bold.woff2 static/dist/fonts/opensans-bold.woff2
	cp static/fonts/opensans-extrabold.woff2 static/dist/fonts/opensans-extrabold.woff2
	cp static/fonts/centurygothic.woff2 static/dist/fonts/centurygothic.woff2
	cp static/fonts/jenna_sue.woff2 static/dist/fonts/jenna_sue.woff2
	cp static/libs/jquery_validation_1.6/jquery.validate.min.js static/drawing/js/jquery_validate.min.js
	cp static/css/nprogress.css static/drawing/css/nprogress.css
	cp static/js/nprogress.js static/drawing/js/nprogress.js
	cp node_modules/sweetalert/dist/sweetalert.min.js static/dist/js/sweetalert.min.js
	cp node_modules/sweetalert/dist/sweetalert.css static/dist/css/sweetalert.css
	cp static/fonts/gloriahallelujah.woff2 static/dist/fonts/gloriahallelujah.woff2

	minify --clean --output static/dist/css/vendor.min.css \
		static/dist/css/bootstrap.min.css \
		static/dist/css/animate.min.css \
		static/dist/css/font-awesome.min.css \
		static/css/slick.css \
		static/dist/css/react-select.css \
		static/dist/css/nprogress.css \
		static/dist/css/accordion-slider.min.css \
		static/dist/css/sweetalert.css

	minify --clean --output static/dist/css/main.min.css \
		static/css/font-face.css \
		static/assets/icons/icons.css \
		static/css/style.css \
		static/css/styles.css \
		static/css/responsive.css \
		static/css/colors/orange.css \
		static/css/navigation.css \
		static/css/card.css \
		static/css/footer.css \
		static/css/profile.css \
		static/css/register.css \
		static/css/explore.css \
		static/css/featured_card.css \
		static/css/faqs.css \
		static/dist/css/react-select.css \
		static/css/youtuber.css \
		static/css/usecases.css \
		static/css/resetpassword.css

	postcss -u autoprefixer --browsers $(AUTOPREFIXER_BROWSERS) \
		./static/dist/css/vendor.min.css -o ./static/dist/css/vendor.min.css
	postcss -u autoprefixer --browsers $(AUTOPREFIXER_BROWSERS) \
		./static/dist/css/main.min.css -o ./static/dist/css/main.min.css

	browserify ./static/libs/admin_browserify.js --plugin [parcelify -o ./static/dist/css/admin_bundle.css] > ./static/dist/js/admin_bundle.js

clean:
	rm -r static/dist

lint:
	jsonlint -q -c ${JSON_SRC}
	eslint ${JS_SRC} ${ESLINT_ARGS}

generate_sitemap:
	sitemap-generator -b https://wishyoo.com/ static/sitemap.xml --verbose
