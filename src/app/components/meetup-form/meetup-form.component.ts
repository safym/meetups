import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { WithFormControl } from 'src/app/utils/withFormControl.type';

import {
  MeetupForm,
  MeetupFormNullable,
  MeetupRequest,
} from 'src/app/models/meetup/meetup.interface';
import { MeetupService } from 'src/app/services/meetup.service';

type MeetupFormControls = WithFormControl<MeetupFormNullable>;

@Component({
  selector: 'app-meetup-form',
  templateUrl: './meetup-form.component.html',
  styleUrls: ['./meetup-form.component.scss'],
})
export class MeetupFormComponent implements OnInit {
  meetupForm: FormGroup<MeetupFormControls>;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meetupService: MeetupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.meetupForm = this.fb.group({
      name: [{ value: 'name new meetup', disabled: false }],
      short_description: ['short description'],
      long_description: ['long description'],
      location: ['location 3'],
      target_audience: ['target_audience'],
      need_to_know: ['need_to_know'],
      will_happen: ['will_happen'],
      reason_to_come: ['reason_to_come'],
      // time: moment('2023-01-12T23:18:50.700Z').utc().format('YYYY-MM-DDTHH:mm'),
      time: [moment().format('YYYY-MM-DDTHH:mm')],
      duration: [60],
    });
  }

  onSubmit(): void {
    if (this.meetupForm.valid) {
      const formValue = this.meetupForm.value;

      this.createMeetup(formValue as MeetupForm);

      this.meetupService.createMeetup(formValue as MeetupForm);
    }
  }

  createMeetup(meetupFormData: MeetupForm): void {
    this.isLoading = true;
    this.disableForm();

    this.meetupService
      .createMeetup(meetupFormData)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      })
      .add(() => {
        this.isLoading = false;
        this.enableForm();
        this.cdr.detectChanges();
      });
  }

  disableForm() {
    this.meetupForm.disable();
  }

  enableForm() {
    this.meetupForm.enable();
  }
}
