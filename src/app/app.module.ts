import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { IdleComponent } from './idle/idle.component';

const appRoutes: Routes = [
  { path: 'idle', component: IdleComponent },
  { path: '**', redirectTo: 'idle' }
];

@NgModule({
  declarations: [
    AppComponent,
    IdleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Declare the window interface so that NG can access electron
declare global {
  interface Window {
    require: any;
  }
}
