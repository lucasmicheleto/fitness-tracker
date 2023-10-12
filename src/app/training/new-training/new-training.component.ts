import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { Observable, shareReplay } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$!: Observable<Exercise[]|null>;

  constructor(private trainingService: TrainingService
    , public uiService: UIService
    ) { }

  ngOnInit() {
    // this.exercisesCollection = collection(this.firestore, 'availableExercises');
    // this.exercises$ = collectionData(this.exercisesCollection, { idField: 'id'}).pipe(
    //   map(arr => arr.map(val => val as Exercise))
    // );
    this.exercises$ = this.trainingService.exercises$.pipe(shareReplay());
    this.trainingService.fetchAvailableExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
