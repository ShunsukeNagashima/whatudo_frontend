import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, TextField, Button } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { AuthContext } from '../../shared/contexts/auth-context'
import { ProjectContext } from '../../shared/contexts/project-context'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useHttpClient } from '../../shared/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import Modal from '../../shared/components/UIElements/Modal'
import AlertDialog from '../../shared/components/UIElements/AlertDialog'
import { IProject } from '../../shared/interfaces/shared-interfaces'

interface IFormInputs {
  name: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      alignSelf: 'center',
      minWidth: 200,
    },
  }),
)

const NewProject = () => {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const { control, handleSubmit, errors, formState } = useForm<IFormInputs>({
    mode: 'onChange',
  })
  const { sendRequest, error, loading, clearError } = useHttpClient()
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)

  const handleClose = () => {
    setOpen(false)
  }

  const history = useHistory()

  const projectSubmitHandler = async (data: IFormInputs) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/projects`,
        'POST',
        {
          name: data.name,
        },
        {
          Authorization: `Bearer ${authContext.token}`,
        },
      )
      projectContext.allProjects.push(responseData.data.project)
      let storedData
      const storageData = localStorage.getItem('userData')
      if (storageData) {
        storedData = JSON.parse(storageData)
      }
      storedData['projects'] = projectContext.allProjects
      localStorage.setItem('userData', JSON.stringify(storedData))
      setOpen(true)
    } catch (err) {}
  }

  const changeProjectHandler = (project: IProject) => {
    projectContext.selectProject(project)
    history.push('/tasks')
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
      {loading && <LoadingSpinner isLoading={loading} />}
      {errorModal}
      <form
        className={classes.form}
        onSubmit={handleSubmit(projectSubmitHandler)}
      >
        <Controller
          as={
            <TextField
              error={errors.name ? true : false}
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="プロジェクト名"
            />
          }
          name="name"
          control={control}
          rules={{ required: 'プロジェクト名は必須です' }}
        />

        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formState.isValid}
        >
          プロジェクト作成
        </Button>
      </form>

      <AlertDialog
        show={open}
        dialogTitle="Created New Project!"
        contentText="作成したプロジェクトに切り替えますか？"
        ok={'OK'}
        ng={'キャンセル'}
        actionForYes={() =>
          changeProjectHandler(projectContext.allProjects.slice(-1)[0])
        }
        actionForNo={() => history.push('/tasks')}
        closeDialog={handleClose}
      />
    </Container>
  )
}

export default NewProject
