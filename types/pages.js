const canvas = require('canvas-wrapper');
const deletePages = require('../actions/delete-pages.js');
const renamePages = require('../actions/rename-pages.js');
const stylingDiv = require('../actions/styling-div.js');

/*****************
 * THIS MODULE MUST HAVE:
 * getItem(course, page, callback)
 * buildPutObj(course, page, callback)
 * getItems() - Can be a canvas wrapper function
 * actions[] - Property on the export
 *****************/

/* Retrieve an individual item */
function getItem(course, page, callback) {
    canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (err, item) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, item);
    });
}

/* Build the PUT object for an item */
function buildPutObj(page) {
    return {
        'title': page.title,
        'body': page.body,
        'editing_roles': page.editing_roles,
        'published': page.published,
        'front_page': page.front_page
    };
}

/* PUT an item back into Canvas with updates */
function putItem(course, page, callback) {
    var putObj = buildPutObj(page);
    console.log(putObj);
    console.log(course.info.canvasOU);
    console.log(page.page_id);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        // console.log(newItem);
        callback(null, newItem);
    });
}

module.exports = {
    actions: [
        deletePages,
        renamePages,
        stylingDiv
    ],
    getItems: canvas.getPages,
    getItem: getItem,
    putItem: putItem
};