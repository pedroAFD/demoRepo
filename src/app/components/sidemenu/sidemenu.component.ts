import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TaskHandlerService } from '../../services/task-handler.service';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task';
import { User } from '../../models/user';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    MatSidenavModule, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit, OnDestroy, AfterViewInit {  
  isSidenavOpened: boolean = true;

  //Subscriptions
  subscriptions: Subscription[] = [];
  //Data
  tasks: Task[] = [];
  users: User[] = [];

  //Table Stuff
  displayedColumns: string[] = [
    'uid',
    'title',
    'description',
    'requester',
    'status',
    'priority',
    'dueDate',
    'tags',
    'createdAt',
    'updatedAt'    
  ];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValue: string = '';
  statusFilter: string = '';

  //edit and create data
  selectedTask: Task | null = null;
  tagsString: string = '';
  isCreatingNewTask: boolean = false;

  //Special boolean for responsive
  isMobileAndSidenavOpen(): boolean {
    return window.innerWidth <= 768 && this.isSidenavOpened;
  }

  constructor(private taskService: TaskHandlerService) { }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'requester':
          return item.assignee?.name?.toLowerCase() || '';
        case 'title':
          return item.title?.toLowerCase() || '';
        case 'description':
          return item.description?.toLowerCase() || '';
        case 'status':
          return item.status || '';
        case 'priority':
          return item.priority || '';
        case 'dueDate':
          return item.dueDate || '';
        case 'createdAt':
          return item.createdAt || '';
        case 'updatedAt':
          return item.updatedAt || '';
        case 'tags':
          return item.tags?.join(',').toLowerCase() || '';
        case 'uid':
          return item.uid || '';
        default:
          return '';
      }
    };
    this.subscriptions.push(
      this.taskService.getAllData().subscribe(data => {        
        this.tasks = data.tasks;
        this.users = data.users;
        this.dataSource.data = this.tasks;
      }, error => {
        console.error('Error fetching data:', error);
      })
    )    
  }

  applyFilter() {
    const filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (task: Task, filter: string) => {
      const matchesUid = task.uid?.toLowerCase().includes(filter) ?? false;
      const matchesTitle = task.title?.toLowerCase().includes(filter) ?? false;
      const matchesDescription = task.description?.toLowerCase().includes(filter) ?? false;
      const matchesStatus = this.statusFilter ? task.status === this.statusFilter : task.status?.toLowerCase().includes(filter) ?? false;
      const matchesPriority = task.priority?.toLowerCase().includes(filter) ?? false;                  
      const matchesRequester = task.assignee?.name?.toLowerCase().includes(filter) ?? false;
      //tags handling since they're multiple ones
      const matchesTags = task.tags?.join(',').toLowerCase().includes(filter) ?? false;
      //dates handling so it matches pipe on HTML
      const rawDueDate = task.dueDate?.toLowerCase() ?? '';
      const formattedDueDate = task.dueDate ? formatDate(task.dueDate, 'mediumDate', 'en-US').toLowerCase() : '';
      const matchesDueDate = rawDueDate.includes(filter) || formattedDueDate.includes(filter);
       
      const rawCreatedAt = task.createdAt?.toLowerCase() ?? '';
      const formattedCreatedAt = task.createdAt ? formatDate(task.createdAt, 'mediumDate', 'en-US').toLowerCase() : '';
      const matchesCreatedAt = rawCreatedAt.includes(filter) || formattedCreatedAt.includes(filter);
      
      const rawUpdatedAt = task.updatedAt?.toLowerCase() ?? '';
      const formattedUpdatedAt = task.updatedAt ? formatDate(task.updatedAt, 'mediumDate', 'en-US').toLowerCase() : '';
      const matchesUpdatedAt = rawUpdatedAt.includes(filter) || formattedUpdatedAt.includes(filter);
      const matchesText = (
        matchesUid ||
        matchesTitle ||
        matchesDescription ||
        matchesPriority ||
        matchesDueDate ||
        matchesTags ||
        matchesCreatedAt ||
        matchesUpdatedAt ||
        matchesRequester ||
        matchesStatus
      );

      return matchesText;
    };
    this.dataSource.filter = filter;
  }

  onStatusFilterChange() {
    this.applyFilter();
  }

  onRowClick(row: Task) {    
    const assignee = this.users.find(u => row.assignee && u.id === row.assignee.id) || null;
    this.selectedTask = { ...row, assignee };
    this.tagsString = row.tags?.join(', ') ?? '';
    this.isSidenavOpened = true;
    this.isCreatingNewTask = false;
  }

  updateTags() {
    if (this.selectedTask) {
      this.selectedTask.tags = this.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }  

  createNewTask() {
    const newTask: Task = {
      uid: 'T-' + (this.tasks.length + 1),
      title: '',
      description: '',
      status: 'Backlog',
      priority: 'Low',
      dueDate: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: null
    };
    this.selectedTask = newTask;
    this.tagsString = '';
    this.isSidenavOpened = true;
    this.isCreatingNewTask = true;
  }

  saveTask() {
    if (!this.selectedTask) return;
    
    const requiredFields = [
      this.selectedTask.title,
      this.selectedTask.description,
      this.selectedTask.status,
      this.selectedTask.priority,
      this.selectedTask.dueDate,
      this.selectedTask.assignee
    ];
    if (requiredFields.some(field => !field || (typeof field === 'string' && field.trim() === ''))) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    const idx = this.tasks.findIndex(t => t.uid === this.selectedTask!.uid);
    if (idx !== -1) {
      this.selectedTask.updatedAt = new Date().toISOString();
      this.tasks[idx] = { ...this.selectedTask };
      this.dataSource.data = [...this.tasks];      
    } else if (this.isCreatingNewTask) {
      this.selectedTask.createdAt = new Date().toISOString();
      this.selectedTask.updatedAt = new Date().toISOString();
      this.tasks.push({ ...this.selectedTask });
      this.dataSource.data = [...this.tasks];      
    }
    
    this.selectedTask = null;
    this.isCreatingNewTask = false;
    this.tagsString = '';
  }

  cancelEdit() {
    this.selectedTask = null;
    this.isCreatingNewTask = false;
    this.tagsString = '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.tasks;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); 
  }
}

