module.exports = (course, page, callback) => {
    var pagesToChange = [{
                title: /(Release Notes)/gi,
                template: require('../page-templates/Release Notes.js')
            },
            {
                title: /(Setup for Course Instructor)/gi,
                template: require('../page-templates/SetupNotes.js')
            },
            {
                title: /(General Lesson Notes)/gi,
                template: require('../page-templates/LessonNotes')
            },
            {
                title: /(Setup Notes & Course Settings)/gi,
                template: require('../page-templates/courseSetup')
            }
        ],
        item = pagesToChange.find(item => item.title.test(page.title));

    function action() {
        var header = '<h2 style="color:red">Old Content</h2>';
        page.body = item.template + header + page.body;
        page.techops.log('Pages with Templates - Set templates', {
            'Title': page.title,
            'Body': page.body
        });
        console.log('PAGE BODY: ' + page.body);
    }

    var validPlatforms = ['online', 'pathway'];
    if (item !== undefined || !validPlatforms.includes(course.settings.platform)) {
        action();
    } else {
        callback(null, course, page);
    }
};