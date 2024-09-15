import * as fs from 'fs-extra';

const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[93m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const white = '\x1b[37m';
const reset = '\x1b[0m';

enum Status {
    TODO = 'todo',
    INPROGRESS = 'in-progress',
    DONE = 'done',

}
enum Action {
    ADD = 'add',
    UPDATE = 'update',
    DELETE = 'delete',
    PROGRESS = 'mark-in-progress',
    DONE = 'mark-done',
    LIST = 'list', 

}

interface Task{
    id: number;
    description: string;
    status: Status;
    createAt: string,
    updateAt: string,
}
const JSONFILE = 'tasks.json';
let tasks: Task[] = []; 
let nextId = 1;

const loadTasks = async () => {
    try {
        if (await fs.pathExists(JSONFILE)){
            tasks = await fs.readJSON(JSONFILE);
            nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id))+1:1;
        }
    }
    catch (error) {
        console.error(red+"Error loading tasks: "+reset, error);
    }
}

const saveTasks = async ()  => {
    try {
        await fs.writeJson(JSONFILE, tasks, {spaces: 2});
    }
    catch (error){
        console.error(red+"Error saving tasks: "+reset, error);
    }
}
const noID = () => {
    console.log("No such ID");
}
const createTask = (descrip: string) => {
    const initTime = new Date() .toISOString();
    const newTask: Task = {
        id: nextId++,
        description: descrip,
        status: Status.TODO,
        createAt: initTime,
        updateAt: initTime,
    };
    tasks.push(newTask);
    saveTasks();
    console.log(green+`Task added successfully (ID: ${newTask.id}) ${descrip}`+reset);
}

const updateTask = (id: number, descript: string) => {
    for(const t of tasks) {
        if(t.id === id){
            t.description = descript;
            t.updateAt = new Date().toISOString();
            saveTasks();
            console.log(green+"Task updated successfully"+reset);
            return;
        }
    }
    noID();
}

const deleteTask = (id: number) => {
    const originLen = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if(tasks.length < originLen){
        saveTasks();
        console.log(green+"Task deleted successfully"+reset);
    }
    else noID();
}

const updateStatus = (id: number, status: Status) => {
    for(const task of tasks){
        if(task.id === id){
            task.status = status;
            task.updateAt = new Date().toISOString();
            saveTasks();
            return;
        }
    }
    noID();
}

const listTasks = (status?: Status|string) => {
    const filteredTasks = status? tasks.filter(t => t.status === status): tasks;
    filteredTasks.forEach(t => {
        console.log(magenta+`${t.id}${reset} ${t.description} ${green}${t.status}${reset}`);
    });
}

const main = async () => {
    await loadTasks();
    process.stdout.write(yellow+"task-ctl "+reset);
    const stdin = process.stdin;
    stdin.setEncoding('utf-8');
    stdin.on('data', (input) => {
        const command = input.toString().trim();
        const lowerCaseCom = command.toLowerCase();
        if(lowerCaseCom === "quit" || lowerCaseCom === 'exit' || lowerCaseCom === 'q'){
            console.log(yellow+'Goodbye!'+reset);
            process.exit();
        }
        const parts = command.split(/\s+/);
        const action = parts[0];

        switch(action){
            case Action.ADD:
                createTask(parts.slice(1).join(" "))
                break;
            case Action.UPDATE:
                if (parts.length < 3){
                    console.log('Usage: update <id> <description>')
                }
                else {
                    updateTask(Number(parts[1]),  parts.slice(2).join(' '));
                }
                break;

            case Action.DELETE:
                if(parts.length < 2){
                    console.log('Usage: delete <id>');
                } 
                else{
                    deleteTask(Number(parts[1]));
                }
                break;

            case Action.PROGRESS:
                 if (parts.length < 2) {
                    console.log('Usage: mark-in-progress <id>');
                } else {
                    updateStatus(Number(parts[1]), Status.INPROGRESS);
                }
                break;

            case Action.DONE:
                if (parts.length < 2) {
                    console.log('Usage: mark-done <id>');
                } else {
                    updateStatus(Number(parts[1]), Status.DONE);
                }
                break;
            case Action.LIST:
                listTasks(parts[1]);
                break;
            default:
                console.log(red+'Invalid command'+reset);
                
        }
    process.stdout.write(yellow+"task-ctl "+reset); // Re-display the prompt
    })
};

main().catch(console.error);

