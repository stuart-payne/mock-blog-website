const db = require('./db');


(async () => {
    db.connect();
    await db.addBlog({
        title: 'Lorem Ipsum',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
        author: 'Yaya'
    });
    await db.addBlog({
        title: 'Imposter Syndrome',
        text: 'Why I never feel that I belong',
        author: 'Me'
    });
    db.disconnect();
    console.log('executed');
})();