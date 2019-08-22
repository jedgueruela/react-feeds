import React, {
  Fragment
} from 'react';
import {
  Connections,
  PostForm,
  Timeline
} from '../components';

const Home = () => {
  return (
    <Fragment>
      <PostForm />
      <Connections />
      <Timeline />
    </Fragment>
  );
}

export default Home;
