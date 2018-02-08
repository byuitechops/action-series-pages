module.exports = (course, page, callback) => {

    /* Pages to be renamed, in LOWER case */
    var pagesToRename = [{
        oldTitle: 'setup notes for development team',
        newTitle: '-Setup Notes & Course Settings'
    }];

    var item = pagesToRename.find(item => page.title.toLowerCase() == item.oldTitle);

    /* This is the action that happens if the test is passed */
    function action() {
        page.title = item.newTitle;

        course.log('Page Names Changed', {
            'Old Title': item.oldTitle,
            'New Title': item.newTitle,
            'ID': page.page_id
        });

        callback(null, course, page);
    }

    /* The test returns TRUE or FALSE - action() is called if true */
    if (item != undefined) {
        action();
    } else {
        callback(null, course, page);
    }

};