import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/contexts/auth-context';
import { ProjectContext } from '../../shared/contexts/project-context';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Button,
  Divider
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { formStyles, PrettoSlider } from '../../assets/formStyles';
import { IFormInputs } from '../../shared/interfaces/shared-interfaces';
import CommentList from '../components/CommentList'
import Snackbar from '../../shared/components/UIElements/SnackBar'
import Modal from '../../shared/components/UIElements/Modal';


interface IParams {
  taskId: string;
}

const UpdateTask = () => {
  const classes = formStyles()
  const [ loadedTask, setLoadedTask ] = useState<IFormInputs | null>();
  const [ fetchedUsers, setFetchedUsers ] = useState<any[]>([]);
  const [ fetchedCategories, setFetchedCategories ] = useState<any[]>([]);
  const [ showCommentInput, setShowCommentInput ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>('');
  const [ showSnackBar, setShowSnackBar ] = useState<boolean>(false);
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const { handleSubmit, control, errors, formState } = useForm<IFormInputs>({
    mode: 'onChange',
  });

  const taskId = useParams<IParams>().taskId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/' + projectContext.selectedProject!._id,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + authContext.token
          }
        )
        setFetchedUsers(responseData.data)
      } catch(err) {
        console.log(err)
        throw err
      }
    }
    fetchUser()
  }, [sendRequest, taskId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/categories',
          'GET',
          null,
          {
            Authorization: 'Bearer ' + authContext.token
          }
        )
        setFetchedCategories(responseData.data)
      } catch(err) {
        throw err;
      }
    }
    fetchCategories()
  }, [sendRequest, taskId])

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/tasks/task/${taskId}?projectId=${projectContext.selectedProject!._id}`,
           'GET',
           null,
           {
             Authorization: 'Bearer ' + authContext.token
           }
        )
        setLoadedTask(responseData.data)
        console.log(responseData.data.limitDate)
      } catch(err) {
        console.log(err);
      }
    };
    fetchTask();
  }, [sendRequest, taskId])

  const taskSubmitHandler = async (data: IFormInputs) => {
      setLoadedTask(null);
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/tasks/task/${taskId}?projectId=${projectContext.selectedProject!._id}`,
          'PATCH',
          {
            title: data.title,
            description: data.description,
            limitDate: data.limitDate,
            status: data.status,
            progress: data.progress,
            comment: {
               title: data.commentTitle,
               detail: data.commentDetail,
            },
            modifiedBy: authContext.userId,
            personInCharge: data.personInCharge,
            category: data.category,
          },
          {
            Authorization: 'Bearer ' + authContext.token
          },
        )
        console.log(responseData.data.task)
        setMessage(responseData.data.message);
        setShowSnackBar(true)
        setLoadedTask(responseData.data.task)
      } catch(err) {
        console.log(err);
        throw(err)
      }
  };

  const closeSnackBarHandler = () => {
    setShowSnackBar(false);
  };

  const switchShowModeHandler = () => {
    setShowCommentInput(prevSate => !prevSate)
  };

  let errorModal;
  if (error?.response) {
    errorModal =  (
        <Modal
          title={error.response?.statusText}
          description={error.response?.data.message}
          show={!!error}
          closeModal={clearError}
        />
    )
  }

  if (loading) {
    return (
      <LoadingSpinner isLoading={loading}/>
    )
  }

  console.log(loadedTask);

  return (
    <Container className={classes.form} component="main" maxWidth="md">
      {!loading && loadedTask! && (
        <React.Fragment>
          {errorModal}
          {loading && <LoadingSpinner isLoading={loading}/>}
          <form id='taskForm' className={classes.form} onSubmit={handleSubmit(taskSubmitHandler)}>
            <FormControl className={classes.formControl}>
              <InputLabel id="category">カテゴリ(必須)</InputLabel>
              <Controller
                as={
                  <Select
                    id="category"
                    labelId="category"
                  >
                    {
                      fetchedCategories && fetchedCategories.map(c => {
                        return <MenuItem value={c._id}>{c.name}</MenuItem>
                      })
                    }
                  </Select>
                }
                defaultValue={loadedTask!.category}
                name="category"
                control={control}
                rules={{ required: 'カテゴリは必須です'}}
                />
            </FormControl>

            <Controller
              as={
                <TextField
                  error={errors.title? true: false}
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  id='title'
                  label='タスク名(必須)'
                  // helperText={errors.title!.message}
                />
              }
              defaultValue={loadedTask!.title}
              name='title'
              control={control}
              rules={{required: "タスク名は必須です。"}}
            />

            <Controller
              as={
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  multiline
                  rows={5}
                  id='description'
                  label="説明"
                />
              }
              defaultValue={loadedTask!.description}
              name='description'
              control={control}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name='limitDate'
                control={control}
                render={({ref, ...rest}) => (
                  <KeyboardDatePicker
                    disableToolbar
                    variant='inline'
                    format='yyyy/MM/dd'
                    margin='normal'
                    id="limitDate"
                    label="期限"
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                    className={classes.formControl}
                    {...rest}
                  />
                )}
                defaultValue={new Date(loadedTask!.limitDate)}
              />

            </MuiPickersUtilsProvider>

            <FormControl className={classes.formControl}>
              <InputLabel id="status">状況</InputLabel>
              <Controller
                as={
                  <Select
                    id="status"
                    labelId="status"
                  >
                    <MenuItem value="新規">新規</MenuItem>
                    <MenuItem value="進行中">進行中</MenuItem>
                    <MenuItem value="確認待ち">確認待ち</MenuItem>
                    <MenuItem value="完了">完了</MenuItem>
                  </Select>
                }
                name="status"
                control={control}
                defaultValue={loadedTask!.status}
                />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="personInCharge">担当者</InputLabel>
              <Controller
                as={
                  <Select defaultValue="" id="personInCharge">
                    <MenuItem value="">
                      <em>未定</em>
                    </MenuItem>
                    { fetchedUsers && fetchedUsers.map(u => {
                      return <MenuItem value={u.id}>{u.name}</MenuItem>
                    })}
                  </Select>
                }
                name='personInCharge'
                control={control}
                defaultValue={loadedTask!.personInCharge}
              />
            </FormControl>

            <FormControl>
              <Typography gutterBottom className={classes.margin_top}>進捗率</Typography>
              <Controller
                render={props =>
                  <PrettoSlider
                    {...props}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    onChange={(_, value) => props.onChange(value)}
                  />
                }
                name='progress'
                control={control}
                defaultValue={loadedTask!.progress}
              />
            </FormControl>

          </form>

          {loadedTask!.comments && (
            <CommentList comments={loadedTask!.comments} taskId={loadedTask!._id}/>
          )}

          <Divider variant='middle' className={classes.margin_top}/>

          <Button onClick={switchShowModeHandler} color='primary'>コメントを追記する</Button>

            { showCommentInput && (
              <React.Fragment>
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
                    name='commentTitle'
                    control={control}
                    form='taskForm'
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
                    name='commentDetail'
                    control={control}
                    form='taskForm'
                  />
              </React.Fragment>
             )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!formState.isValid}
            form="taskForm"
          >タスク更新</Button>
        </React.Fragment>
      )}

        <Snackbar
          open={showSnackBar}
          close={closeSnackBarHandler}
          message={message}
        />

    </Container>
  )
}

export default UpdateTask