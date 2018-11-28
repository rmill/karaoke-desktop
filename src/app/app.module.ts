import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IdleComponent } from './idle/idle.component';
import { NextSongComponent } from './next-song/next-song.component';

import { DataService } from './shared/service/data.service';
import { ElectronService } from './shared/service/electron.service';
import { KaraokeService } from './shared/service/karaoke.service';
import { VoiceService } from './shared/service/voice.service';

const appRoutes: Routes = [
  { path: 'idle', component: IdleComponent },
  { path: 'next-song', component: NextSongComponent },
  { path: '**', redirectTo: 'idle' }
];

@NgModule({
  declarations: [
    AppComponent,
    IdleComponent,
    NextSongComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DataService,
    ElectronService,
    KaraokeService,
    VoiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Declare the window interface so that NG can access electron
declare global {
  interface Window {
    require: any;
  }
}
