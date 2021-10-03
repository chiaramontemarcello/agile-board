import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/model/task';
import { TaskService } from 'src/app/services/task.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private taskService: TaskService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  save() {
    this.taskService.update(this.data).subscribe(() => {
      this.dialogRef.close();
    });
  }

  delete() {
    this.taskService.delete(this.data).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
