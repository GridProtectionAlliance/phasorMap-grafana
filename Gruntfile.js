//******************************************************************************************************
//  Gruntfile.js - Gbtc
//
//  Copyright © 2017, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  10/20/2017 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        clean: { dist: ['dist'], options: { force: true } },

        copy: {
            dist_js: {
                expand: true,
                cwd: 'src',
                src: ['**/*.ts', '**/*.d.ts'],
                dest: 'dist'
            },
            dist_html: {
                expand: true,
                flatten: true,
                cwd: 'src/partials',
                src: ['*.html'],
                dest: 'dist/partials/'
            },
            dist_css: {
                expand: true,
                flatten: true,
                cwd: 'src/css',
                src: ['*.css'],
                dest: 'dist/css/'
            },
            dist_img: {
                expand: true,
                flatten: true,
                cwd: 'src/img',
                src: ['*.*'],
                dest: 'dist/img/'
            },
            dist_statics: {
                expand: true,
                flatten: true,
                src: ['src/plugin.json', 'LICENSE', 'README.md'],
                dest: 'dist/'
            }
        },

        typescript: {
            build: {
                src: ['dist/**/*.ts', '!**/*.d.ts'],
                dest: 'dist',
                options: {
                    module: 'system',
                    target: 'es5',
                    rootDir: 'dist/',
                    declaration: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    sourceMap: true,
                    noImplicitAny: false
                }
            }
        },

        watch: {
            files: ['src/**/*.ts', 'src/**/*.html', 'src/**/*.css', 'src/img/*.*', 'src/plugin.json', 'README.md'],
            tasks: ['default'],
            options: {
                debounceDelay: 250
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'copy:dist_js',
        'typescript:build',
        'copy:dist_html',
        'copy:dist_css',
        'copy:dist_img',
        'copy:dist_statics'
    ]);
};
