import config from '../config.json';


const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Terms & Policies</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          By using this platform, you agree to abide by our terms and policies.
          All user activity is monitored to ensure fair and appropriate use. Data shared will remain confidential.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Violations such as impersonation, spamming, or unauthorized access may lead to account suspension or permanent removal.
        </p>
      </div>
    </div>
  );
};

export default Terms;
