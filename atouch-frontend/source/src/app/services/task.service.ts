import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(environment.apiEndpoint + 'tasks');
  }

  create(taskDTO: Task): Observable<Task> {
    return this.http.post<Task>(environment.apiEndpoint + 'tasks', taskDTO);
  }

  update(taskDTO: Task): Observable<Task> {
    return this.http.put<Task>(environment.apiEndpoint + 'tasks', taskDTO);
  }
}
