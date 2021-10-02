import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
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

  constructor(private socket: Socket) {}

  ngOnInit(): void {
    this.clientId = uuidv4();
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
}
