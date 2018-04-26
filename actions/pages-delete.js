/******************************************************************************
 * Pages Delete
 * Description: Create an array of page titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the page will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, page, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway', 'campus'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (page.techops.delete === true || validPlatform !== true) {
            callback(null, course, page);
            return;
        }

        /* Pages to be deleted, in LOWER case */
        var doomedItems = [];
        if (course.settings.platform !== 'campus') {
            doomedItems = [
                /guidelines\s*for\s*button/gi,
                /discussion\sforums/gi,
                /how\s*to\s*understand\s*due\s*/gi,
                /course\s*maintenance\s*log/gi,
                /course\s*search\s*tool/gi,
                /weekly\s*patterns?\s*(and|&)\s*expectations?\s*/gi,
                /course\s*outline/gi,
            ];
        }

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
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, page);
    }
};