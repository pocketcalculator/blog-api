const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();
// load morgan for logging
app.use(morgan('common'));

// we're going to add some posts to our blog
// so there's some data to look at
BlogPosts.create('Who runs this blog?', 'Just wondering who runs this thing.  Reply back, thanks!', 'JimFromPhoenix', 'January 5, 2018');
BlogPosts.create('Hi all, first time, long time!', 'Hi blog owner, this is the first time responding to one of these, I think you are great!', 'Owen', 'January 11, 2018');
BlogPosts.create('I am starting a flame war.', 'I know everyone is going to responde, that is why I am saying this: Dr. Pepper is better than Coke.', 'Jenni2018', 'January 22, 2018');

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
  // ensure `title` `content` and `author` are in request body
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(post);
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post entry \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post entry \`${req.params.ID}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
