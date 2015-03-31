import del from 'del'
import path from 'path'
import runSequence from 'run-sequence'
import git from 'gulp-git'
import babel from 'gulp-babel'
import bump from 'gulp-bump'
import mocha from 'gulp-mocha'
import filter from 'gulp-filter'
import tagVersion from 'gulp-tag-version'
import webpack from 'gulp-webpack-build'
import mochaPhantomJS from 'gulp-mocha-phantomjs'

export default function (gulp, rootDir) {
  var src = `${rootDir}/src`
    , test = `${rootDir}/test`
    , tools = `${rootDir}/tools`
    , dist = `${rootDir}/dist`
    , lib = `${rootDir}/lib`
    , mochaPhantomConfig = {
      phantomjs: {
        useColors: true
      }
    }

  runSequence.use(gulp)

  gulp.task('default', ['watch'])

  gulp.task('watch', ['test'], () => {
    gulp.watch([src + '/**/*', test + '/**/*'], ['test'])
  })

  gulp.task('prepublish',
    (cb) => runSequence('clean', ['copy-nonjs', 'build-js'], cb)
  )

  gulp.task('test', ['test-node'])

  gulp.task('test-browser', ['webpack'], () =>
    gulp.src('test/runner.html')
      .pipe(mochaPhantomJS(mochaPhantomConfig))
      .on('error', onerror)
  )

  gulp.task('test-node', ['prepublish'], () => {
    gulp.src('test/test.js')
      .pipe(mocha())
      .on('error', onerror)
  })

  gulp.task('webpack', () => {
    gulp.src(path.join(tools, 'webpackConfig.js'))
      .pipe(webpack.compile())
      .pipe(webpack.format({
        version: false,
        timings: true
      }))
      .pipe(webpack.failAfter({
        errors: true,
        warnings: true
      }))
      .pipe(gulp.dest(dist))
  })

  gulp.task('clean',
    (cb) => del(lib, cb)
  )

  gulp.task('copy-nonjs',
    () => gulp.src([`${src}/**/*`, `!${src}/**/*.js`])
      .pipe(gulp.dest(lib))
  )

  gulp.task('build-js',
    () => gulp.src(`${src}/**/*.js`)
      .pipe(babel({experimental: true}))
      .pipe(gulp.dest(lib))
  )

  /*
   *  gulp patch     # makes v0.1.0 → v0.1.1
   *  gulp feature   # makes v0.1.1 → v0.2.0
   *  gulp release   # makes v0.2.1 → v1.0.0
   */
  gulp.task('patch', () => inc('patch') )
  gulp.task('feature', () => inc('minor') )
  gulp.task('release', () => inc('major') )

  function onerror(err) {
    console.log(err)
    this.emit('end')
  }

  function inc(importance) {
    return gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type: importance}))
      .pipe(gulp.dest('./'))
      .pipe(git.commit('version bump'))
      .pipe(filter('package.json'))
      .pipe(tagVersion({ prefix: '' }));
  }
}

