import { Subscription } from 'rxjs';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  filter = '';
  private exercisesSub!: Subscription;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;


  constructor(private trainingService: TrainingService) {}
  ngOnDestroy(): void {
    this.exercisesSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.exercisesSub = this.trainingService.finishedExercises$.subscribe({
      next: res => this.dataSource.data = res
    });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  doFilter() {
    this.dataSource.filter = this.filter.trim().toLocaleLowerCase();
  }
}
