'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

module.exports = function (options) {
    options = _.extend({
        templateSettings: {},
        amd: true,
        processContent: function(src){
            return src;
        },
        processName: function(name){
            return name;
        }
    }, options)
    return through.obj(function (file, enc, cb) {
        // fils is exit
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if(file.isBuffer()){
            // change the postfix of files to .js
            file.path = gutil.replaceExtension(file.path, '.js');
            var pathname = file.path.replace(file.cwd, '');

            // get the string for compile
            var contentSrc = options.processContent(file.contents.toString(enc)),
                content;

            try {
                content = _.template(contentSrc, false, options.templateSettings).source;
            }catch (e){
                console.error('File ' + gutil.colors.red(pathname) + '  failed to compile. \n' + gutil.colors.red.red(e.message));
            }

            if(content){
                if(options.prettify){
                    content = content.replace(new RegExp('\n', 'g'), '')
                }

                content = 'return ' + content;

                if(options.cmd || options.amd){
                    var params = options.cmd ? ' require, exports, module ' : '';
                    content = 'define(function(' + params + '){ return ' + content + ';})';
                }

                file.contents = new Buffer(content);

                this.push(file);

                console.log('File ' + gutil.colors.cyan(pathname) + ' created!' +
                    (contentSrc.trim().length > 1 ? '' : '' + gutil.colors.red(' -- return empty string!')));

                cb();
            }

        }
    });
};