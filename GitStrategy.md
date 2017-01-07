 Git Strategy
===================

This document describes the code management strategy for **CustomizableVizBoard**

**Project Owner: Tony Zhang** 
 
**Proxies: Aung Khant, Daniel Vu**

### Commit messages
Commit messages for this project should begin with the cerner associate id followed by a description of the change.
* Example: "Tony Fix the property filtering logic"

### Branch Strategy
* Create your own feature branch off of **dev** giving it a meaningful short name
* If you intend to deploy a snapshot version from this branch, do a first commit updating only the snapshot version of pom files, 
so it can be easily excluded whenever the feature branch is ready to be merged into a different branch ( **dev**, **master**) without going through merge conflicts.
* For complex projects (generally an epic jira with multiple sub-jiras and multiple engineers) you may want to branch off of the feature branch for the sub-jiras. 
Coordinate merges into the main feature branch with the other engineers.

### Merging to dev
In order to merge to **dev** the pull request must contain:
* Jira (with code review(s) and pull request linked to it)
* Code Review (closed and with comments being addressed)
* Jenkins Build (build for you branch with goals: 'clean verify site')

The pull request needs at least two +1s before changes can be merged.
The merge to **dev** must be completed by either the project owner or one of their proxies.

### Merging to Master
Once changes have been validated in dev,
open a new pull request to merge your feature branch in **master**.

Before merging to master, your feature branch needs to be *rebased onto* **master**

               Old                                                             Pre Pull Request

                                                                           /---------------------F--G   Feature A  
    A----B  Master                                                   A----B  Master
          \----C-----D-----E Dev                                           \----C-----D-----E Dev
                \-F-G----/   Feature A


                After Pull Close

    A----B-------------------------F--G Master
          \----C----D----E  Dev

Click [here](https://www.kernel.org/pub/software/scm/git/docs/git-rebase.html) for more information about rebasing.

In order to merge to **master** the pull request must contain:
* Jira (with code review(s) and pull request linked to it)
* Code Review (closed and with comments being addressed)
	* Can alternatively include a link to a dev pull request that has the code review links
* Jenkins Build (build for you branch with goals: 'clean verify site')


The pull request needs at least two +1s before changes can be merged.
The merge to **master** must be completed by either the project owner.

After a pull request is closed, the feature branch should be deleted.