Example:
```javascript
var gulp = require('gulp');
var jst = require('gulp-jst');

gulp.task('jst', function() {
  gulp.src('src/**/*.js')
    .pipe(jst())
    .pipe(gulp.dest('dist'));
});
```
