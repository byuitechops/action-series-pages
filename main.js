/*eslint-env node, es6*/
/*eslint-

/* Module Description */
/* Collects all of the pages and runs them through a series of tests and changes to switch them to new standards */

// const canvas = require('canvas-wrapper');
const asyncLib = require('async');

const itemType = require('./types/pages.js');

module.exports = (course, stepCallback) => {

    /* After tests/actions have run, PUT the object up to Canvas */
    function putTheItem(item, eachCallback) {
        itemType.putItem(course, item, (err, newItem) => {
            if (err) {
                eachCallback(err);
                return;
            }
            eachCallback(null);
        });
    }


    /* Run each of the tests on an individual item */
    function runTests(item, eachCallback) {

        var actions = [asyncLib.constant(course, item), ...itemType.actions];

        asyncLib.waterfall(actions, (waterErr, course, finalItem) => {
            if (waterErr) {
                eachCallback(waterErr);
                return;
            }
            putTheItem(finalItem, eachCallback);
        });

    }

    /* Retrieve the full object for the individual item */
    function getTheItem(item, eachCallback) {
        itemType.getItem(course, item, (err, fullItem) => {
            if (err) {
                course.error(err);
                eachCallback(null);
                return;
            }

            runTests(fullItem[0], eachCallback);
        });
    }

    /* Retrieve pages from canvas, then send each to runTest() */
    itemType.getItems(course.info.canvasOU, (err, items) => {
        if (err) {
            course.error(err);
            stepCallback(null);
            return;
        }

        /* Loop each item through their tests/actions */
        asyncLib.each(items, getTheItem, (eachErr) => {
            if (eachErr) {
                course.error(eachErr);
            }
            stepCallback(null);
        });
    });
};