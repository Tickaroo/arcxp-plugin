import { useEffect, useState } from 'react';
import get from 'lodash.get';
import TickarooSearch from './children/Tickaroo-search.jsx';
import TickarooView from './children/Tickaroo-view.jsx';
import TickarooEdit from './children/Tickaroo-edit.jsx';

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
      {actionID.includes('#SEARCH') && <TickarooSearch />}
      {actionID.includes('#VIEW') && <TickarooView />}
      {actionID.includes('#EDIT') && <TickarooEdit />}
    </div>
  );
};

export default PowerUpTemplate;
