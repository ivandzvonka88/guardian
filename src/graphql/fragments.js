import {gql} from '@apollo/client';

export default {
  guardianUser: gql`
    fragment GuardianUserFragment on GuardianUser {
      guardianUId
      userName
      email
      firstName
      lastName
      phone
      city
      postalCode
      mfaEnabled
    }
  `,
};
