import React from 'react';
import { Link } from 'react-router-dom';
import ExternalLink from '../../components/ExternalLink';
import Logo from '../../foundations/logo';
import { NAME } from '../../lib/helpers/names';

const Home = () => (
  <div className="main-card">
    <div className="flex justify-center my-6">
      <Logo size="lg" />
    </div>
    <p className="my-2">Welcome to {NAME}.</p>
    <p className="my-2">
      {NAME} likely does not work anymore. For a variety of reasons, future
      support will not be provided and the dapp won&apos;t be maintained.
    </p>
    <p className="my-2">
      However all code has been released under the MIT licesnse and is available
      on:{' '}
      <a href="https://github.com/sjk0-9/alg-tx/">
        https://github.com/sjk0-9/akg-tx/
      </a>{' '}
      for anyone interested in using it as a basis for their own project.
    </p>
    <h3 className="my-2">Algorand Tools</h3>
    <ul className="list-disc list-inside">
      <li>
        <Link to="./opt-in">Bulk asset opt in</Link>
      </li>
      <li>
        <Link to="./opt-out">Bulk asset opt out</Link>
      </li>
      <li>
        Algorand atomic transaction interface - contact{' '}
        <ExternalLink to="https://twitter.com/sjk0_9">SJK</ExternalLink> for
        details
      </li>
      <li>
        <span className="text-subtle">More coming soon</span>
      </li>
    </ul>
    <h3 className="my-2">Feedback and support</h3>
    <p className="my-2">Thank you for giving this a go.</p>
    <p className="my-2">
      If you have feedback or want to get in contact, I can be reached via
      twitter. My username is{' '}
      <ExternalLink to="https://twitter.com/sjk0_9">SJK</ExternalLink>.
    </p>
  </div>
);

export default Home;
