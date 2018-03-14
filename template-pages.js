/* Dependencies */
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

/* Actions */
var actions = [
    require('./actions/pages-delete.js'),
];

class TechOps {
    constructor() {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.logs = [];
        this.delete = false;
        this.type = 'Page';
    }

    log(title, details) {
        this.logs.push({ title, details });
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {

    /* Retrieve an individual item with its html included*/
    function getItem(page, mapCallback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (err, fullItem) => {
            if (err) {
                mapCallback(err);
                return;
            }
            mapCallback(null, fullItem[0]);
        });
    }

    /* Get all of the pages from Canvas */
    canvas.getPages(course.info.canvasOU, (err, items) => {
        if (err) {
            callback(err);
            return;
        }

        /* Get all of the full pages with their html */
        asyncLib.map(items, getItem, (err, fullItems) => {

            /* Give each item the TechOps helper class */
            fullItems.forEach(it => {
                it.techops = new TechOps();
            });

            callback(null, fullItems);
        });
    });
}

/* Build the PUT object for an item */
function buildPutObj(page) {
    return {
        'wiki_page[title]': page.title,
        'wiki_page[body]': page.body,
        'wiki_page[editing_roles]': page.editing_roles,
        'wiki_page[published]': page.published,
        'wiki_page[front_page]': page.front_page
    };
}

function deleteItem(course, page, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, page, callback) {
    if (page.techops.delete === true) {
        deleteItem(course, page, callback);
        return;
    }
    var putObj = buildPutObj(page);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/pages/${page.page_id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return item.body;
}

function setHTML(item, newHTML) {
    item.body = newHTML;
}

function getTitle(item) {
    return item.title;
}

function setTitle(item, newTitle) {
    item.title = newTitle;
}

function getPosition(item) {
    return null;
}

function setPosition(item, newPosition) {
    return null;
}

function getID(item) {
    return item.page_id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};