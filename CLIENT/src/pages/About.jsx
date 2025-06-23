import config from '../config.json';


const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">About Us</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Welcome to the <span className="font-semibold text-blue-700">School Event Management System</span>!
          This platform is designed to streamline event organization in schools. Students can easily browse upcoming
          events, register with a single click, and keep track of their participation history. Meanwhile, admins have powerful
          tools to create, manage, and monitor events, users, and categories — all in one place.
        </p>
      </div>
    </div>
  );
};

export default About;
