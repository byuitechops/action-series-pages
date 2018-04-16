module.exports = (course, page, callback) => {
    //only add the platforms your grandchild should run in
    var validPlatforms = ['online', 'pathway'];
    var validPlatform = validPlatforms.includes(course.settings.platform);

    /* If the item is marked for deletion or isn't a valid platform type, do nothing */
    if (page.techops.delete === true || validPlatform !== true) {
        callback(null, course, page);
        return;
    }
    
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
    }

    if (item !== undefined) {
        action();
    } else {
        callback(null, course, page);
    }
};
