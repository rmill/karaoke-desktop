import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { KaraokeService, Song } from '../shared/service/karaoke.service';

@Component({
  selector: 'karaoke-idle',
  styleUrls: ['./idle.component.css'],
  templateUrl: 'idle.component.html',
})
export class IdleComponent {

    private songQueueSub: Subscription;

    constructor(private karaoke: KaraokeService, private router: Router) {}

    ngOnInit() {
      this.songQueueSub = this.karaoke.songQueue.subscribe(queue => this.parseQueue(queue))
    }

    ngOnDestroy() {
      this.songQueueSub.unsubscribe();
    }

    parseQueue(queue: Song[]) {
      if (queue && queue.length > 0) {
        this.router.navigateByUrl('/next-song')
      }
    }
}
