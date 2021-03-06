import React, {
  Component
} from 'react';
import { withAPI } from '../api';

const INITIAL_STATE = {
  posts: []
}

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.API = this.props.API;
    this.ref = this.API.Timelines.byUserID("uid0");
  }

  componentDidMount() {
    this.ref.on('value', snapshot => {
      const data = snapshot.val();
      const posts = [];

      if (data) {
        Object.keys(data).forEach(key => {
          posts.push({
            ...data[key],
            key
          });
        });
      }

      this.setState({
        posts
      });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

  removePost = key => {
    this.API.Posts.remove(key).then(() => {
      console.log('great! deleted!');
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="posts">
        { posts && posts.map(post => {
          return (
            <p key={ post.key }>
              { post.body }
              <button onClick={ () => this.removePost(post.key) }>Delete</button>
            </p>
          )
        }) }
      </div>
    );
  }
}


// get the timeline of the current user

export default withAPI(Timeline);
