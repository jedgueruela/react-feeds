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
    this.ref = this.API.Timeline.byUserID("uid0");
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
    this.API.Post.remove(key).then(() => {
      console.log('great! deleted!');
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="posts">
        { posts && posts.map(feed => {
          return (
            <p key={ feed.key }>
              { feed.body }
              <button onClick={ () => this.removePost(feed.key) }>Delete</button>
            </p>
          )
        }) }
      </div>
    );
  }
}


// get the timeline of the current user

export default withAPI(Timeline);
