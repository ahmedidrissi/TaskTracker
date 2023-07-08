import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Task';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, updateDoc, addDoc, deleteDoc, doc } from "firebase/firestore";
import { environment } from 'src/environments/environment.development';

const app = initializeApp(environment.firebase);
const db = getFirestore(app);

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    let tasks: Task[] = [];
    const taskRef = collection(db, "tasks");
    const q = query(taskRef);
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as Task);
      });
    });

    return new Observable<Task[]>(observer => {
      observer.next(tasks);
    });
  }

  deleteTask(task : Task): Observable<Task> {
    // delete task from db
    let docId : string = "";
    const q = query(collection(db, "tasks"), where("id", "==", task.id));
    const querySnapshot = getDocs(q);
    querySnapshot.then((querySnapshot) => {
      querySnapshot.forEach((docc) => {
        docId = docc.id;
        deleteDoc(doc(db, "tasks", docId));
      });
    }
    );

    return new Observable<Task>(observer => {
      observer.next(task);
    }
    );
  }

  async updateTaskReminder(task : Task): Promise<Observable<Task>> {
    let docId : string = "";
    const q = query(collection(db, "tasks"), where("id", "==", task.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docc) => {
      docId = docc.id;
      updateDoc(doc(db, "tasks", docId), {
        reminder: task.reminder
      });
    });

    return new Observable<Task>(observer => {
      observer.next(task);
    }
    );
  }

  addTask(task : Task): Observable<Task> {

    // get last task id and increment
    let lastTaskId : number = 0;
    const q = query(collection(db, "tasks"), where("id", ">", 0));
    const querySnapshot = getDocs(q);
    querySnapshot.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data()['id'] > lastTaskId) {
          lastTaskId = doc.data()['id'];
        }
      });
    }).then(() => {
      let payload = {
        id: lastTaskId + 1,
        text: task.text,
        day: task.day,
        reminder: task.reminder
      };
      const docRef = collection(db, "tasks");
      addDoc(docRef, payload);
    });
    
    return new Observable<Task>(observer => {
      observer.next(task);
    }
    );
  }
}