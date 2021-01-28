import React, {useState, useContext} from 'react';
import {
  Container,
  Button,
  TextField,
  Typography,
} from '@material-ui/core'
import { useHttpClient } from '../../shared/hooks/http-hook';
import { ProjectContext } from '../../shared/contexts/project-context';
import { AuthContext } from '../../shared/contexts/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  linkField: {
    width: '90%'
  },
  marginTop: {
    marginTop: theme.spacing(2)
  }
}))

const InviteUser = () => {

  const { loading, error, sendRequest, clearError } = useHttpClient();
  const [ inviteLink, setInviteLink ] = useState<string>('');
  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const classes = useStyles();

  const createInvitationLink = async () => {
    const responseData = await sendRequest(
      `http://localhost:5000/api/projects/invite/${projectContext.selectedProject!._id}`,
      'GET',
      null,
      {
        Authorization: `Bearer ${authContext.token}`
      }
    )
    const token = responseData.data.invitationToken;
    console.log(responseData);
    const url = `http://localhost:3000/projects/addUser?token=${token}`
    setInviteLink(url);
  }

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

  return (
    <Container className={classes.root}>
      { errorModal }
      {loading && <LoadingSpinner isLoading={loading} />}
      <Typography component='h3' variant='h4' color='textSecondary'>
        メンバー招待
      </Typography>
      <Typography component='h5' variant='h6' color='textSecondary' className={classes.marginTop}>
        「招待リンク」ボタンをクリックして、生成されたURLを招待するメンバーに送信してください。<br/>
        リンクの有効期限は10分です。
      </Typography>
      {!loading && inviteLink &&
      <TextField
        className={`${classes.linkField} ${classes.marginTop}`}
        variant='outlined'
        multiline
        rows={4}
        value={inviteLink}
        inputProps={{
          readOnly: true
        }}/>
      }
      <Button
        className={classes.marginTop}
        onClick={createInvitationLink}
        variant="contained"
        color="primary"
      >
        招待リンク作成
      </Button>
    </Container>
  )
}

export default InviteUser