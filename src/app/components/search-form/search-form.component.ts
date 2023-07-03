import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchFormNullable } from 'src/app/models/search.interface';
import { MeetupService } from 'src/app/services/meetup.service';
import { WithFormControl } from 'src/app/utils/withFormControl.type';

type SearchFormControls = WithFormControl<SearchFormNullable>;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();
  searchForm: FormGroup<SearchFormControls>;

  constructor(
    private fb: FormBuilder,
    private meetupService: MeetupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      value: [''],
    });
    this.searchForm.valueChanges.subscribe(value => {
      const searchQuery = value.value;

      if (searchQuery !== null) {
        this.searchEvent.emit(searchQuery);
      }
    });
  }

  clear() {
    this.searchForm.patchValue({
      value: '',
    });
  }
}
