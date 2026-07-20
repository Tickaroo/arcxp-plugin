import { useEffect, useState } from 'react';
import get from 'lodash.get';
import TickarooLiveblogTeaserSearch from './children/TickarooLiveblogTeaser-search.jsx';
import TickarooLiveblogTeaserView from './children/TickarooLiveblogTeaser-view.jsx';
import TickarooLiveblogTeaserEdit from './children/TickarooLiveblogTeaser-edit.jsx';

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
      {actionID.includes('#SEARCH') && <TickarooLiveblogTeaserSearch />}
      {actionID.includes('#VIEW') && <TickarooLiveblogTeaserView />}
      {actionID.includes('#EDIT') && <TickarooLiveblogTeaserEdit />}
    </div>
  );
};

export default PowerUpTemplate;
