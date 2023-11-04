const fs = require('fs');

var posts = [];
var categories = [];

module.exports.initialize = () => {
    return new Promise(async function(resolve, reject) {
        try {
            await readPosts();
            await readCategories();
            resolve();
        }
        catch {
            reject("Error reading files");
        }
    })
}
function readPosts() {
    return new Promise ((resolve, reject) => {
        fs.readFile('data/posts.json', 'utf-8', (error, data) => {
            let postData = JSON.parse(data);
            posts = postData;
            resolve();
        })
    })
}
function readCategories() {
    return new Promise ((resolve, reject) => {
        fs.readFile('data/categories.json', 'utf-8', (error, data) => {
            let categoryData = JSON.parse(data);
            categories = categoryData;
            resolve();
        })
    })
}

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        if (posts.length > 0) {
            resolve(posts);
        }
        else {
            reject("No posts returned");
        }
    })
}

module.exports.getPublishedPosts = () => {
    return new Promise ((resolve, reject) => {
        let publishedPosts = posts.filter(post => post.published == true);
        if (publishedPosts.length > 0) {
            resolve(publishedPosts);
        }
        else {
            reject("No published posts returned");
        }
    })
}

module.exports.getCategories = () => {
    return new Promise ((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        }
        else {
            reject("No categories returned");
        }
    })
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        let newPost = {};
        // assign id
        newPost.id = posts.length + 1;
        // store body
        newPost.body = postData.body;
        // store title
        newPost.title = postData.title;
        // assign postDate
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        newPost.postDate = formattedDate;
        // assign category
        newPost.category = Number(postData.category);
        // add featureImage
        newPost.featureImage = postData.featureImage;
        // assign published
        postData.published ? newPost.published = true : newPost.published = false;
        posts.push(newPost);
        resolve(newPost);
    })
}

module.exports.getPostsByCategory = (category) => {
    return new Promise ((resolve, reject) => {
        let postsInCategory = posts.filter((post) => post.category == category);
        if (postsInCategory.length > 0) {
            resolve(postsInCategory);
        }
        else {
            reject("No posts in that category");
        }
    })
}

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise ((resolve, reject) => {
        let postsPastDate = posts.filter((post) => new Date(post.postDate) >= new Date(minDateStr));
        if (postsPastDate.length > 0) {
            resolve(postsPastDate);
        }
        else {
            reject(`No posts past ${minDateStr}`);
        }
    })
}

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const post = posts.find(post => post.id == id)
        if (post) resolve(post);
        else reject(`No post found with id: ${id}`);
        }
    )
}

module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise ((resolve, reject) => {
        let publishedPosts = posts.filter(post => post.published == true & post.category == category);
        if (publishedPosts.length > 0) {
            resolve(publishedPosts);
        }
        else {
            reject("No published posts in that category returned");
        }
    })
}