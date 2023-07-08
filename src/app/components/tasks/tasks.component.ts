import { Component, OnInit } from '@angular/core';
import { Task } from '../../Task';
import { TaskService } from '../../services/task.service';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';

const auth = getAuth();

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks : Task[] = [];

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  deleteTask(task : Task): void {
    this.taskService.deleteTask(task).subscribe(() => (this.tasks = this.tasks.filter(t => t.id !== task.id)));
  }

  async toggleReminder(task : Task): Promise<void> {
    task.reminder = !task.reminder;
    (await this.taskService.updateTaskReminder(task)).subscribe();
  }

  addTask(task : Task): void {
    this.taskService.addTask(task).subscribe((task) => (this.tasks.push(task)));
  }

  logout(): void {
    signOut(auth).then(() => {
      console.log('Sign-out successful.');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log(error);
    });
  }

}
