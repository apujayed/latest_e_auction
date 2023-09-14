import Tabs from '../../tabs/tabs';
import { TabData } from '../../../types/types';
import Catalog from './dashboard';
import Actions from './Actions';

const tabsData: TabData[] = [
  { name: 'E-Auction', content: <Catalog /> },
  { name: ' Unsold items', content: <Actions /> },
];

function Create(): React.ReactElement {
  return <div className='sm:mt-2'><Tabs tabsData={tabsData} /></div>;
}

export default Create;