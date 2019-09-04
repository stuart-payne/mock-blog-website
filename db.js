const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const dbURL = 'mongodb://localhost:27017/blogDB';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const CommSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    author: {
        type: String,
        require: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        require: true
    },
    comments: {
        type: [CommSchema]
    },
    creationDate: {
        type: Date,
        required: true
    }
});

function getBlogByTitle(title) {
    const Blog = mongoose.model('Blog', BlogSchema);
    return Blog.findOne({'title': title});
}

function getBlogsByUsername(username) {
    const Blog = mongoose.model('Blog', BlogSchema);
    return Blog.find({'author' : username}, 'title creationDate');
}

function getBlogsByTitleSub(sub) {
    const Blog = mongoose.model('Blog', BlogSchema);
    return Blog.find({title: {
        '$regex': sub,
        '$options': 'ix'
    },}, 'title author');
}

function addBlog(blog) {
    const Blog = mongoose.model('Blog', BlogSchema);
    console.log(blog);
    const newBlog = new Blog({
        title : blog.blog.title,
        text: blog.blog.text,
        author: blog.author,
        comments: [],
        creationDate: Date.now()
    });
    console.log(newBlog);
    return newBlog.save();
}

function testAdd(blog) {
    return true;
}

async function addComment(comment, blog) {
    var res = await getBlogByTitle(blog.title);
    res.comments.push({
        text: comment.text,
        author: comment.author,
        creationDate: Date.now()
    });
    return res.save();
}

// doesnt work, needs connection to db
// const User = mongoose.model('User', UserSchema);
// const Comm = mongoose.model('Comm', CommSchema);
// const Blog = mongoose.model('Blog', BlogSchema);

function addUser(username, password) {
    const salt = getRandomString(16);
    const hash = hashPassword(password, salt);

    const User = mongoose.model('User', UserSchema);

    console.log(`adding ${username} to db...`);

    const newUser = new User({
        username: username,
        password: hash,
        salt: salt,
        date: Date.now()
    });

    return newUser.save();
}

function deleteUser(id) {
    const User = mongoose.model('User', UserSchema);
    return User.deleteOne({_id: id});
}

function deleteBlog(id) {
    const Blog = mongoose.model('Blog', BlogSchema);
    return Blog.deleteOne({_id: id});
}

function deleteComment(blogId, commentId) {
    const Blog = mongoose.model('Blog', BlogSchema);
    return Blog.findById(blogId).then((blog) => {
        let index = blog.comments.findIndex(function(comment) {
            return comment._id.equals(commentId);
        });
        blog.comments.splice(index, 1);
        return blog.save();
    });
}

function getUser(username) {
    const User = mongoose.model('User', UserSchema);
    return User.findOne({ 'username' : username });
}

function getUsersByUsernameSub(usernameSub) {
    const User = mongoose.model('User', UserSchema);
    return User.find({username: {
        '$regex': usernameSub,
        '$options': 'ix'
    },}, 'username');
}

function verifyPassword(password, hash, salt) {
    var newHash = hashPassword(password, salt);
    return newHash == hash;
}

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

function hashPassword(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

function connectToDb() {
    mongoose.connect(dbURL, {useNewUrlParser: true});
}

function disconnect() {
    mongoose.connection.close();
}

function failureCb(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("success");
    }
}

function savePromise (saveObject) {
    return new Promise((resolve, reject) => {
        saveObject.save();
    });
}

function test () {
    console.log('hi');
}

async function testFunc () {
    console.log("gogo");
    connectToDb();
    await addUser('test', 'test');
    const result = await getUser('test');
    disconnect();
    console.log(result);
}
// test();
//testFunc();

module.exports = { 
    addUser: addUser,
    addBlog: addBlog,
    addComment: addComment,
    connect: connectToDb,
    getBlogsByTitleSub: getBlogsByTitleSub,
    disconnect: disconnect,
    deleteBlog: deleteBlog,
    deleteUser: deleteUser,
    deleteComment: deleteComment,
    getBlogByTitle: getBlogByTitle,
    getBlogsByUsername: getBlogsByUsername,
    getUser: getUser,
    getUsersByUsernameSub: getUsersByUsernameSub,
    test: test,
    verifyPassword: verifyPassword
}