import {gql} from '@apollo/client';

import fragments from './fragments';

export const LOGIN_GUARDIAN = gql`
  mutation LoginGuardian($userName: String!, $password: String!) {
    loginGuardian(userName: $userName, password: $password) {
      error
      token
      timezone
      user {
        ...GuardianUserFragment
      }
      mfaCode
    }
  }
  ${fragments.guardianUser}
`;

export const LOGIN_BY_CODE = gql`
  mutation LoginByCode($code: String!) {
    loginByCode(code: $code) {
      error
      token
      sessionId
      timezone
      user {
        id
        guardianUId
        firstName
        lastName
        email
        pin
        phone
      }
    }
  }
`;

export const APPROVE_NOTES_BY_GUARDIAN = gql`
  mutation ApproveNotesByGurdian(
    $sessionId: Int!
    $noteType: String!
    $approved: Boolean!
    $isEVV: Boolean
    $pin: Int
    $fromMobile: Boolean
  ) {
    approveNotesByGuardian(
      sessionId: $sessionId
      noteType: $noteType
      approved: $approved
      isEVV: $isEVV
      pin: $pin
      fromMobile: $fromMobile
    ) {
      sessionId
      guardianId
      approvedNote
    }
  }
`;

export const APPROVE_ALL_NOTES_BY_GUARDIAN = gql`
  mutation ApproveAllNotesByGuardian(
    $approved: Boolean!
    $clsvId: Int!
    $startDate: String!
    $endDate: String!
  ) {
    approveAllNotesByGuardian(
      approved: $approved
      clsvId: $clsvId
      startDate: $startDate
      endDate: $endDate
    )
  }
`;

export const UPDATE_GUARDIAN = gql`
  mutation updateGuardian($pnToken: String) {
    updateGuardian(guardian: {pnToken: $pnToken})
  }
`;

export const UPDATE_DESIGNEE = gql`
  mutation updateDesignee($pnToken: String) {
    updateDesignee(designee: {pnToken: $pnToken})
  }
`;

export const CHANGE_COMPANY = gql`
  mutation ChangeCompany($id: Int!) {
    guardianChangeCompany(id: $id) {
      error
      token
      user {
        ...GuardianUserFragment
      }
      timezone
    }
  }
  ${fragments.guardianUser}
`;

export const REGISTER_GUARDIAN = gql`
  mutation RegisterGuardian($guardian: GuardianInput!) {
    registerGuardian(guardian: $guardian)
  }
`;

export const VERIFY_GUARDIAN_CODE = gql`
  mutation VerifyGuardianCode($id: Int!, $companyId: Int!, $code: String!) {
    verifyGuardianCode(id: $id, companyId: $companyId, code: $code) {
      error
      token
      timezone
      user {
        ...GuardianUserFragment
      }
    }
  }
  ${fragments.guardianUser}
`;

export const RESEND_MFA_CODE = gql`
  mutation ResendMfaCode($phone: String!) {
    resendMfaCode(phone: $phone)
  }
`;
