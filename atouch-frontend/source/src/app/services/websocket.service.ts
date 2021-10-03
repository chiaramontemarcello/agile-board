import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { PositionUpdate } from '../components/kanban/kanban.component';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  position: BehaviorSubject<any> = new BehaviorSubject(null);
  taskUpdate: BehaviorSubject<any> = new BehaviorSubject(null);
  updateView: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private socket: Socket) {
    this.socket.fromEvent<PositionUpdate>('positionUpdate').subscribe((pos) => {
      this.position.next(pos);
    });

    this.socket.fromEvent<PositionUpdate>('taskUpdated').subscribe((pos) => {
      this.taskUpdate.next(pos);
    });

    this.socket.fromEvent<PositionUpdate>('updateView').subscribe((pos) => {
      this.updateView.next(pos);
    });
  }

  emitNewPosition(positionUpdate: PositionUpdate) {
    this.socket.emit('positionUpdate', positionUpdate);
  }

  resetPosition(objectId: string) {
    this.socket.emit('updateView', {
      action: 'reset_location',
      objectId: objectId,
    });
  }

  reloadAllTasks() {
    this.socket.emit('updateView', {
      action: 'reload_all_tasks',
      objectId: '',
    });
  }
}
