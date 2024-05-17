import { input } from "@angular/core";

export interface Students{
    id: number;
    name: string;
    rollNumber: string;
    class: string;
    age: number;
    phoneNumber?:string;
    address?:string;
}

export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    DateTime: { input: any; output: any; }
    UUID: { input: any; output: any; }
  };

  export type StudentInput = {
    id: Scalars['Int']['input'];
    name: Scalars['String']['input'];
    rollNumber: Scalars['String']['input'];
    class: Scalars['String']['input'];
    age: Scalars['Int']['input'];
    phoneNumber: Scalars['String']['input'];
    address: Scalars['Int']['input'];
  };