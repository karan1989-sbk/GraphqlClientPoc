import { Component, OnInit, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { APOLLO_OPTIONS, Apollo, gql } from 'apollo-angular';
import { GET_ALL_STUDENT, GET_STUDENT_BY_ID } from './graphql/query/queries';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { Students } from './models/student.model';
import { addStudent, deleteStudent, upsertStudent } from './graphql/mutation/mutation';
import { MutationVariable } from './graphql/mutation/mutation.variable';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => {
        return {
          link: httpLink.create({ uri: 'https://localhost:7044/graphql' }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
    Apollo,
    HttpLink
  ],
})
export class AppComponent implements OnInit {
  title = 'POCApp';
  studentForm!: FormGroup<any>;
  studentsList!: Students[];
  isEdit!: boolean;
  studentData!: Students
  buttonText: string = 'Save Student';
  mutationVariable: MutationVariable = new MutationVariable();
  constructor(
    private fb: FormBuilder, private apollo: Apollo) { }
  ngOnInit(): void {
    this.initForm();
    this.getStudent();
  }

  initForm() {
    this.studentForm = this.fb.group({
      rollNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      class: ['', [Validators.required]],
      age: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      searchBy: new FormControl()
    });
  }

  upsertStudent() {
    const studentInput = this.mutationVariable.UPSERT_PARAM(this.studentData, this.studentForm, this.isEdit);
    this.apollo.mutate({
      mutation: gql`
      mutation addStudent($id:Int!, $name: String!, $rollNumber: String!, $class: String!, $age: Int!, $phoneNumber: String!, $address: String!) {
          addStudent(studentsInput: { id: $id, name: $name, rollNumber: $rollNumber, class: $class, age: $age, phoneNumber:$phoneNumber, address: $address }){
            id
            name
            age
            class
            rollNumber,
            phoneNumber,
            address
          }
      }   
      `,
      variables: studentInput
    }).pipe(
      map(() => {
        this.buttonText = 'Save Student';
        this.idDisabled?.enable();
        this.studentForm.reset();
      })
    ).subscribe(() => this.getStudent())
  }

  getStudent() {
    this.apollo.watchQuery({ query: GET_ALL_STUDENT }).valueChanges.subscribe((res: any) => {
      this.studentsList = [];
      res?.data?.get.forEach((el: Students) => {
        this.studentsList.push({
          id: el.id, name: el.name,
          rollNumber: el.rollNumber, class: el.class,
          age: el.age, phoneNumber: el.phoneNumber,
          address: el?.address
        })
      });
    })
  }

  getStudentByRollNumber() {
    this.apollo.watchQuery({
      query: GET_STUDENT_BY_ID,
      variables: { rollNumber: this.studentForm.value['searchBy'] }
    }).valueChanges.subscribe((res: any) => {
      this.studentsList = [];
      const result = res?.data?.getStudentById || {} as Students;
      this.studentsList.push({
        id: result.id, name: result.name, rollNumber: result.rollNumber,
        class: result.class, age: result.age, phoneNumber: result.phoneNumber,
        address: result.address
      });
    })
  }

  onStudentCellClick(studentData: Students) {
    this.idDisabled?.disable();
    this.isEdit = true;
    this.studentData = studentData;
    this.buttonText = 'Edit Student';
    this.studentForm.reset({
      rollNumber: studentData.rollNumber,
      name: studentData.name,
      age: studentData.age,
      class: studentData.class,
      phoneNumber: studentData.phoneNumber,
      address: studentData.address
    })
  }

  deleteStudent(studentId: number) {
    this.apollo
      .mutate({
        mutation: gql`
        mutation deleteStudent($studentId: Int!) {
          deleteStudent(studentId: $studentId) {
            isDelted:boolean!
          }
        `,
        variables: {
          studentId: studentId,
        },
      })
      .subscribe(
        (result) => {
          console.log('Mutation result:', result);
          this.getStudent();
        },
        (error) => {
          console.error('Mutation error:', error);
        }
      );
  }

  formReset() {
    this.studentForm.reset();
    this.buttonText = 'Save Student';
    this.isEdit = false;
    this.studentData = {} as Students;
    this.idDisabled?.enable();
  }

  refreshGrid() {
    this.studentForm.reset({ searchBy: '' })
    this.studentForm.updateValueAndValidity();
    this.getStudent()
  }
  get idDisabled() {
    return this.studentForm.get('rollNumber');
  }
}
