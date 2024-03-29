#How to work on this repo
===========================
Create a branch off of master called LASTNAME-branch or whatever you want
[GitHub cheat sheet](https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf)
Always make sure your branch is up to date with master before trying to merge. 
>I think it would be cool if instead of automatically merging to master we did pull requests to master, and have someone test the request and make sure that it wont break anything in master

The first time you clone, you are going to have to run `npm install` in the root directory of your project to install all of the node dependencies. 

I have nodemon installed as a dev dependency, which is a tool that restarts the server every time you save a file. This way you don't have to stop and restart the server during development. 
Install nodemon as a dev dependency by running `npm install -D nodemon`

Inside the package.json file I added a script for running this project while you are testing. 
Run `npm run dev` and this will start up a development server on localhost:5000 using nodemon

Anything that you see dealing with passport.js I have not figured out yet so you can ignore that.

We need to layout our DB structure before we can all share the same schema. If you want to start testing on your own local sql environment, you will need to update config/databse.js
We are going to use a really handy node module called [Sequelize](http://docs.sequelizejs.com/) which will do a lot of the dirty work for us. Follow the docs on how to set up your own models and connection strings and whatnot.

>If you have any questions definitely let me know

#Relevant Links
=====================
[Bcrypt](https://www.npmjs.com/package/bcrypt)<br/><br/>
[Express](https://expressjs.com/en/api.html)<br/><br/>
[Handlebars](https://handlebarsjs.com/)<br/><br/>
[Sequelize](http://docs.sequelizejs.com/)<br/><br/>
[Passport](http://www.passportjs.org/)
