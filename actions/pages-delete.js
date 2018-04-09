module.exports = (course, page, callback) => {
    //only add the platforms your grandchild should run in
    var validPlatforms = ['online', 'pathway', 'campus'];
    var validPlatform = validPlatforms.includes(course.settings.platform);

    /* If the item is marked for deletion or isn't a valid platform type, do nothing */
    if (page.techops.delete === true || validPlatform !== true) {
        callback(null, course, page);
        return;
    }

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        /guidelines\s*for\s*button/gi,
        /discussion\sforums/gi,
        /how\s*to\s*understand\s*due\s*/gi,
        /course\s*maintenance\s*log/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(page.title));

    /* This is the action that happens if the test is passed */
    function action() {
        page.techops.delete = true;
        page.techops.log('Pages Deleted', {
            'Title': page.title,
            'ID': page.page_id
        });
        callback(null, course, page);
    }

    if (found !== undefined) {
        action();
    } else {
        callback(null, course, page);
    }

};
