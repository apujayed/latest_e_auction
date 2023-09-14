import Tabs from '../../tabs/tabs';
import { TabData } from '../../../types/types';
import Catalog from './catalog';
import Action from './Actions';

const tabsData: TabData[] = [
  { name: 'Create', content: <Catalog /> },
  { name: 'Edit', content: <Action /> },
];

function Create(): React.ReactElement {
  return <div className='sm:mt-2'><Tabs tabsData={tabsData} /></div>;
}

export default Create;