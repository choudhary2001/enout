export default function SchedulePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Schedule</h2>
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">
          Schedule placeholder for event: {params.id}
        </p>
      </div>
    </div>
  );
}
