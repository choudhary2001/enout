export default function MessagesPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">
          Messages placeholder for event: {params.id}
        </p>
      </div>
    </div>
  );
}
