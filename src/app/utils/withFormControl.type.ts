import { FormControl } from "@angular/forms";

export type WithFormControl<T> = {
  [P in keyof T]: FormControl<T[P]>;
}
