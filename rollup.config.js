import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const production = process.env.BUILD === 'production';

/*
 * Creates a new set of bundles which can replace the bundled version
 * in TEI Publisher or an app generated from it. Unfortunately it is
 * not possible to create a minimal bundle with just the new components.
 */
export default {
    input: [
        '@teipublisher/pb-components/src/pb-components-bundle.js',
        '@teipublisher/pb-components/src/pb-leaflet-map.js',
        '@teipublisher/pb-components/src/pb-odd-editor.js',
        '@teipublisher/pb-components/src/pb-edit-app.js',
        './pb-extension-bundle.js'
    ],
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: !production
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        babel({
            "plugins": [
                "@babel/plugin-proposal-object-rest-spread"
            ]
        }),
        resolve(),
        production && terser({
            compress: {
                reduce_vars: false
            }
        }),
        copy({
            targets: [
                {
                    src: './node_modules/leaflet/dist/leaflet.css',
                    dest: './css/leaflet'
                },
                {
                    src: './node_modules/leaflet/dist/images/*',
                    dest: './images/leaflet'
                },
                {
                    src: './node_modules/openseadragon/build/openseadragon/images/*',
                    dest: './images/openseadragon'
                },
                {
                    src: './node_modules/openseadragon/build/openseadragon/openseadragon.min.js',
                    dest: './lib/'
                },
                {
                    src: './node_modules/prismjs/themes/*',
                    dest: './css/prismjs'
                },
                {
                    src: './node_modules/@teipublisher/pb-components/i18n/common/*',
                    dest: './i18n/common'
                }
            ]
        })
    ]
}