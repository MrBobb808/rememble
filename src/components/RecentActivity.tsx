interface ActivityProps {
  photos: Array<{ id: number; url: string; caption: string }>;
}

const RecentActivity = ({ photos }: ActivityProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
      <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {photos.length > 0 ? (
          photos.slice(-3).map((photo, index) => (
            <div key={index} className="flex items-start gap-3 text-sm text-gray-600 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-memorial-blue mt-2" />
              <p>A new memory was added {index === 0 ? "just now" : index === 1 ? "yesterday" : "last week"}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;