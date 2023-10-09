import { Observable, Subject, map } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exercise$ = new Subject<Exercise|null>();
  exercises$ = new Subject<Exercise[]>();
  finishedExercises$ = new Subject<Exercise[]>();
  private exercisesCollection!: CollectionReference;
  // exercises$!: Observable<Exercise[]>;
  firestore: Firestore = inject(Firestore);
  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise | null;
  private exercises: Exercise[] = [];

  fetchAvailableExercises() {
    if (!this.exercisesCollection)
      this.exercisesCollection = collection(this.firestore, 'availableExercises');
    collectionData(this.exercisesCollection, { idField: 'id'}).pipe(
      map(arr => arr.map(val => val as Exercise))
    ).subscribe({
      next: exercises => {
        this.availableExercises = exercises;
        this.exercises$.next([...this.availableExercises])
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
    this.exercise$.next({ ...this.runningExercise });
  }

  completeExercise() {
    if (this.runningExercise)
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exercise$.next(null);
  }

  cancelExercise(progress: number) {
    if (this.runningExercise)
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exercise$.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    const collectionRef = collection(this.firestore, 'finishedExercises');
    collectionData(collectionRef,{ idField: 'id'}).pipe(
      map(arr => arr.map(val => val as Exercise))
    ).subscribe({
      next: res => {
        this.finishedExercises$.next(res);
      }
    })

  //   onSnapshot(collectionRef, (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //         console.log("New exercise: ", change.doc.data());
  //       }
  //       if (change.type === "modified") {
  //         console.log("Modified exercise: ", change.doc.data());
  //       }
  //       if (change.type === "removed") {
  //         console.log("Removed exercise: ", change.doc.data());
  //       }
  //     });
  //   });
    // return this.exercises.slice();

  }

  private addDataToDatabase(exercise: Exercise) {
      const pastExercisesCollection = collection(this.firestore, 'finishedExercises');
      addDoc(pastExercisesCollection, exercise).then(() => {
        console.log('Exercise added successfully');
      }).catch((error) => {
        console.error('Error adding exercise: ', error);
      });
  }
}