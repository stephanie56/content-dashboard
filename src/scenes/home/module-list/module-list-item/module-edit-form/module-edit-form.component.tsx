import * as React from 'react';
import { ContentModule } from '../../../../../constants';
import { Field, reduxForm, WrappedFieldMetaProps } from 'redux-form';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField, { TextFieldProps as MUITextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const RequiredValidation = (val) => Boolean(val) ? undefined : 'This is a required field';

interface ReduxFormProps {
  input?: any;
  validate?: Array<(val: any) => boolean | string>;
  meta?: WrappedFieldMetaProps;
}

type FullTextFieldProps = ReduxFormProps & MUITextFieldProps;

const renderField = ({
  defaultValue,
  input,
  label,
  meta,
  ...custom
}: FullTextFieldProps) => (
  <TextField
    type="text"
    fullWidth={true}
    error={meta.touched && meta.error}
    defaultValue={defaultValue}
    label={label}
    helperText={meta.error}
    {...input}
    {...custom}
  />
)

const textFields = ['name', 'complexity', 'content', 'homework', 'slides'];

export const EditForm = (props) => {
  const { currentModule } = props;
  return (
    <form>
      {
        textFields.map((prop, index) => {
          return (
            <Field
              name={prop}
              required={true}
              label={prop.charAt(0).toUpperCase() + prop.slice(1)}
              component={renderField}
              validate={[RequiredValidation]}
              defaultValue={String(currentModule[prop])}
              key={index}
            />
          );
        })
      }
    </form>
  );
}



const ReduxEditFormFragment = reduxForm({
  form: 'editForm', // a unique identifier for this form
  // add validation functions here
})(EditForm) as any;


export const ReduxEditForm = connect((state, ownProps: any) => ({
  ...ownProps,
  initialValues: ownProps.currentModule
}))(ReduxEditFormFragment);

/// TODO: Split it into two components


/**
 * 
 * The EditFormModal contain the Editform that is wrapped in reduxForm
 * The EditFormModal pass props to Editform
 * 
 * **/
interface FormDialogProps {
  id: string;
  modules: ContentModule[];
}

interface FormDialogState {
  open: boolean;
  currentModule: ContentModule;
  currentModuleIndex: number;
}
export class EditFormModal extends React.Component<FormDialogProps, FormDialogState> {
  state = {
    open: false,
    currentModule: this.props.modules.find(mod => mod.id === this.props.id),
    currentModuleIndex: this.props.modules.map(mod => mod.id).indexOf(this.props.id)
  };

  toggleModal = () => {
    this.setState({ 
      open: !this.state.open 
    });
  }

  updateTextFieldInputValue = ({target: {id, value}}) => {
    const textFieldValue = isNaN(value) ? value.trim() : parseInt(value, 10);
    this.setState({
      currentModule: {
        ...this.state.currentModule,
        [id]: textFieldValue
      }
    });
  }

  updateTextFieldGroupValue = (e) => {
    const {target: {name, value}} = e;
    const index = e.target.getAttribute('data-index');
    this.setState({
      currentModule: {
        ...this.state.currentModule,
        [name]: [
          ...this.state.currentModule[name].slice(0, index), 
          value.trim(), 
          ...this.state.currentModule[name].slice(index + 1)
        ]
      }
    });
  }

  addNewFormField = (id: string) => {
    this.setState({
      currentModule: {
        ...this.state.currentModule,
        [id]: this.state.currentModule[id].concat('') 
      }
    });
  }

  handleModuleUpdate = (e) => {
    e.preventDefault();
    this.toggleModal();
  }

  render() {
    return (
      <div>
        <Button 
          variant="contained" 
          color="default"
          size="small"
          onClick={this.toggleModal}
        >
          Edit
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.toggleModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Module</DialogTitle>
          <DialogContent>
            <ReduxEditForm 
              currentModule={this.state.currentModule}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}