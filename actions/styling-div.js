// WE WILL KEEP THIS ITS OWN REPOSITORY AND CHILD MODULE


const cheerio = require('cheerio');

module.exports = (course, page, callback) => {

    /* This is the action that happens if the test is passed */
    function action() {

        var $ = cheerio.load(page.body);

        /* Give us the class for the course code */
        var courseCode = course.info.fileName.split(' ');
        courseCode = courseCode[0] + courseCode[1];
        courseCode = courseCode.toLowerCase().replace(/\s+/g, '');
        courseCode = courseCode.replace(/:/g, '');

        if ($('byui').length > 0) {
            return;
        }

        $('body').html(`<div class="byui ${courseCode}">${$.html()}</div>`);

        page.body = $('body').html();

        course.log('Styling HTML Inserted', {
            'Title': page.title,
            'ID': page.page_id
        });

        callback(null, course, page);
    }

    /* The test returns TRUE or FALSE - action() is called if true */
    action();

};