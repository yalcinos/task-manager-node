# Task manager Nodejs

Description will be provided..

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

To be able to code in this project you need to install on your machine:

1. [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
2. [Git](https://git-scm.com/) - A free and open source distributed version control system.
3. [Visual Studio Code](https://code.visualstudio.com/) - A source-code editor developed by Microsoft for Windows, Linux and macOS.

### Installing

A step by step to get a development env running

1. Clone our repository using git, open a Command Prompt (Windows) or Terminal (Mac), go to a folder where you will save a copy of our project in your machine. Type this command:

```
git clone https://github.com/yalcinos/task-manager-node.git
```

2. Open the project directory which was created during the clone command execution:

```
cd task-manager-node
```

3. Install all npm packages dependencies in your machine:

```
npm i
```

4. Start Coding - Open Visual Studio Code:

```
code .
```

5. Run this project - We are using [nodemon](https://www.npmjs.com/package/nodemon) to automatically restarting the node application when file changes in the directory are detected

```
npm start or nodemon src/index.js
```

## Version Control

Before start, you need to create a **new branch with the issue id (issue + issue id)**. Always code inside this branch.

```
git checkout -b issue1
```

When you do a commit follow these simple rules:

1. You need to specify the type of commit:
   - **feat**: The new feature you're adding to a particular application
   - **fix**: A bug fix
   - **style**: Feature and updates related to styling
   - **refactor**: Refactoring a specific section of the codebase
   - **test**: Everything related to testing
   - **docs**: Everything related to documentation
   - **chore**: Regular code maintenance.
2. Always indicate the issue id;
3. Provide a short description of what you did;

An example of your commit description

```
feat [#1] - New endpoint returning all Provinces in Canada
```

## Built With

- [Node.JS](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](http://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - An object-oriented, simple, dynamic, and scalable NoSQL database

## Authors

- **Yalcin Tatar** - Software Developer - [Linkedin](https://www.linkedin.com/in/yalcin-tatar/) / [GitHub](https://github.com/yalcinos)

See also the list of [contributors](https://github.com/bivt-cap/bivt-backend/contributors) who participated in this project.

## License

This project is licensed under the GNU GENERAL PUBLIC License - see the [LICENSE.md](https://github.com/bivt-cap/bivt-backend/blob/master/LICENSE) file for details
