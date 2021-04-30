import gql from 'graphql-tag';


export const SEARCH_TAG = gql`
  query searchTag($keyword: String!, $take: Int!, $lastId:Int){
    searchTag(keword: $keyword, take: $take, lastId:$lastId){
      id
      name
      totalSayings
      isFollowing
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

// 유저가 작성한 글귀 목록
export const SEE_USER_CREATE = gql`
  query seeUserSaying($userId:Int!, $take:Int!, $lastId:Int){
    seeUserSaying(id:$userId, take:$take, lastId:$lastId){
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
// 유저가 찜한 글귀 목록 
export const SEE_USER_LIKE = gql`
  query seeUserLike($userId:Int!, $take:Int!, $lastId:Int){
    seeUserLike(userId:$userId, take:$take, lastId:$lastId){
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

export const SEE_TAG_SAYING = gql`
  query seeTagSaying($id: Int!, $take: Int!, $lastId:Int){
    seeTagSaying(id:$id, take:$take, lastId:$lastId){
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

export const SEE_AUTHOR_SAYING = gql`
  query seeAuthorSaying($id: Int!, $take: Int!, $lastId:Int){
    seeAuthorSaying(id: $id, take: $take, lastId:$lastId){
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

export const LIKE_TAG = gql`
  mutation likeTag($id:Int!){
    likeTag(id:$id){
      ok
      error
    }
  }
`

export const UNLIKE_TAG = gql`
mutation unlikeTag($id:Int!){
  unlikeTag(id:$id){
    ok
    error
  }
}

`