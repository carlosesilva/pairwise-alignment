#Workflow

###Git
Pull from GitHub(makes sure the local develop branch is up to date with gitHub's develop branch)

    git pull origin develop

Create a new feature branch based on the up-to-date local devolop branch

    git checkout -b some-feature develop

###Gulp
Initialize gulp tasks on project folder (compile stylesheets, initialize browsersync and watch files for changes for compiling on save)

    gulp
or

    gulp default

###Back on Git
Work on feature (edit files then add and commit as many times needed)

    git status
    git add <some-file>
    git commit -m "Description of commit"

When done with feature, checkout develop branch

    git checkout develop

Pull from GitHub(makes sure the local develop branch is up to date with gitHub's develop branch)

    git pull origin develop

Merge feature into local develop

    git merge --no--ff some-feature

Push updated develop to GitHub
    
    git push

Delete some-feature branch if not needed anymore

    git branch -d some-feature



*******************************************************
*******************************************************
*******************************************************
#Old
*******************************************************
*******************************************************
*******************************************************
##[Git nvie gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)
[Simple Daily Git Workflow](simple_git_daily_workflow.pdf) ([src](https://www.sonassi.com/wp-content/uploads/2012/07/simple_git_daily_workflow.pdf))

##[SASS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)
Watch the /sass/ folder for changes and output to the /css/ folder

    sass --watch sass:css

##[BrowserSync.io](http://browsersync.io/docs)
Watch the root folder for changes

    browser-sync start --server --files "*.html, css/*.css, js/*.js"