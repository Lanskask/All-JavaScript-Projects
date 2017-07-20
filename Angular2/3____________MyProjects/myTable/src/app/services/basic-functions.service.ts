import { Injectable } from '@angular/core';

@Injectable()
export class BasicFunctionsService {

  constructor() { }

  deepCopy<T>(objectToCopy: T): T {
    return JSON.parse(JSON.stringify(objectToCopy));
  }
}
