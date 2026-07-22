import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import html2canvas from 'html2canvas';

(window as any).html2canvas = html2canvas;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
