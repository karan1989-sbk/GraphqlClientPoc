import { FormControl, FormGroup } from "@angular/forms";
import { Students } from "../../models/student.model";

export class MutationVariable {

    private _onEditDataControlValue(_studentData: Students, _studentForm: FormGroup, _isEdited: boolean): { id: number, rollNumber: string } {
        return {
            id: _isEdited == true ? _studentData.id : Math.floor(Math.random() * 1000),
            rollNumber: _isEdited == true ? _studentData.rollNumber : _studentForm.value['rollNumber']
        }
    }

    UPSERT_PARAM(studentData: Students, studentForm: FormGroup, _isEdit: boolean = false): Students {
        const { id, rollNumber } = this._onEditDataControlValue(studentData, studentForm, _isEdit)
        return {
            id,
            name: studentForm.value['name'],
            rollNumber,
            class: studentForm.value['class'],
            age: studentForm.value['age'],
            phoneNumber: studentForm.value['phoneNumber'],
            address: studentForm.value['address'],
        } as Students
    }
}