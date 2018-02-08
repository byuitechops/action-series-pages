module.exports = (course, page, callback) => {

    /* Pages to be deleted, in LOWER case */
    var doomedPages = [
        'guidelines for buttons',
    ];

    /* This is the action that happens if the test is passed */
    function action() {
        page.delete = true;
        course.log('Pages Deleted in Canvas', {
            'Title': page.title,
            'ID': page.page_id
        });
        callback(null, course, page);
    }

    /* The test returns TRUE or FALSE - action() is called if true */
    if (doomedPages.includes(page.title.toLowerCase())) {
        action();
    } else {
        callback(null, course, page);
    }

};