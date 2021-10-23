import {gql} from '@apollo/client';

export const GET_GUARDIAN_CLIENTS = gql`
  query GetGuardianClients {
    guardianClients {
      firstName
      lastName
      clientId
    }
  }
`;

export const GET_NOTES_BY_CLIENT = gql`
  query GetNotesByClient(
    $clientId: Int!
    $isEVV: Boolean!
    $startDate: String!
    $endDate: String!
  ) {
    notesByClient(
      clientId: $clientId
      isEVV: $isEVV
      startDate: $startDate
      endDate: $endDate
    ) {
      sessionId
      utcIn
      utcOut
      adjUtcIn
      adjUtcOut
      serviceName
      approvedNote
      guardianId
      providerName
      noteType
    }
  }
`;

export const GET_PAY_PERIODS = gql`
  query GetPayPeriods {
    payPeriods {
      ppID
      startDate
      endDate
    }
  }
`;

export const GET_PENDING_NOTES = gql`
  query GetPendingNotes {
    pendingNotes {
      clientName
      svc
      dt
      docId
    }
  }
`;

export const GET_NOTE_BY_SESSION_ID = gql`
  query GetClientNoteBySessionId($sessionId: Int!, $isTherapy: Boolean!) {
    clientNoteBySessionId(sessionId: $sessionId, isTherapy: $isTherapy) {
      clientId
      serviceId
      providerId
      clientName
      svc
      note
      dt
      docId
      teletherapy
      noShow
      completed
      clientRefusedService
      designeeUnableToSign
      designeeRefusedToSign
      unsafeToWork
      guardianId
      designeeId
      designeeLat
      designeeLon
      designeeLocationId
      designeeLocationTypeId
      hasAttachment
      attachmentName
      extension
      startLat
      startLon
      endLat
      endLon
      clientLocationId
      locationTypeId
      utcIn
      utcOut
      adjUtcIn
      adjUtcOut
      longTermObjectives {
        objectiveId
        goalAreaId
        longTermGoal
        longTermVision
        shortTermGoals {
          goalId
          goalIndex
          shortTermGoal
          score
        }
      }
      scoring {
        value
        label
      }
      careAreas {
        careId
        careArea
        score
      }
      clientLocation {
        address1
        address2
        city
        state
        zip
        lat
        lon
        radius
      }
      noteType
    }
  }
`;

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      current
    }
  }
`;

export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    allCompanies {
      id
      name
    }
  }
`;
