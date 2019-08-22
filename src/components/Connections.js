import React, {
  Component
} from 'react';
import { withAPI } from '../api';

const INITIAL_STATE = {
  connections: []
}

class Connections extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.API = this.props.API;
    this.ref = this.API.Connections.byUserID("uid0");
  }

  componentDidMount() {
    this.ref.on('value', snapshot => {
      const data = snapshot.val();
      const connections = [];

      if (data) {
        Object.keys(data).forEach(key => {
          connections.push({
            ...data[key],
            key
          });
        });
      }

      this.setState({
        connections
      });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

  removeConnection = (userKey, connectionKey) => {
    this.API.Connections.remove(userKey, connectionKey).then(() => {
      console.log('great! deleted!');
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const { connections } = this.state;

    return (
      <div className="connections">
        { connections && connections.map(connection => {
          return (
            <p key={ connection.key }>
              { connection.key }
              <button onClick={ () => this.removeConnection("uid0", connection.key) }>
                Delete
              </button>
            </p>
          )
        }) }
      </div>
    );
  }
}


// get the timeline of the current user

export default withAPI(Connections);
