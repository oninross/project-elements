'use strict';

import path from 'path';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;
  let dest = path.join(taskTarget, dirs.api.replace(/^_/, ''));

  // Copy
  // gulp.task('copyFonts', () => {
  //   return gulp.src(path.join(dirs.source, '**/*.{ttf,woff,eof,svg}'))
  //   .pipe(plugins.changed(dest))
  //   .pipe(gulp.dest(dest));
  // });

  gulp.task('copyApi', function() {
    gulp.src(path.join(dirs.source, '_assets/elements/api/**/*'))
      .pipe(gulp.dest(dest))
});
}
