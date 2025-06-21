const Help = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>
      <p className="text-gray-700 mb-4">
        Need assistance? You can reach out through our contact form or email us at support@school-events.com.
      </p>

      <p className="text-gray-700 font-medium">Common FAQs:</p>
      <ul className="list-disc pl-6 mt-2 text-gray-700">
        <li>How to register for an event?</li>
        <li>How to update your profile?</li>
        <li>How to reset your password?</li>
      </ul>
    </div>
  );
};

export default Help;
