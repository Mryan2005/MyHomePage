import { Component } from '@angular/core';
import { workslist } from 'src/app/data/works';
import { Work } from 'src/app/interfaces/Work';

@Component({
  selector: 'app-sub-works-list-window',
  imports: [],
  templateUrl: './sub-works-list-window.html',
  styleUrl: './sub-works-list-window.scss',
})
export class SubWorksListWindow {
  works: Work[] = workslist;
}
