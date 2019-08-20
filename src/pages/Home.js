import React, {
  Fragment
} from 'react';
import {
  PostForm,
  Timeline
} from '../components';

const Home = () => {
  return (
    <Fragment>
      <PostForm />
      <Timeline />
    </Fragment>
  );
}

export default Home;
