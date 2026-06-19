export function ProgressBar({ value }: { value: number }) {
  return <div className="w-full bg-gray-200 h-2"><div className="bg-green-500 h-2" style={{width: `${value}%`}}></div></div>;
}

