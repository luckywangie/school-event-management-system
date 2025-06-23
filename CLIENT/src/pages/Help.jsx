import config from '../config.json';


const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Help Center</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Need assistance? Reach out through our <span className="font-semibold text-blue-700">contact form</span> or email us at <span className="font-semibold text-blue-700">support@school-events.com</span>.
        </p>

        <p className="text-gray-700 text-lg font-semibold mb-2">Common FAQs:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
          <li>How to register for an event?</li>
          <li>How to update your profile?</li>
          <li>How to reset your password?</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
