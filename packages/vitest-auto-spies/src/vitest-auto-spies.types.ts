import { Observable } from 'rxjs';
import {
  AddObservableSpyMethods,
  AddPromiseSpyMethods,
  Func,
  AddAccessorsSpies,
  CreateSyncAutoSpy,
  CreateObservableAutoSpy,
  CreatePromiseAutoSpy,
} from '@hirez_io/auto-spies-core';
import { Mock, MockedFunction } from 'vitest';

export type Spy<ClassToSpyOn> = AddVitestAutoSpies<ClassToSpyOn> &
  AddAccessorsSpies<ClassToSpyOn, Mock>;

type AddVitestAutoSpies<ClassToSpyOn> = {
  [Key in keyof ClassToSpyOn /* 
  if it's a method */]: ClassToSpyOn[Key] extends Func
    ? AddSpyMethodsByReturnTypes<ClassToSpyOn[Key]>
    : // if it's a property of type Observable
    ClassToSpyOn[Key] extends Observable<infer ObservableReturnType>
    ? ClassToSpyOn[Key] & AddObservableSpyMethods<ObservableReturnType>
    : // If not a method or an observable, leave as is
      ClassToSpyOn[Key];
};

// Wrap the return type of the given function type with the appropriate spy methods
export type AddSpyMethodsByReturnTypes<Method extends Func> = Method &
  (Method extends (...args: any[]) => infer ReturnType
    ? // returns a Promise
      ReturnType extends Promise<infer PromiseReturnType>
      ? CreatePromiseAutoSpy<
          MockedFunction<Method>,
          AddPromiseSpyMethods<PromiseReturnType>,
          Method
        >
      : // returns an Observable
      ReturnType extends Observable<infer ObservableReturnType>
      ? CreateObservableAutoSpy<
          MockedFunction<Method>,
          AddObservableSpyMethods<ObservableReturnType>,
          Method
        >
      : // for any other type
        CreateSyncAutoSpy<
          Method,
          MockedFunction<Method>,
          AddCalledWithToVitestFunctionSpy<Method>
        >
    : never);

export interface AddCalledWithToVitestFunctionSpy<Method extends Func> {
  calledWith(...args: Parameters<Method>): {
    mockReturnValue: (value: ReturnType<Method>) => void;
  };
  mustBeCalledWith(...args: Parameters<Method>): {
    mockReturnValue: (value: ReturnType<Method>) => void;
  };
}
