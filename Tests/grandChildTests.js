/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, callback) => {
    tap.test('action-series-pages', (tapTest) => {
        function pages_delete(deleteCallback) {
            deleteCallback(null);
            return;
        }

        /* An array of functions for each associated action in action-series-pages */
        var myFunctions = [
            pages_delete,
        ];

        /* Run each universal grandchilds' test in its own function, one at a time */
        asyncLib.series(myFunctions, (seriesErr) => {
            if (seriesErr) {
                course.error(seriesErr);
            }
            tapTest.end();
        });
    });

    callback(null, course);
};