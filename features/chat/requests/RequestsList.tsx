import { PendingRequests } from './PendingRequests';
import { Search } from './Search';

export function RequestsList() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto_1fr] h-full min-h-0 w-full min-w-0 overflow-hidden bg-[#121214] border-[#1E1E22]">
      <div className="flex flex-col justify-center items-start p-4 border-b-4 border-[#1E1E22]">
        <p className="font-ui text-xl text-[#F3E8FF]">Search</p>
      </div>

      <Search />

      <div className="flex flex-col justify-center items-start p-4 border-y-4 border-[#1E1E22]">
        <p className="font-ui text-xl text-[#F3E8FF]">Requests</p>
      </div>

      <PendingRequests />
    </div>
  );
}
