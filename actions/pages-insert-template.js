module.exports = (course, page, callback) => {
    //only add the platforms your grandchild should run in
    var validPlatforms = ['online', 'pathway'];
    var validPlatform = validPlatforms.includes(course.settings.platform);

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
            template: require('../page-templates/LessonNotes.js')
        },
        {
            title: /(Setup Notes & Course Settings)|(Setup Notes for Development Team)/gi,
            template: require('../page-templates/courseSetup.js')
        }
    ];
    var item = pagesToChange.find(item => item.title.test(page.title));

    function action() {
        var header = '<h2 style="color:red">Old Content</h2>';
        page.body = item.template() + header + page.body;
        page.techops.log('Pages with Templates - Set templates', {
            'Title': page.title,
        });
        callback(null, course, page);
    }

    /* If the item not undefined, not marked for deletion, and is a valid platform type, do action() */
    if (item !== undefined &&
        page.techops.delete !== true &&
        validPlatform === true) {
        action();
    } else {
        callback(null, course, page);
    }
};