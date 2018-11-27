import { Injectable } from '@angular/core';

import { ElectronService } from './electron.service';

@Injectable()
export class DataService {

  constructor(private electron: ElectronService) {}

  bind(resource, id, event,  func) {
    let responseKey = `${this.getResource(resource, id)}/${event}`
    this.electron.listen(responseKey, func)
    this.send(resource, id, 'bind', { event })
  }

  create(resource, id, data) {
    this.send(resource, id, 'set', data);
  }

  delete(resource) {
    this.send(resource, null, 'remove', null)
  }

  update(resource, id, data) {
    this.send(resource, id, 'update', data);
  }

  private send(resource, id, action, data) {
    let transaction = {
      resource: this.getResource(resource, id),
      action,
      data
    }

    this.electron.notifyClient('database', transaction);
  }

  private getResource(resource, id) {
    return id ? `${resource}/${id}` : resource
  }
}
