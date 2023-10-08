import { Observable, Subject, map } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise|null>();
  exercisesChanged = new Subject<Exercise[]>();
  private exercisesCollection!: CollectionReference;
  // exercises$!: Observable<Exercise[]>;
  firestore: Firestore = inject(Firestore);
  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise | null;
  private exercises: Exercise[] = [];

  fetchAvailableExercises() {
    this.exercisesCollection = collection(this.firestore, 'availableExercises');
    collectionData(this.exercisesCollection, { idField: 'id'}).pipe(
      map(arr => arr.map(val => val as Exercise))
    ).subscribe({
      next: exercises => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises])
      }
    });
  }
  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    ) ?? null;
    if (this.runningExercise)
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    if (this.runningExercise)
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    if (this.runningExercise)
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}