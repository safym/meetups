import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { WithFormControl } from 'src/app/utils/withFormControl.type';
import { Meetup, MeetupFormNullable, MeetupResponse } from 'src/app/models/meetup.interface';
import { MeetupService } from 'src/app/services/meetup.service';

import { getControlErrorCode } from 'src/app/utils/getControlErrorCode';
import { requiredValidator } from 'src/app/shaded/requiredValidator';
import { meetupDateValidator } from 'src/app/shaded/meetupDateValidator';
import { Subscription } from 'rxjs';

type MeetupFormControls = WithFormControl<MeetupFormNullable>;

@Component({
  selector: 'app-meetup-form',
  templateUrl: './meetup-form.component.html',
  styleUrls: ['./meetup-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupFormComponent implements OnInit, OnDestroy {
  @Input() meetupId: number | null = null;
  private _meetupListSubscription: Subscription;
  private _intervalSubscription: Subscription;
  meetupData: MeetupResponse | undefined;
  isEdit: boolean;
  meetupForm: FormGroup<MeetupFormControls>;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meetupService: MeetupService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isEdit = !!this.meetupId;

    this.initForm();
    this.disableForm();

    this._meetupListSubscription = this.meetupService.getMeetupList().subscribe(() => {
      if (!this.meetupId) return;

      this.meetupData = this.meetupService.getMeetupFormDataById(this.meetupId);

      if (this.isEdit && this.meetupData) this.processMeetupData();
    });

    this._intervalSubscription = this.meetupService.getIntervalSubscription();
  }

  private processMeetupData(): void {
    this.isLoading = false;
    this.enableForm();
    this.patchFormData();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.isLoading = false;

    if (this._meetupListSubscription) {
      this._meetupListSubscription.unsubscribe();
    }

    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
    }
  }

  initForm(): void {
    this.meetupForm = this.fb.group({
      name: ['', [Validators.required, requiredValidator]],
      description: ['', [Validators.required, requiredValidator]],
      location: ['', [Validators.required, requiredValidator]],
      target_audience: ['', [Validators.required, requiredValidator]],
      need_to_know: ['', [Validators.required, requiredValidator]],
      will_happen: ['', [Validators.required, requiredValidator]],
      reason_to_come: ['', [Validators.required, requiredValidator]],
      time: [moment().format('YYYY-MM-DDTHH:mm'), [Validators.required, meetupDateValidator]],
      duration: [60, [Validators.required, requiredValidator]],
    });
  }

  patchFormData() {
    if (!this.meetupId || !this.meetupData) return;

    const modifiedData = this.getModifiedMeetupData(this.meetupData);

    this.meetupForm.patchValue(modifiedData);

    this.cdr.detectChanges();
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

  onReset(): void {
    const answer = window.confirm('Отменить?');

    if (!answer) return;

    this.meetupForm.reset();
    this.router.navigate(['my-meetups']);
  }

  onDelete(): void {
    const answer = window.confirm('Вы уверены, что хотите удалить митап?');

    if (!answer || !this.meetupId) return;

    this.isLoading = true;
    this.disableForm();

    this.meetupService
      .deleteMeetup(this.meetupId)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.error(error);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.enableForm();
        this.cdr.detectChanges();
        this.router.navigate(['my-meetups']);
      });
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
          console.error(error);
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
          console.error(error);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.enableForm();
        this.cdr.detectChanges();
        this.router.navigate(['my-meetups']);
      });
  }

  showError(сontrolName: string, requiredError: boolean = false) {
    if (requiredError) return this.meetupForm.get(сontrolName)?.getError('invalidRequired');

    const errorCode = getControlErrorCode(сontrolName);

    return this.meetupForm.get(сontrolName)?.getError(errorCode);
  }

  disableForm() {
    this.meetupForm.disable();
  }

  enableForm() {
    this.meetupForm.enable();
  }
}
