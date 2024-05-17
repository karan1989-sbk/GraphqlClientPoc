import { gql } from "apollo-angular"

const GET_ALL_STUDENT = gql`
query Query{
    get {
      id
      name
      age
      class
      rollNumber,
      phoneNumber,
      address,
    }
  }
`

const GET_STUDENT_BY_ID = gql`
query getStudentById($rollNumber:String!) {
    getStudentById(rollNumber: $rollNumber) {
      age
      class
      id
      name
      rollNumber,
      phoneNumber,
      address
    }
  }
`

export { GET_ALL_STUDENT, GET_STUDENT_BY_ID }
