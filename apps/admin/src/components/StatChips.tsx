interface StatChipsProps {
  invited: number;
  accepted: number;
  registered: number;
}

export function StatChips({ invited, accepted, registered }: StatChipsProps) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
        {invited} Invited
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
        {accepted} Accepted
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
        {registered} Registered
      </div>
    </div>
  );
}
