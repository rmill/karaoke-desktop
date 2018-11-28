import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { KaraokeService, Song } from '../shared/service/karaoke.service';
import { VoiceService } from '../shared/service/voice.service';

const WAIT_TIME = 30;

@Component({
  selector: 'karaoke-next-song',
  styleUrls: ['./next-song.component.css'],
  templateUrl: 'next-song.component.html',
})
export class NextSongComponent {
  private songQueueSub: Subscription;
  private song: Song;
  private time: number;
  private timeSub: Subscription;

  constructor(
    private karaoke: KaraokeService,
    private router: Router,
    private voice: VoiceService,
  ) {}

  ngOnInit() {
    this.time = WAIT_TIME;
    this.songQueueSub = this.karaoke.songQueue.subscribe((queue: Array<Song>) => this.processQueue(queue));
  }

  ngOnDestroy() {
    this.songQueueSub.unsubscribe();
    if (this.timeSub) this.timeSub.unsubscribe();
  }

  private decreaseTime() {
    this.time--;

    if (this.time < 0) {
      this.timeSub.unsubscribe();
      this.router.navigateByUrl('/player');
    }
  }

  private processQueue(queue: Array<Song>) {
    if (queue.length == 0) {
      // No songs left, go to the idle screen
      this.router.navigateByUrl('/idle');
      return;
    }

    if (!this.song) {
      // Show the song we are waiting for
      this.song = queue[0];
      this.timeSub = interval(1000).subscribe(() => this.decreaseTime());
      this.voice.nextSong(this.song.userName, this.song.name);
    } else if(this.song.id !== queue[0].id) {
      // The song has been cancelled, reload the component
      window.location.reload();
    }
  }
}
