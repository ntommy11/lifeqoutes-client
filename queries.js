import gql from 'graphql-tag';


export const SEARCH_TAG = gql`
  query searchTag($keyword: String!, $take: Int!, $lastId:Int){
    searchTag(keword: $keyword, take: $take, lastId:$lastId){
      id
      name
      totalSayings
    }
  }
`
export const SEARCH_AUTHOR = gql`
  query searchAuthor($keyword: String!, $take: Int!, $lastId: Int){
    searchAuthor(keyword: $keyword, take:$take, lastId:$lastId){
      id
      name
      totalSayings
    }
  }
`
export const SEARCH_CONTENT = gql`
  query searchSaying($keyword: String!, $take: Int!, $lastId: Int){
    searchSaying(keyword: $keyword, take:$take, lastId:$lastId){
      id
      user{
        id
        name
        email
      }
      author{
        id
        name
      }
      text 
      tags{
        id
        name 
      }
      totalLikes
      totalComments
      isMine
      isLike
    }
  }
`