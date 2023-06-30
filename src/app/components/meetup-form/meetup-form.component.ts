import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { WithFormControl } from 'src/app/utils/withFormControl.type';

import { Meetup, MeetupFormNullable } from 'src/app/models/meetup/meetup.interface';
import { MeetupService } from 'src/app/services/meetup.service';

type MeetupFormControls = WithFormControl<MeetupFormNullable>;

@Component({
  selector: 'app-meetup-form',
  templateUrl: './meetup-form.component.html',
  styleUrls: ['./meetup-form.component.scss'],
})
export class MeetupFormComponent implements OnInit {
  @Input() meetupId: number | null = null;
  isEdit: boolean;
  meetupForm: FormGroup<MeetupFormControls>;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private meetupService: MeetupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.meetupId;
    this.initForm();
  }

  initForm(): void {
    this.meetupForm = this.fb.group({
      name: [{ value: '', disabled: false }],
      description: [''],
      location: [''],
      target_audience: [''],
      need_to_know: [''],
      will_happen: [''],
      reason_to_come: [''],
      time: [moment().format('YYYY-MM-DDTHH:mm')],
      duration: [60],
    });

    if (this.isEdit) this.patchFormData();
  }

  onSubmit(): void {
    if (!this.meetupForm.valid) return;

    const formValue = this.meetupForm.value;

    if (this.isEdit && this.meetupId) {
      console.log('edit', formValue);
      this.editMeetup(this.meetupId, formValue as Meetup);
    } else {
      this.createMeetup(formValue as Meetup);
    }
  }

  editMeetup(id: number, meetupFormData: Meetup): void {
    this.isLoading = true;
    this.disableForm();

    this.meetupService
      .editMeetup(id, meetupFormData)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
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

  createMeetup(meetupFormData: Meetup): void {
    this.isLoading = true;
    this.disableForm();

    this.meetupService
      .createMeetup(meetupFormData)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
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

  patchFormData() {
    if (!this.meetupId) return;

    this.isLoading = true;
    this.disableForm();

    this.meetupService
      .getMeetupFormDataById(this.meetupId)
      .subscribe({
        next: response => {
          const modifiedData = this.getModifiedMeetupData(response);

          this.meetupForm.patchValue(modifiedData);
        },
        error: error => {
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

  getModifiedMeetupData(meetupData: Meetup) {
    const formatTime = this.getFormatDate(meetupData.time);

    return {
      ...meetupData,
      time: formatTime,
    };
  }

  getFormatDate(date: string) {
    return moment(date).utc().format('YYYY-MM-DDTHH:mm');
  }

  disableForm() {
    this.meetupForm.disable();
  }

  enableForm() {
    this.meetupForm.enable();
  }
}
