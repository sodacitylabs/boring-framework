# Getting Started with The Boring Framework
This guide covers getting a simple application up and running with Boring. That application will have a webserver, Controllers to handle incoming http requests to that server, a database with migrations and Models to interact with that database.

This guide tries it's best to assume you have no prior experience with Boring and to some degree MVC and REST. It does assume you have familiarity with HTML, CSS, Javascript and specifically Node.js. If you don't then you'll find it to be hard to learn.

## What is Boring
The Boring Framework is a Node.js MVC framework for building applications on the web. It's primary focus is on web applications but it handles building JSON-based APIs as well. You do not have to build a website to use Boring. It takes away much of the "wiring up" that typically needs to happen to accomplish either. By doing so, it makes building things more fun because focus can be entirely on _what_ you're building rather than _how_ you need to build it; just follow the conventions and you're good to go.

Let's get started.

## Creating a new Project
You're going to create a simple web application called _Blog_ that is just that, a blog. At the end of the guide, you'll have a working project with no extra code needed.

Before you get started, it's required to have Node.js installed. It's recommended that you use [Node Version Manager (NVM)](https://github.com/creationix/nvm) to do that so that you can easily manage different versions of Node.js for your many projects.

This guide will assume you are using NVM. Again, it isn't required but it will help you.

### Installing The Boring Framework
To install Boring, use `npm` to install it globally:
```
$ npm install -g @sodacitylabs/boring-framework
```

### Creating your project directory
Like other popular frameworks such as [Ruby on Rails](https://rubyonrails.org/), Boring has a Command Line Interface (CLI) that you will use to do most of the tasks you'd normally have to do manually. One of these commands that we'll use now is the `new` command which creates a new Project. In your terminal you can run:
```
$ boring new blog
```
This created your new `Blog` project in a folder named `blog`. It also installed your `node_modules` for you.

You can now start building your blog by navigating into that folder:
```
$ cd blog
```
From there you can see the different folders and files that were created for you:

| File / Folder | Purpose |
| ------------- | ------- |
| app/ | The main code for your application. You'll focus on this folder for the remainder of this guide. |
| bin/ | Scripts that you use to setup, update, deploy or run your application. |
| config/ | Configuration for your application's routes, database etc. |
| db/ | Your database connection, migrations, etc. |
| node_modules/ | Your installed npm dependencies |
| public/ | Your static assets i.e. images, fonts, pre-compiled css and js |
| test/ | Your test code for your application |
| .editorconfig | Your development IDE configurations |
| .eslintignore | Files and folders that ESLint should not style check |
| .eslintrc.json | The linting rules for you project. Can be overridden in sub-directories. |
| .gitignore | Files and folders that git should not check into source control by default |
| .npmrc | basic npm client configuration |
| .nvmrc | which version of Node NVM should use for this project |
| .prettierignore | Files and folders that prettier should not reformat for you |
| package(-lock).json | Your application's npm dependencies list, script aliases, etc. |
| README.md | The owner's manual of your application |

## Hello World
To start building our web application we'll implement "Hello, World" with Boring.

### Starting the web server
Technically, you already have a web app to run. To see it, run:
```
$ ./bin/boring.sh server
```

To see your application in action, open a browser window and navigate to [http://localhost:3000](http://localhost:3000). You should see the default Welcome aboard page. The "Welcome aboard" page is the smoke test for a new Boring application: it makes sure that you have your software configured correctly enough to serve a page.

To stop the web server, hit Ctrl+C in the terminal window where it's running. To verify the server has stopped you should see your command prompt cursor again. In development mode, Boring does not require you to restart the server; changes you make in files will be automatically picked up by the server.

### Hello Controller
To see anything other than the welcome aboard page we need to create both a _Controller_ and a _View_.

A Controller's purpose is to take incoming HTTP requests and return HTML, JSON, etc. How that is done is called an _Action_. Actions are just functions. _Routing_ decides which Action should handle a particular HTTP request. To create a new Controller you need to "generate" it via the `generate` command. Let's generate our "Hello" controller with an Action called "index":
```
$ ./bin/boring.sh generate controller Hello index
```
You'll see that several folders and files are created for you. Open the `app/views/hello/index.html.ejs` file and delete all the code and replace it with:
```
<h1>Hello, World!</h1>
```

### Setting a default Page
To tell Boring that you want your "Hello, World" page to be your default HTML page, open `config/routes.js` and set the default Controller and Action to send requests to:
```
get("/","Hello#index");
```
This tells Boring that any requests to the "/" URL of your server should send that request to the hello Controller's index Action. Start the web server again and go to [http://localhost:3000](http://localhost:3000). You should see your "Hello, World" page.

## Building our Blog
You've seen the basics of creating Controllers, Actions and Views. Now let's put them to good use and build our Blog application.

Most web applications are going to center around _Resources_ and the CRUD operations for them. Resources are just a collection of similar things such as messages, objects or animals. They can be Created, Read, Updated and Destroyed.

To see what routes we've defined in our application, we can use the `routes` command:
```
$ ./bin/boring.sh routes
```
this will print all our defined routes by finding every action defined in the app:

| Verb | URL | Controller#Action |
| ------------- | ------- | ---- |
| GET | /hellos | Hello#index |
| GET | / | Hello#index |

Next we'll build out the various features to create and view the BlogPosts in our blog.

### Creating BlogPosts
We'll need a place to create new BlogPosts. A typical route for doing that would be [http://localhost:3000/blog_posts/new](http://localhost:3000/blog_posts/new). If you navigate to that url, you'll see an error page with the message:
```
Routing Error
No route matches [GET] "/blog_posts/new"
```
This error page shows because we need both an BlogPosts Controller as well as a `new` action defined for it. To create a page for creating new BlogPosts we can use the command line:
```
$ ./bin/boring.sh generate controller BlogPosts new
```
You can now open `app/views/blog_posts/new.html.ejs` and replace all the html code with:
```
<h1>New BlogPost</h1>
```
Refresh the page and you should see your title!

To create BlogPosts we'll need a form in our HTML. Add this code below your title:
```
<form id="createPostForm" action="/blog_posts" method="POST">
  <label for="title">Title</label>
  <input type="text" name="title">

  <label for="text">Text</label>
  <input type="text" name="text">

  <button type="submit">Save Blog Post</button>
</form>
<script type="text/javascript">
  (function() {
    var form = document.getElementById("createPostForm");
    form.addEventListener("submit", function() {
      event.preventDefault();

      var xhr = new XMLHttpRequest();

      xhr.open('POST', "/blog_posts", true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.status === 201 && xhr.readyState === 4) {
          window.location.href = xhr.responseText;
          return;
        }
      };

      xhr.send(JSON.stringify({
        title: document.getElementsByName("title")[0].value,
        text: document.getElementsByName("text")[0].value
      }));
    })
  }());
</script>
```
If you submit the form, you'll see another routing error because we haven't created an Action to handle
BlogPost creation. Let's do that now.

### Saving new BlogPosts
To be able to create our BlogPosts, we need a `create` Action for our BlogPosts Controller. Let's do that now:
```
$ ./bin/boring.sh generate action create BlogPosts
```
If you resubmit the form, you'll notice that nothing happens. That's because Boring sends back an HTTP response of `204 No Content` by default for unimplemented JSON endpoints. Our create endpoint will save BlogPosts into our database.

To save our BlogPosts we need to create a _Model_. Models use singular names but are stored in our database in tables with pluralized names. To create our BlogPosts Model we run:
```
$ ./bin/boring.sh generate model BlogPost title:string text:text
```
You just created a new Model with 2 attributes: title and text. Those attributes are automatically mapped to the `blog_posts` table created by the database _Migration_. Migrations make it easy to create and modify tables as well as other tasks for managing your database. Migration files always start with a timestamp to ensure that they're run in chronological order. To run your migrations we can use the CLI again:
```
$ ./bin/boring.sh migrate up
```

Next we'll update our `create` Action to save our form's data into the database. Update the `create` endpoint to create an instance of your BlogPost model and then save it to the database. Then redirect to that BlogPosts' details page:
```
const Boring = require('@sodacitylabs/boring-framework');
const RequestController = Boring.Controller.RequestController;
const BlogPost = require('../models/BlogPost');

module.exports = class BlogPostsController extends RequestController {
  // .... other code
  static async create(req, res) {
    const post = await BlogPost.create({ title: req.body.title, text: req.body.text });

    res.code(201).send(`/blog_posts/${post.id}`);
  }
  // .... other code
};
```
If you reload your webpage and web server then you'll be able to submit the form and once again you'll see a Routing Error. That's because we haven't defined our `show` action for viewing the details for a specific BlogPost. Thus, the redirect to the route `/blog_post/:id` fails.

### Showing a BlogPosts' details
To see the details of an BlogPost we need `GET /blog_posts/:id` route that will use our BlogPosts Controller's `show` action to render a UI. The special `:id` gets filled in by Boring for incoming HTTP requests and should be the `id` for a particular BlogPost. Let's add the show action now:
```
$ ./bin/boring.sh generate action show BlogPosts
```
You'll notice that we created a `show` action function in our BlogPosts controller. Replace it's contents with this:
```
static async show(req, res) {
  const post = await BlogPost.find(req.params.id);

  res.render({
    post
  });
}
```
`Find` is a function of ActiveRecord Models that looks for a specific `id` in your database. Passing the `post` variable to the render function makes sure that we can reference it in our Embedded Javascript (EJS) templates. Now replace the contents of the `show` view with:
```
<p>
  <strong>Title:</strong>
  <%- post.title %>
</p>

<p>
  <strong>Text:</strong>
  <%- post.text %>
</p>
```
With this you can create new blog posts and view their details!

### Listing All BlogPosts
We need a way to view all the BlogPosts in our Blog. To do that we use the `index` action to render a list. Let's create our `index` action:
```
$ ./bin/boring.sh generate action index BlogPosts
```
If you replace the `index` action function with:
```
static async index(req, res) {
  const posts = await BlogPost.all();

  res.render({
    posts
  });
}
```
and replace your `index` view with:
```
<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
    <th colspan="2"></th>
  </tr>

  <% posts.forEach(function(post){ %>
    <tr>
      <td><%- post.title %></td>
      <td><%- post.text %></td>
      <td><a href="/blog_posts/<%- post.id %>">Show</a></td>
    </tr>
  <% }); %>
</table>
```
Now if you go to [http://localhost:3000/blog_posts](http://localhost:3000/blog_posts) you'll see a list of all the BlogPosts you've created that you can see each of the details by clicking on their link.

### Linking our Views
Let's take a moment to link all of the pages we've built so far to each other. For our Hello, World page lets add a link to all the posts:
```
<h1>Hello, World!</h1>
<a href="http://localhost:3000/blog_posts">My Blog</a>
```
then on our `/blog_posts` list add a link to creating a new post above our `table`:
```
<a href="http://localhost:3000/blog_posts/new">New Blog Post</a>
```
Now all of our separate Views are linked together!

### Updating BlogPosts
To update an existing post, we need to `edit` it. The `edit` Action will show a form with the BlogPosts'
values filled in that we can change. To do that, create the edit action on the command line:
```
$ ./bin/boring.sh generate action edit BlogPosts
```
Then we can add code to our `edit` action to pass the existing BlogPosts to the edit View (it will look _very_ familiar):
```
static async edit(req, res) {
  const post = await BlogPost.find(req.params.id);

  res.render({
    post
  });
}
```
And then we just need to create our HTML form in our edit View:
```
<h1>Edit Post</h1>
<form id="editForm" action="/blog_posts/<%- post.id %>" method="PUT">
  <label for="title">Title</label>
  <input type="text" name="title" value="<%- post.title %>">

  <label for="text">Text</label>
  <input type="text" name="text" value="<%- post.text %>">

  <button type="submit">Update Post</button>
</form>
<a href="http://localhost:3000/blog_posts">All Posts</a>
<script type="text/javascript">
  (function() {
    var form = document.getElementById("editForm");
    form.addEventListener("submit", function() {
      event.preventDefault();

      var xhr = new XMLHttpRequest();

      xhr.open('PUT', "/blog_posts/<%- post.id %>", true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          window.location.href = xhr.responseText;
          return;
        }
      };

      xhr.send(JSON.stringify({
        title: document.getElementsByName("title")[0].value,
        text: document.getElementsByName("text")[0].value
      }));
    })
  }());
</script>
```
Notice that instead of a POST to `/blog_posts` we are going to PUT to `/blog_posts/:id` instead. This will go to our `update` action that we define via:
```
$ ./bin/boring.sh generate action update BlogPosts
```
Then we can add the following code to make sure that we save the new values:
```
static async update(req, res) {
  const post = await BlogPost.find(req.params.id);

  await post.update({
    title: req.body.title,
    text: req.body.text
  });

  res.code(200).send(`/blog_posts/${post.id}`);
}
```
Finally, we want to show a link to edit each post in our list and on the `show` View for each BlogPosts. Add this to your forEach in your `index` View:
```
<td><a href="/blog_posts/<%- post.id %>/edit">Edit</a></td>
```

### Deleting BlogPosts
We use the `destroy` Action to delete a BlogPost. That will be a `DELETE /blog_posts/:id` HTTP request. Create your delete action:
```
$ ./bin/boring.sh generate action destroy BlogPosts
```
Then add the code to our destroy action:
```
static async destroy(req, res) {
  await BlogPost.destroy(req.params.id);

  res.code(200).send("/blog_posts");
}
```
Finally just add a Delete link to our `table`:
```
<td><a class="delete-link" data-delete="<%- post.id %>" href="#">Delete</a></td>
```
and a little Javascript to our page to make the clicks work:
```
<script type="text/javascript">
  (function() {
    var deleteLinks = document.querySelectorAll(".delete-link");
    deleteLinks.forEach(function(link) {
      link.addEventListener("click", function() {
        event.preventDefault();

        var xhr = new XMLHttpRequest();
        var id = link.dataset.delete;

        xhr.open('DELETE', "http://localhost:3000/blog_posts/" + id, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function() {
          if (xhr.status === 200 && xhr.readyState === 4) {
            window.location.reload();
            return;
          }
        };

        xhr.send(null);
      })
    });
  }());
</script>
```

Congratulations! You can now list, create, show, update and delete BlogPosts for your Blog.

## Adding Comments
Now lets add the ability for people to comment on our BlogPosts. To do that we'll need to _associate_ any Comment in our system with the BlogPost the comment was left on. To do that, we create a new model with a special key pair of `blog_post:references` like so:
```
$ ./bin/boring.sh generate model Comment commenter:string body:text BlogPost:references
```
Now let's talk about what we just did with that keyword.

### Associating Database Tables
If you look at the migration file that was created, you'll see something different than our prior migration:
```
table.bigIncrements('blog_post_id').notNullable();
table.foreign("blog_post_id").references("id").inTable("blog_posts");
```
Then in the Comment Model you'll notice an attribute that says a Comment _belongs to_ a BlogPost:
```
static get relationMappings() {
  return {
    blogPost: {
      relation: ActiveRecord.BelongsToOneRelation,
      modelClass: BlogPost,
      join: {
        from: "comments.blog_post_id",
        to: "blog_posts.id"
      }
    }
  };
};
```
Now migrate the database again in the terminal to create the new `comments` table:
```
$ ./bin/boring.sh migrate up
```
To wrap up, you need to edit the BlogPost Model to add a property to show it `has many Comments`:
```
  static get relationMappings() {
  return {
    comments: {
      relation: ActiveRecord.HasManyRelation,
      modelClass: Comment,
      join: {
        from: 'blog_posts.id',
        to: 'comments.blog_post_id'
      }
    }
  };
};
```
These properties allow you to have an instance of a BlogPost `post` where you can reference the property `comments` to get a list of Comments for that BlogPost. We'll discuss these more in-depth in another tutorial.

### Nested Routes
By associating our 2 Models, we're saying that URLs for Comments should be prepended with `/blog_posts/:id`. That's not always the case but for now we're going to assume so. That means these routes are treated the same:
```
GET /blog_posts/:blog_post_id/comments/:comment_id
GET /comments/:id
```

### Creating Comments
To begin creating Comments, we need to create a controller:
```
$ ./bin/boring.sh generate controller Comments
```
To begin creating comments, we'll update our `show` BlogPost template to have a form for creating new comments. Add the following code to it:
```
<form id="createCommentForm" method="POST">
  <label for="title">Commenter</label>
  <input type="text" name="commenter">

  <label for="text">Body</label>
  <input type="text" name="body">

  <button type="submit">Save Comment</button>
</form>
<script type="text/javascript">
  (function() {
    var form = document.getElementById("createCommentForm");
    form.addEventListener("submit", function() {
      event.preventDefault();

      var xhr = new XMLHttpRequest();

      xhr.open('POST', "/comments", true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onreadystatechange = function() {
        if ((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4) {
          location.reload();
          return;
        }
      };

      xhr.send(JSON.stringify({
        commenter: document.getElementsByName("commenter")[0].value,
        body: document.getElementsByName("body")[0].value,
        blogPostId: "<%- post.id %>"
      }));
    })
  }());
</script>
```
To handle our form submissions we need to add a `create` Action to our Comments Controller to save it in the database. Let's do that in the CLI now:
```
$ ./bin/boring.sh generate action create Comments
```
Then we can update our create Comment Action:
```
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

module.exports = class CommentsController {
  static async create(req, res) {
    const comment = await Comment.create({
      commenter: req.body.commenter,
      body: req.body.body,
      blogPostId: req.body.blogPostId
    });

    res.code(201).send(`/blog_posts/${blogPostId}`);
  }
};
```
Next we can load the comments for our BlogPost by importing our Comment model and updating our BlogPost Controller's `show` Action to load comments:
```
const Comment = require('../models/Comment');
```
and
```
post.comments = await Comment.findBy({
  blogPostId: post.id
});
```
and then we can show the comments in our `blog_posts/show.html.ejs` View like so:
```
<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
    <th colspan="3"></th>
  </tr>

  <% post.comments.forEach(function(comment){ %>
    <tr>
      <td><%- comment.commenter %></td>
      <td><%- comment.body %></td>
    </tr>
  <% }); %>
</table>
```
If you reload your page, you should see your comments!

## Deleting Comments
Our last feature is the ability to delete comments from internet trolls. To do this we need to implement a `destroy` action for our Comments Controller:
```
$ ./bin/boring.sh generate action destroy Comments
```
Then we add a delete link in the `show` View:
```
<td><a href="#" data-target-action="delete" data-target-id="<%- comment.id %>">Delete</a></td>
```
Then we need to wire up click handlers for the anchor tags to perform an http DELETE instead:
```
<script type="text/javascript">
  (function() {

    document.addEventListener("click", function(evt) {
      if (evt.target.tagName.toLowerCase() === 'a') {
        if (evt.target.dataset && evt.target.dataset.targetAction && evt.target.dataset.targetId) {
          evt.preventDefault();

          var xhr = new XMLHttpRequest();

          xhr.open('DELETE', "/comments/" + evt.target.dataset.targetId, true);
          xhr.setRequestHeader('Content-type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
              window.location.href = xhr.responseURL;
              return;
            }
          };

          xhr.send();
        }
      }
    });

  }());
</script>
```
Next we need to just wire that up in our Comments controller:
```
static async destroy(req, res) {
  const comment = await Comment.find(req.params["id"]);

  await Comment.destroy(comment.id);

  res.code(201).send(`/blog_posts/${comment.blogPostId}`);
}
```
Congratulations! Now you can delete comments on your posts.
