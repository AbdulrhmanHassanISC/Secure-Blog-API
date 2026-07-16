require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/postsModel');
const User = require('../models/usermodel');
const Category = require('../models/categoryModel');
const connectDB = require('../config/db');

const postsData = [
  {
    title: 'Getting Started with Nuxt 4',
    image: 'nuxt.svg',
    content: `Nuxt 4 brings a lot of exciting features to the Vue ecosystem. In this post, we'll explore the new directory structure, auto-imports, and the improved developer experience.

## What's New

The new version introduces a more intuitive project structure. The \`app/\` directory now serves as the main entry point, making it clearer where application code lives.

## Key Features

- **Auto-imports**: Components, composables, and utilities are automatically imported
- **File-based routing**: Pages are automatically generated from your file structure
- **Hybrid rendering**: Choose between static generation, server-side rendering, or client-side rendering per page`,
  },
  {
    title: 'Building RESTful APIs with Express',
    image: 'express.svg',
    content: `Express.js remains one of the most popular web frameworks for Node.js. Here's how to build a clean, scalable RESTful API.

## Project Structure

Organizing your Express application properly is crucial for maintainability. Use a modular approach with separate folders for routes, controllers, models, and middleware.

## Best Practices

- Use proper HTTP status codes
- Implement input validation
- Add authentication and authorization
- Handle errors gracefully with middleware

## Error Handling

A centralized error handler middleware keeps your code clean and ensures consistent error responses across your API.`,
  },
  {
    title: 'MongoDB Performance Optimization Tips',
    image: 'mongodb.svg',
    content: `MongoDB is a powerful NoSQL database, but like any database, it requires careful optimization for production use.

## Indexing Strategies

Proper indexing can dramatically improve query performance. Use compound indexes for queries that filter on multiple fields.

## Aggregation Pipeline

The aggregation pipeline is one of MongoDB's most powerful features. Learn to use \$match, \$group, \$sort, and \$lookup effectively.

## Common Pitfalls

- Not using indexes on frequently queried fields
- Fetching more data than needed
- Ignoring the explain() output

With these tips, you can keep your MongoDB queries fast even as your data grows.`,
  },
  {
    title: 'Tailwind CSS v4: What You Need to Know',
    image: 'tailwind.svg',
    content: `Tailwind CSS v4 introduces a completely new engine and several breaking changes. Here's what you need to know to upgrade.

## New Features

The new version is built on a Rust-based engine, making builds significantly faster. The configuration has been simplified with CSS-based configuration.

## Migration Guide

Moving from v3 to v4 requires some changes. The configuration file format has changed, and some utility classes have been renamed or removed.

## Key Changes

- CSS-first configuration instead of JavaScript config
- New color palette
- Improved dark mode support
- Better performance with JIT compilation`,
  },
  {
    title: 'JWT Authentication Deep Dive',
    image: 'jwt.svg',
    content: `JSON Web Tokens (JWT) are a popular method for handling authentication in modern web applications.

## How JWT Works

A JWT consists of three parts: header, payload, and signature. The server signs the token with a secret key, and the client sends it with each request.

## Implementation

Implementing JWT authentication involves token generation on login, token verification on protected routes, and token refresh mechanisms.

## Security Considerations

- Store tokens securely (httpOnly cookies)
- Implement token expiration
- Use refresh tokens for longer sessions
- Never store sensitive data in the payload

Understanding these concepts is essential for building secure applications.`,
  },
  {
    title: 'Vue 3 Composition API Patterns',
    image: 'vue.svg',
    content: `The Composition API in Vue 3 provides a powerful way to organize component logic. Here are some patterns I've found useful.

## Composables

Custom composables allow you to extract and reuse stateful logic across components. They're the Vue 3 equivalent of React hooks.

## Reactive State

Use \`ref\` for primitive values and \`reactive\` for objects. The \`computed\` function provides derived state that updates automatically.

## Lifecycle Hooks

The Composition API provides \`onMounted\`, \`onUnmounted\`, and other lifecycle hooks that work inside \`setup()\`.

These patterns help keep your components clean and your logic reusable.`,
  },
  {
    title: 'CSS Grid Layout Mastery',
    image: 'css.svg',
    content: `CSS Grid is the most powerful layout system in CSS. Here's how to master it.

## Grid Basics

Define a grid container with \`display: grid\`, then use \`grid-template-columns\` and \`grid-template-rows\` to define the structure.

## Advanced Techniques

- Auto-fit and auto-fill for responsive layouts
- Grid areas for complex layouts
- Implicit grids for dynamic content

## Real-World Examples

From simple card layouts to complex dashboard designs, CSS Grid can handle it all. Combined with media queries, you can create truly responsive designs.

Learn these techniques and you'll never struggle with layout again.`,
  },
  {
    title: 'Node.js Streams for Beginners',
    image: 'nodejs.svg',
    content: `Node.js Streams are one of Node.js's most powerful features, but they can be intimidating for beginners.

## What Are Streams?

Streams allow you to process data piece by piece instead of loading it all into memory at once. This is crucial for handling large files or real-time data.

## Types of Streams

- **Readable**: Source of data
- **Writable**: Destination for data
- **Transform**: Modify data as it passes through

## Practical Example

Processing a large CSV file with streams uses minimal memory compared to reading the entire file. This makes your application more scalable and efficient.

Start using streams today to build more performant Node.js applications.`,
  },
  {
    title: 'Docker for Web Developers',
    image: 'docker.svg',
    content: `Docker simplifies development by providing consistent environments across different machines.

## Why Docker?

Eliminates the "it works on my machine" problem. Every developer gets the same environment, making onboarding faster and reducing bugs.

## Docker Compose

Define your entire stack — web server, database, cache — in a single docker-compose.yml file. Start everything with one command.

## Best Practices

- Use multi-stage builds to keep images small
- Leverage Docker cache for faster builds
- Use .dockerignore to exclude unnecessary files

Docker is an essential tool for modern web development workflows.`,
  },
  {
    title: 'The Complete Guide to Web Security Headers',
    image: 'security.svg',
    content: `HTTP security headers are a crucial line of defense against common web vulnerabilities.

## Essential Headers

- **Content-Security-Policy**: Prevents XSS attacks
- **Strict-Transport-Security**: Enforces HTTPS
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing

## Implementation

Most web frameworks and servers allow you to set these headers easily. For Express, use the \`helmet\` package.

## Testing

Use tools like Mozilla Observatory to check your site's security headers and get a rating. Aim for an A+ grade.

Protect your users by implementing these headers today.`,
  },
];

const seedPosts = async () => {
  try {
    await connectDB();

    const admin = await User.findOne({ email: 'admin@admin.com' });
    if (!admin) {
      console.log('Admin user not found. Run seedAdmin.js first.');
      process.exit(1);
    }

    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found. Please create some categories first.');
      process.exit(1);
    }

    await Post.deleteMany({});
    console.log('Deleted existing posts.');

    const posts = postsData.map((post) => ({
      title: post.title,
      content: post.content,
      author: admin._id,
      category: categories[Math.floor(Math.random() * categories.length)]._id,
      images: [`public/uploads/posts/${post.image}`],
    }));

    await Post.insertMany(posts);
    console.log(`Successfully created ${posts.length} posts!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
