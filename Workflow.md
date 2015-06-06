Workflow
========

[SASS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
------------------------------------------------------------------
	Watch the /library/sass folder for changes and output to the /css/ folder
		sass --watch library/sass:css

[BrowserSync.io](http://browsersync.io/docs)
-------------------------------
	Watch the root folder for changes
		browser-sync start --server --files "*.html, css/*.css, js/*.js"