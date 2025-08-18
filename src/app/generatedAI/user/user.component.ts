//AI generated

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../../models/user';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatButtonModule, FormsModule,
    MatSidenav, MatSidenavContainer, MatSidenavContent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'avatarUrl'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedUser: User | null = null;
  isCreatingNewUser: boolean = false;
  filterValue: string = '';
  isSidenavOpened: boolean = false;

  ngOnInit(): void {
    // Replace with your actual user data loading logic
    this.users = [
      { id: 'U-1', name: 'Alice', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
      { id: 'U-2', name: 'Bob', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=2' }
    ];
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      return (
        user.id.toLowerCase().includes(filter) ||
        user.name.toLowerCase().includes(filter) ||
        user.email.toLowerCase().includes(filter)
      );
    };
    this.dataSource.filter = filter;
  }

  onRowClick(row: User) {
    this.selectedUser = { ...row };
    this.isCreatingNewUser = false;
  }

  createNewUser() {
    this.selectedUser = { id: '', name: '', email: '', avatarUrl: '' };
    this.isCreatingNewUser = true;
  }

  saveUser() {
    if (!this.selectedUser) return;
    // Basic validation
    if (
      !this.selectedUser.name.trim() ||
      !this.selectedUser.email.trim()
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    if (this.isCreatingNewUser) {
      this.selectedUser.id = 'U-' + (this.users.length + 1);
      this.users.push({ ...this.selectedUser });
      this.dataSource.data = [...this.users];
    } else {
      const idx = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (idx !== -1) {
        this.users[idx] = { ...this.selectedUser };
        this.dataSource.data = [...this.users];
      }
    }
    this.selectedUser = null;
    this.isCreatingNewUser = false;
  }

  cancelEdit() {
    this.selectedUser = null;
    this.isCreatingNewUser = false;
  }
}