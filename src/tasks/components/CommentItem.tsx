import React, { useContext, useState, useEffect } from 'react';
import {
  Paper,
  Tooltip,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { AuthContext } from '../../shared/contexts/auth-context';
import { formStyles } from '../../assets/formStyles';
import AlertDialog from '../../shared/components/UIElements/AlertDialog';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { IComment } from '../../shared/interfaces/shared-interfaces';
import { useForm, Controller } from 'react-hook-form';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

interface CommentItemProps {
  comment: {
    _id: string,
    title: string,
    detail: string,
    creator: {
      _id: string,
      name: string,
    }
  }
  deleteComment: Function
}

const CommentItem = (props: CommentItemProps) => {

  const [ loadedComment, setLoadedComment ] = useState<IComment>()
  const [ openDialog, setOpenDialog ] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const { sendRequest, loading, error } = useHttpClient();
  const classes = formStyles();
  const [ editMode, setEditMode ] = useState<boolean>(false);
  const { handleSubmit, control, errors, formState } = useForm<IComment>({
    mode: 'onChange'
  })

  useEffect(() => {
    setLoadedComment(props.comment)
  },[props.comment])

  const handleOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const updateCommentHandler = async (data: IComment) => {
    console.log(data);
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/comments/' + loadedComment?._id,
        'PATCH',
        {
          title: data.title,
          detail: data.detail
        },
        {
          Authorization: 'Bearer ' + authContext.token
        }
      )
      console.log(responseData)
      setLoadedComment(responseData.data.commentData)
    } catch(err) {
      console.log(err)
    };
    setEditMode(false);
  };

  const switchEditModeHandler = () => {
    setEditMode(prevState => !prevState)
  }

  if(error) {

  }

  if (!loadedComment) {
    return (
      <LoadingSpinner isLoading={loading}/>
    )
  }

  let contents: JSX.Element
  if (editMode) {
    contents = (
      <Paper className={classes.paper} elevation={3}>
        <form id='commentForm' className={classes.commentForm} onSubmit={handleSubmit(updateCommentHandler)}>
            <Controller
              as={
                <TextField
                  error={errors.title? true: false}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  id='commentTitle'
                  label="タイトル"
                  // helperText={errors.title!.message}
                />
              }
              defaultValue={loadedComment?.title}
              name='title'
              control={control}
              rules={{ required: 'タイトルは必須です'}}
            />

            <Controller
              as={
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  multiline
                  rows={5}
                  id='commentDetail'
                  label="詳細"
                />
              }
              defaultValue={loadedComment?.detail}
              name='detail'
              control={control}
            />

          <div className={classes.commentButtons}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!formState.isValid}
              form='commentForm'
            >更新</Button>

            <Button
              onClick={switchEditModeHandler}
              variant="contained"
              color="default"
              className={classes.submit}
            >戻る</Button>
          </div>
        </form>
      </Paper>
    )
  } else {
    contents = (
      <Paper className={classes.paper} elevation={3}>
        <Tooltip title={loadedComment!.creator?.name} aria-label='name'>
          <Avatar className={classes.avatar}>{loadedComment?.creator?.name.substring(0,1)}</Avatar>
        </Tooltip>
        <div className={classes.comment}>
          <Typography variant='h6'>{loadedComment?.title}</Typography>
          <Typography>{loadedComment?.detail}</Typography>
        </div>

        { loadedComment?.creator._id === authContext.userId &&
          <React.Fragment>
            <Tooltip title="編集" aria-label='edit'>
              <IconButton onClick={switchEditModeHandler}>
                <EditIcon color='primary'/>
              </IconButton>
            </Tooltip>

            <Tooltip title='削除' aria-label='delete'>
              <IconButton onClick={handleOpen}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <AlertDialog
              show={openDialog}
              dialogTitle='Delete Comment'
              contentText='コメントを削除します。よろしいですか？'
              ok='OK'
              ng='キャンセル'
              action={() => props.deleteComment(loadedComment!._id)}
              closeDialog={handleClose}
            />
          </React.Fragment>
        }
      </Paper>
    )
  }

  return (
    <React.Fragment>

        { contents }

     </React.Fragment>
  )

}

export default CommentItem