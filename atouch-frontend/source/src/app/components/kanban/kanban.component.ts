import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Task } from 'src/app/model/task';
import { TaskService } from 'src/app/services/task.service';
import { Coordinate } from 'src/app/shared/draggable.directive';
import { v4 as uuidv4 } from 'uuid';

export interface PositionUpdate {
  coordinates: Coordinate;
  clientId: string;
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  clientId: string = '';
  position = this.socket.fromEvent<PositionUpdate>('positionUpdate');
  tasks: Task[] = [];
  status: { a_todo: Task[]; b_doing: Task[]; c_done: Task[] } = {
    a_todo: [],
    b_doing: [],
    c_done: [],
  };

  constructor(private socket: Socket, private taskService: TaskService) {}

  ngOnInit(): void {
    this.clientId = uuidv4();
    this.taskService.getAll().subscribe({
      next: (res) => {
        this.status.a_todo = res.filter((t) => t.status === 0);
        this.status.b_doing = res.filter((t) => t.status === 1);
        this.status.c_done = res.filter((t) => t.status === 2);
      },
    });
  }

  openDetail(task: any) {
    console.log(task);
  }

  assignTask(task: any, user: any) {
    console.log('This is our dragged task model: ');
    console.log(task);

    console.log('This is our user: ');
    console.log(user);
  }

  logCoords(coords: Coordinate) {
    const positionUpdate: PositionUpdate = {
      coordinates: coords,
      clientId: this.clientId,
    };
    this.socket.emit('positionUpdate', positionUpdate);
  }

  createTask() {
    const taskDTO = {
      uuid: '',
      title: 'generated from angular',
      sequence: 12345,
      status: 1,
    };

    this.taskService.create(taskDTO).subscribe({
      next: (res) => {
        console.log('created new task from angular');
      },
    });
  }
}
