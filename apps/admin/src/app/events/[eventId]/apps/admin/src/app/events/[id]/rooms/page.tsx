export default function RoomsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Rooms</h2>
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">
          Rooms placeholder for event: {params.id}
        </p>
      </div>
    </div>
  );
}
