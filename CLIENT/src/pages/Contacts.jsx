import config from '../config.json';


const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Contact Us</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          We’d love to hear from you! For any inquiries, feel free to get in touch via the following channels:
        </p>

        <div className="text-gray-700 text-lg leading-relaxed space-y-2">
          <p>📧 <span className="font-semibold">Email:</span> support@school-events.com</p>
          <p>📞 <span className="font-semibold">Phone:</span> +254 712 345 678</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
