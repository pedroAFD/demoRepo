import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidemenuComponent } from './sidemenu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('SidemenuComponent', () => {
  let component: SidemenuComponent;
  let fixture: ComponentFixture<SidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuComponent, FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open sidenav when isSidenavOpened is set to true', () => {
    component.isSidenavOpened = false;
    component.isSidenavOpened = true;
    fixture.detectChanges();
    expect(component.isSidenavOpened).toBeTrue();
  });

  it('should set isCreatingNewTask to true when createNewTask is called', () => {
    component.createNewTask();
    expect(component.isCreatingNewTask).toBeTrue();
  });

  it('should reset selectedTask and isCreatingNewTask when cancelEdit is called', () => {
    component.selectedTask = { uid: 'T-1', title: 'Test', description: '', status: 'Backlog', priority: 'Low', dueDate: '', tags: [], createdAt: '', updatedAt: '', assignee: null };
    component.isCreatingNewTask = true;
    component.cancelEdit();
    expect(component.selectedTask).toBeNull();
    expect(component.isCreatingNewTask).toBeFalse();
  });
  it('should add a new task to tasks array when saveTask is called in create mode', () => {
    component.createNewTask();
    if (component.selectedTask) {
      component.selectedTask.title = 'New Task';
      component.selectedTask.description = 'Description';
      component.selectedTask.status = 'Backlog';
      component.selectedTask.priority = 'Low';
      component.selectedTask.dueDate = '2025-08-18';
      component.selectedTask.assignee = { id: 'U-1', name: 'Test User', email: 'test@example.com', avatarUrl: 'url.com/avatar' };
    }
    const initialLength = component.tasks.length;
    component.saveTask();
    expect(component.tasks.length).toBe(initialLength + 1);
    expect(component.isCreatingNewTask).toBeFalse();
    expect(component.selectedTask).toBeNull();
  });

  it('should not save task if required fields are missing', () => {
    spyOn(window, 'alert');
    component.createNewTask();
    if (component.selectedTask) {
      component.selectedTask.title = '';
      component.selectedTask.description = '';
      component.selectedTask.status = 'Backlog';
      component.selectedTask.priority = 'Low';
      component.selectedTask.dueDate = '';
      component.selectedTask.assignee = null;
    }
    const initialLength = component.tasks.length;
    component.saveTask();
    expect(window.alert).toHaveBeenCalled();
    expect(component.tasks.length).toBe(initialLength);
  });

  it('should update an existing task when saveTask is called in edit mode', () => {
    // Add a task to edit
    component.tasks = [{
      uid: 'T-1',
      title: 'Old Title',
      description: 'Old Description',
      status: 'Backlog',
      priority: 'Low',
      dueDate: '2025-08-18',
      tags: [],
      createdAt: '2025-08-18T04:09:32.891Z',
      updatedAt: '2025-08-18T04:09:32.891Z',
      assignee: { id: 'U-1', name: 'Test User', email: 'test@example.com', avatarUrl: 'url.com/avatar' }
    }];
    component.selectedTask = { ...component.tasks[0], title: 'Updated Title' };
    component.isCreatingNewTask = false;
    component.saveTask();
    expect(component.tasks[0].title).toBe('Updated Title');
    expect(component.selectedTask).toBeNull();
  });

  it('should set tags on selectedTask when updateTags is called', () => {
    component.createNewTask();
    component.tagsString = 'tag1, tag2, tag3';
    component.updateTags();
    expect(component.selectedTask?.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
  
  it('should open sidenav and set isCreatingNewTask to true when createNewTask is called', () => {
    component.isSidenavOpened = false;
    component.isCreatingNewTask = false;
    component.createNewTask();
    expect(component.isSidenavOpened).toBeTrue();
    expect(component.isCreatingNewTask).toBeTrue();
  });

  it('should clear tagsString when cancelEdit is called', () => {
    component.tagsString = 'tag1, tag2';
    component.cancelEdit();
    expect(component.tagsString).toBe('');
  });
});