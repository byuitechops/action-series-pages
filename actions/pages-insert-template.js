module.exports = (course, page, callback) => {
    try {
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
        },
        ];
        var item = pagesToChange.find(item => item.title.test(page.title));

        function action() {
            var header = '<h2 style="color: red;">Old Content</h2>';
            page.body = item.template() + header + page.body;
            page.techops.log('Pages with Templates - Set templates', {
                'Title': page.title,
            });
            callback(null, course, page);
        }

        /* If the item not undefined, not marked for deletion do action() */
        if (item !== undefined &&
            page.techops.delete !== true) {
            action();
        } else {
            callback(null, course, page);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, page);
    }
};

module.exports.details = {
    title: 'pages-insert-template'
}