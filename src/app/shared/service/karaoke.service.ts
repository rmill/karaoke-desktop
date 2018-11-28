import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DataService } from './data.service';

@Injectable()
export class KaraokeService {
  
  readonly songQueue: Observable<Song[]>;

  private queue: Song[] = [];

  private songQueueSubject = new BehaviorSubject<Song[]>([]);

  constructor(private data: DataService) {
    this.songQueue = this.songQueueSubject.asObservable();
    this.data.bind('requests', null, 'child_added', song => this.addSong(song));
  }

  public next() {
    if (this.queue.length > 0) {
      this.queue.shift();
      this.songQueueSubject.next(this.queue);
    }
  }

  private addSong(song: Song) {
    this.queue.push(song);
    this.songQueueSubject.next(this.queue);
  }
}

export interface Song {
  id?: string;
  name: string;
  thumbnail: string;
  userId?: string;
  userName: string;
  videoId: string;
}
