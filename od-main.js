/*eslint-env node, es6*/
/*eslint-

/* Module Description */
/* Collects all of the pages and runs them through a series of tests and changes to switch them to new standards */

const canvas = require('canvas-wrapper');
const asyncLib = require('async');

/* TESTS */
const deletePages = require('./actions/delete-pages.js');
const renamePages = require('./actions/rename-pages.js');
const stylingDiv = require('./actions/styling-div.js');

module.exports = (course, stepCallback) => {

    /* All of the tests to put the page through */
    var testList = [
        deletePages,
        renamePages,
        stylingDiv
    ];

    /* Run each of the tests on an individual page */
    function runTests(page, eachCallback) {

        // Get the page
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (err, fullPage) => {
            if (err) {
                course.error(err);
                eachCallback(null);
                return;
            }

            /* Throw the page into the list of tests */
            var tests = [
                asyncLib.constant(course, fullPage[0]),
                ...testList
            ];

            asyncLib.waterfall(tests, (err, pageObj) => {
                if (err) {
                    eachCallback(err);
                    return;
                }

                /* Build the PUT Object */
                var putObj = {
                    'title': pageObj.title,
                    'body': pageObj.body,
                    'editing_roles': pageObj.editing_roles,
                    'notify_of_update': pageObj.notify_of_update,
                    'published': pageObj.published,
                    'front_page': pageObj.front_page
                };

                if (pageObj.delete == true) {
                    /* Item marked for deletion */
                    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (delErr) => {
                        if (delErr) {
                            course.error(err);
                        }
                        eachCallback(null);
                    });
                } else {
                    /* Item needs to be updated */
                    canvas.put(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, putObj, (putErr, newPage) => {
                        if (putErr) {
                            course.error(err);
                            course.warning('All changes included with the above item have not been saved in Canvas.');
                            eachCallback(null);
                            return;
                        }
                        eachCallback(null);
                    });
                }
            });
        });
    }

    /* Retrieve pages from canvas, then send each to runTest() */
    canvas.getPages(course.info.canvasOU, (err, pages) => {
        asyncLib.each(pages, runTests, (err) => {
            if (err) {
                course.error(err);
            }
            stepCallback(null, course);
        });
    });
};