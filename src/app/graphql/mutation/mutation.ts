import { gql } from "apollo-angular"

const addStudent = gql`
mutation addStudent($input: studentInput!) {
  addStudent(studentsInput: $input) {
    id
    name
    rollNumber
    class
    age
  }
}
`
const upsertStudent = gql`
mutation addStudent($id:Int!,$name: String!, $rollNumber: String!, $class: String!, $age: Int!) {
    addStudent(studentsInput: { id: $id, name: $name, rollNumber: $rollNumber, class: $class, age: $age }){
        id
        name
        rollNumber
        class
        age
    }
}   
`;


const deleteStudent = gql`
  mutation deleteStudent($studentId: Int!) {
    deleteStudent(studentId: $studentId) {
      isDelted:boolean!
 }
`

export { addStudent, upsertStudent, deleteStudent }

