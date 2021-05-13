import { gql, useQuery } from '@apollo/client';
import React from 'react';

export const SEE_MY_PROFILE = gql`
  query seeMyProfile{
    seeMyProfile{
      id
      name
      email
    }
  }
`

function useUser(){
  const {data} = useQuery(SEE_MY_PROFILE);
  return {...data.seeMyProfile};
}

export default useUser;