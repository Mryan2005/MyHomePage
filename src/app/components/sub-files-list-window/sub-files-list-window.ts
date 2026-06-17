import { Component } from '@angular/core';
import { fileslist } from 'src/app/data/files';
import { File } from 'src/app/interfaces/File';

@Component({
  selector: 'app-sub-files-list-window',
  imports: [],
  templateUrl: './sub-files-list-window.html',
  styleUrl: './sub-files-list-window.scss',
})
export class SubFilesListWindow {
  files: File[] = fileslist;
}
