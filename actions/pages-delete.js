module.exports = (course, page, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (page.techops.delete == true) {
        callback(null, course, page);
        return;
    }

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        /guidelines\s*for\s*button/gi,
        /discussion\sforums/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(page.title));

    /* This is the action that happens if the test is passed */
    function action() {
        page.techops.delete = true;
        course.log('Pages Deleted', {
            'Title': page.title,
            'ID': page.id
        });
        callback(null, course, page);
    }

    if (found != undefined) {
        action();
    } else {
        callback(null, course, page);
    }

};