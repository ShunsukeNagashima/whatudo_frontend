import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';

function getModalStyle() {
  const top = 25;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

interface ModalProps {
  title: string,
  description: string,
  show: boolean,
  closeModal: any
}

const SimpleModal = (props: ModalProps) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);


  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{props.title}</h2>
      <p id="simple-modal-description">
        {props.description}
      </p>
    </div>
  );

  return (
      <Modal
        open={props.show}
        onClose={props.closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
  );
}

export default SimpleModal