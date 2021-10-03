import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { Task } from 'src/app/model/task';
import { TaskService } from 'src/app/services/task.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Coordinate } from 'src/app/shared/draggable.directive';
import { v4 as uuidv4 } from 'uuid';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

export interface PositionUpdate {
  coordinates: Coordinate;
  clientId: string;
  objectId: string;
}

export interface DropZone {
  name: string;
  status: number;
  tasks: Task[];
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  clientId: string = '';

  position: Observable<PositionUpdate> = of();

  tasks: Task[] = [];

  viewPortDim = { height: window.innerHeight, width: window.innerWidth };

  taskToUpdate = '';

  dropzones: DropZone[] = [
    { name: 'To Do', status: 0, tasks: [] },
    { name: 'Doing', status: 1, tasks: [] },
    { name: 'Done', status: 2, tasks: [] },
  ];

  status: { a_todo: Task[]; b_doing: Task[]; c_done: Task[] } = {
    a_todo: [],
    b_doing: [],
    c_done: [],
  };

  constructor(
    private socket: Socket,
    private taskService: TaskService,
    private webSocketService: WebsocketService,
    public dialog: MatDialog
  ) {
    this.clientId = uuidv4();
  }

  ngOnInit(): void {
    this.viewPortDim = { height: window.innerHeight, width: window.innerWidth };
    console.log(this.viewPortDim);

    this.getAllTasks();
    this.subscribeToWebSocketChanges();
  }

  openDetail(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, { data: task });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  objectDropped(item: any) {
    console.log('dropped', item);
  }

  getAllTasks() {
    this.taskService.getAll().subscribe({
      next: (res) => {
        this.dropzones.forEach((dropzone) => {
          dropzone.tasks = res.filter((t) => t.status === dropzone.status);
        });
        this.webSocketService.resetPosition(this.taskToUpdate);
      },
    });
  }

  subscribeToWebSocketChanges() {
    this.webSocketService.taskUpdate.subscribe((task: Task) => {
      console.log(task);
      if (task && task.status) {
        this.taskToUpdate = task.uuid;
        const indexOfTask = this.dropzones[task.status].tasks.findIndex((t) => {
          t.uuid === task.uuid;
        });
        this.dropzones[task.status].tasks.splice(indexOfTask, 1);
      }
      this.getAllTasks();
    });

    this.webSocketService.updateView.subscribe((message) => {
      if (message) {
        if (message.action === 'reload_all_tasks') {
          this.getAllTasks();
        }
      }
    });
  }

  createTask() {
    const taskDTO = {
      uuid: '',
      title: 'New Task',
      sequence: 42,
      status: 0,
    };

    this.taskService.create(taskDTO).subscribe({
      next: (res) => {
        console.log('created new task from angular');
      },
    });
  }

  assignTask(task: Task, dropzone: DropZone) {
    console.log('This is our dragged task model: ', task, 'into', dropzone);
    let taskDTO: Task = Object.assign({}, task);
    taskDTO.status = dropzone.status;
    console.log('new Task', taskDTO);
    const indexOfTask = this.dropzones[task.status].tasks.findIndex((t) => {
      t.uuid === task.uuid;
    });
    this.dropzones[task.status].tasks.splice(indexOfTask, 1);

    this.taskService.update(taskDTO).subscribe(() => {});
  }
}
