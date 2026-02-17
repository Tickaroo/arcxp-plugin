import { useEffect, useState } from 'react';
import get from 'lodash.get';
import TickarooLiveblogSearch from './children/TickarooLiveblog-search.jsx';
import TickarooLiveblogView from './children/TickarooLiveblog-view.jsx';
import TickarooLiveblogEdit from './children/TickarooLiveblog-edit.jsx';

//This component is the Block that is added to a page
//and it controls which frame to display based on the URL
const PowerUpTemplate = () => {
  const [actionID, setActionID] = useState('');

  const getActionParam = () => {
    const actionHash = get(window, 'location.hash', 'NONE');
    setActionID(actionHash.toUpperCase());
  };

  useEffect(() => getActionParam(), []);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      {actionID.includes('#SEARCH') && <TickarooLiveblogSearch />}
      {actionID.includes('#VIEW') && <TickarooLiveblogView />}
      {actionID.includes('#EDIT') && <TickarooLiveblogEdit />}
    </div>
  );
};

export default PowerUpTemplate;
