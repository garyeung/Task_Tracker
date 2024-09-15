# About The Project
Task tracker is a project used to track and manage your tasks. You can use a simple command line interface (CLI) to track what you need to do, what you have done, and what you are currently working on.   
This project from
<a href="https://roadmap.sh/projects/task-tracker" target="_blank">roadmap</a>

## Rerequisites
```sh
npm install npm@latest -g
```
## Installation 
```sh
git clone https://github.com/garyeung/Task_Tracker.git

cd Track_Tracker

npm install 

```

## Usages
### Run the application:
```sh
npx ts-node taskTrack.ts
```

### Available Commands:

```sh
1. Add a task:

  add <description>

2. Update a task:

  update <id> <new description>

3. Delete a task:

  delete <id> 

4. Mark a task as in-progress:

  mark-in-progress <id> 


5. Mark a task as done:

  mark-done <id>

6. List all tasks or tasks by status:

  list [status]

7. Exit the application:

  quit
```

## Example
```sh
task-ctl add "Finish the project"
task-ctl list
task-ctl update 1 "Finish the project with tests"
task-ctl mark-in-progress 1
task-ctl mark-done 1
task-ctl delete 1
```

## Dependencies

- typescript: For TypeScript support.
- fs-extra: For file system operations.
- @types/node: Type definitions for Node.js.