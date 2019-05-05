import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Message, InputOnChangeData } from 'semantic-ui-react';
import { fileApiRequested } from '../../actions/api';
import { fileApiSelector } from '../../selectors/api';
import { IApiState, IState as Store } from '../../types/redux';

interface IState {
  [key: string]: string;
}

interface IProps extends IApiState {
  fileApiRequested: typeof fileApiRequested;
}

interface IEventProps {
  name: string;
  value: string;
}

export class FileApi extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { fileUrl: '', fileName: '' };
  }

  public render() {
    const { fileUrl, fileName } = this.state;
    const { error, inProgress, result } = this.props;
    return (
      <Form
        onSubmit={this.onFileSave}
        loading={inProgress}
        error={!!error}
        success={!!result}
      >
        <Form.Group>
          <Form.Input
            placeholder="File Url"
            name="fileUrl"
            type="url"
            value={fileUrl}
            onChange={this.handleChange}
            required={true}
            id="fileUrl"
          />
          <Form.Input
            placeholder="File Name"
            name="fileName"
            type="text"
            value={fileName}
            onChange={this.handleChange}
            required={true}
            id="fileName"
          />
          <Button content="Save File" />
        </Form.Group>
        <Message success={true} header="File Api Result" content={result} />
        <Message
          error={true}
          header="Error Saving File"
          content={error && error.message}
        />
      </Form>
    );
  }

  private handleChange = (
    _: React.SyntheticEvent<HTMLInputElement, Event>,
    data: InputOnChangeData,
  ) => {
    const { name, value } = data as IEventProps;
    this.setState({ [name]: value });
  };

  private onFileSave = () =>
    this.props.fileApiRequested(this.state.fileUrl, this.state.fileName);
}

const mapStateToProps = (state: Store) => ({
  ...fileApiSelector(state),
});

export default connect(
  mapStateToProps,
  { fileApiRequested },
)(FileApi);
