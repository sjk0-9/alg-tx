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
      This dapp is currently in very early alpha. There is a lot of work to do,
      and a lot of stuff that probably doesn&apos;t work quite right.
    </p>
    <p className="my-2">
      That said, there&apos;s also a lot of new and exciting stuff coming soon.
      Stay tuned, and while you&apos;re waiting, feel free to make use of some
      of our handy tools.
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
