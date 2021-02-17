import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import 'date-fns'
import {
  TextField,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { AuthContext } from '../../shared/contexts/auth-context'
import { ProjectContext } from '../../shared/contexts/project-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { formStyles, PrettoSlider } from '../../assets/formStyles'
import { IFormInputs } from '../../shared/interfaces/shared-interfaces'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Modal from '../../shared/components/UIElements/Modal'

const NewTask = () => {
  const classes = formStyles()
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([])
  const [fetchedUsers, setFetchedUsers] = useState<any[]>([])
  const { sendRequest, loading, error, clearError } = useHttpClient()

  const { control, handleSubmit, errors, formState } = useForm<IFormInputs>({
    mode: 'onChange',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${projectContext.selectedProject?._id}`,
          'GET',
          null,
          {
            Authorization: `Bearer ${authContext.token}`,
          },
        )
        setFetchedUsers(responseData.data)
      } catch (err) {}
    }
    fetchUsers()
  }, [sendRequest, authContext.token, projectContext.selectedProject])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/categories`,
          'GET',
          null,
          {
            Authorization: `Bearer ${authContext.token}`,
          },
        )
        setFetchedCategories(responseData.data)
      } catch (err) {}
    }
    fetchCategories()
  }, [sendRequest, authContext.token])

  const history = useHistory()

  const taskSubmitHandler = async (data: IFormInputs) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/tasks`,
        'POST',
        {
          title: data.title,
          description: data.description,
          limitDate: data.limitDate,
          progress: data.progress,
          status: data.status,
          personInCharge: data.personInCharge,
          category: data.category,
          project: projectContext.selectedProject!._id,
        },
        {
          Authorization: `Bearer ${authContext.token}`,
        },
      )
      history.push('/tasks', { message: responseData.data.message })
    } catch (err) {}
  }

  let errorModal
  if (error?.response) {
    errorModal = (
      <Modal
        title={error.response?.statusText}
        description={error.response?.data.message}
        show={!!error}
        closeModal={clearError}
      />
    )
  }

  return (
    <Container component="main" maxWidth="md">
      {errorModal}
      <LoadingSpinner isLoading={loading} />
      <form className={classes.form} onSubmit={handleSubmit(taskSubmitHandler)}>
        <FormControl className={classes.formControl}>
          <InputLabel id="category">カテゴリ(必須)</InputLabel>
          <Controller
            as={
              <Select
                error={errors.category ? true : false}
                id="category"
                labelId="category"
                style={{ width: '130px' }}
              >
                {fetchedCategories &&
                  fetchedCategories.map((c) => {
                    return <MenuItem value={c._id}>{c.name}</MenuItem>
                  })}
              </Select>
            }
            defaultValue=""
            name="category"
            control={control}
            rules={{ required: 'カテゴリは必須です' }}
            helperText={errors?.category?.message}
          />
        </FormControl>

        <Controller
          as={
            <TextField
              error={errors.title ? true : false}
              variant="outlined"
              margin="normal"
              fullWidth
              id="title"
              label="タスク名(必須)"
              helperText={errors?.title?.message}
            />
          }
          defaultValue=""
          name="title"
          control={control}
          rules={{ required: 'タスク名は必須です。' }}
        />

        <Controller
          as={
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={5}
              id="description"
              label="説明"
            />
          }
          name="description"
          control={control}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Controller
            name="limitDate"
            control={control}
            render={({ ref, ...rest }) => (
              <KeyboardDatePicker
                autoOk
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="limitDate"
                label="期限"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.formControl}
                style={{ width: '140px' }}
                {...rest}
              />
            )}
            defaultValue={new Date()}
          />
        </MuiPickersUtilsProvider>

        <FormControl className={classes.formControl}>
          <InputLabel id="status">状況</InputLabel>
          <Controller
            as={
              <Select id="status" labelId="status">
                <MenuItem value="新規">新規</MenuItem>
                <MenuItem value="進行中">進行中</MenuItem>
                <MenuItem value="確認待ち">確認待ち</MenuItem>
                <MenuItem value="完了">完了</MenuItem>
              </Select>
            }
            name="status"
            control={control}
            defaultValue="新規"
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
                {fetchedUsers &&
                  fetchedUsers.map((u) => {
                    return <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                  })}
              </Select>
            }
            name="personInCharge"
            control={control}
          />
        </FormControl>

        <FormControl>
          <Typography gutterBottom className={classes.margin_top}>
            進捗率
          </Typography>
          <Controller
            render={(props) => (
              <PrettoSlider
                {...props}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                onChange={(_, value) => props.onChange(value)}
              />
            )}
            name="progress"
            control={control}
            defaultValue={0}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={!formState.isValid}
        >
          タスク作成
        </Button>
      </form>
    </Container>
  )
}

export default NewTask
