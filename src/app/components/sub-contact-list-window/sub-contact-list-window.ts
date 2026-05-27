import { Component } from '@angular/core';
import { contactslist } from 'src/app/data/contacts';
import { Contact } from 'src/app/interfaces/Contact';

@Component({
  selector: 'app-sub-contact-list-window',
  imports: [],
  templateUrl: './sub-contact-list-window.html',
  styleUrl: './sub-contact-list-window.scss',
})
export class SubWorksListWindow {
  contacts: Contact[] = contactslist;
}
