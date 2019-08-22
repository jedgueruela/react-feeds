import React, {
  Component
} from 'react';
import { withAPI } from '../api';

const INITIAL_STATE = {
  post: {
    body: '',
    attachments: []
  },
  isFormLoading: false,
  error: null
};

class PostForm extends Component {
  constructor(props) {
    super(props);

    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  onSubmit = (event) => {
    event.preventDefault();

    const form = event.target;

    this.setState({
      isFormLoading: true
    });

    this.props.API.Posts.create(this.state.post).then(response => {
      console.log('winner winner chicken dinner');
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      form.reset();
      this.setState({
        post: {
          ...INITIAL_STATE.post
        },
        ...INITIAL_STATE
      });
    });
  }

  onChange = (event) => {
    const {
      files,
      name,
      value
    } = event.target;

    this.setState({
      post: {
        ...this.state.post,
        [name]: (files !== undefined) ? files : value
      }
    });
  }

  render() {
    return (
      <form onSubmit={ this.onSubmit }>
        <fieldset disabled={ this.state.isFormLoading }>
          <label htmlFor="body">Body</label>
          <textarea
            name="body"
            id="body"
            onChange={ this.onChange }
            />
          <label htmlFor="attachment">Attachments</label>
          <input
            type="file"
            name="attachments"
            id="attachments"
            onChange={ this.onChange }
            />
          <button>Submit</button>
        </fieldset>
      </form>
    );
  }
}

export default withAPI(PostForm);
