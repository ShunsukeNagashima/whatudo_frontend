import React, { useState, useEffect, useContext } from 'react'
import { IComment } from '../../shared/interfaces/shared-interfaces'
import CommentItem from './CommentItem'
import { AuthContext } from '../../shared/contexts/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

interface CommentListProps {
  comments: IComment[]
  taskId: string
}

const CommentList = (props: CommentListProps) => {
  const [commentList, setCommentList] = useState<IComment[]>([])
  const authContext = useContext(AuthContext)
  const { sendRequest } = useHttpClient()

  useEffect(() => {
    setCommentList(props.comments)
  }, [props.comments])

  const deleteCommentHandler = async (commentId: string) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/comments/${commentId}?taskId=${props.taskId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authContext.token,
        },
      )
    } catch (err) {}
    setCommentList(commentList.filter((c) => c._id !== commentId))
  }

  return (
    <React.Fragment>
      {commentList &&
        commentList.map((c: IComment) => {
          return (
            <CommentItem
              key={c._id}
              comment={c}
              deleteComment={deleteCommentHandler}
            />
          )
        })}
    </React.Fragment>
  )
}

export default CommentList
